import argparse
import json
import os
import pathlib
import queue
import re
import time
from urllib.parse import urljoin, urlparse

import bm25s
import dspy
import requests
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

if not OPENAI_API_KEY:
    raise SystemExit("❌ Missing OPENAI_API_KEY in .env")

DATA_DIR = pathlib.Path("data")
INDEX_DIR = pathlib.Path("index")
DATA_DIR.mkdir(exist_ok=True)
INDEX_DIR.mkdir(exist_ok=True)

SEED_URLS = [
    "https://www.zus.pl/baza-wiedzy",
    #"https://www.zus.pl/swiadczenia/emerytury/kalkulatory-emerytalne/emerytura-na-nowych-zasadach/kalkulator-emerytalny-prognozowana-emerytura",
]
ALLOWED_NETLOCS = {urlparse(u).netloc for u in SEED_URLS}
CRAWL_MAX_PAGES = 80
REQUEST_TIMEOUT = 20
SLEEP_BETWEEN_REQ = 0.8

def clean_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript", "nav", "footer", "form"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    return re.sub(r"[ \t]{2,}", " ", re.sub(r"\n{2,}", "\n\n", text)).strip()

def is_valid_link(link: str, base_url: str) -> bool:
    if not link:
        return False
    p = urlparse(urljoin(base_url, link))
    return (p.scheme in {"http", "https"} and 
            p.netloc in ALLOWED_NETLOCS and 
            not any(p.path.lower().endswith(ext) for ext in [".pdf", ".jpg", ".png", ".gif", ".zip"]))

def fetch(url: str) -> str:
    return requests.get(url, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "ZUS-RAG-Bot/1.0"}).text

def save_page_text(url: str, text: str) -> pathlib.Path:
    safe_name = re.sub(r"[^a-zA-Z0-9_-]+", "_", url.strip("/"))[:200] or "index"
    path = DATA_DIR / f"{safe_name}.txt"
    path.write_text(f"URL: {url}\n\n{text}", encoding="utf-8")
    return path

def crawl_and_save(seed_urls=SEED_URLS, max_pages=CRAWL_MAX_PAGES):
    visited = set()
    q = queue.Queue()
    for u in seed_urls:
        q.put(u)
    
    while not q.empty() and len(visited) < max_pages:
        url = q.get()
        if url in visited:
            continue
        visited.add(url)
        
        try:
            html = fetch(url)
            text = clean_text(html)
            path = save_page_text(url, text)
            print(f"[saved] {url} -> {path.name}")
            time.sleep(SLEEP_BETWEEN_REQ)
            
            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                if is_valid_link(a["href"], url):
                    q.put(urljoin(url, a["href"]))
        except Exception as e:
            print(f"[skip] {url} ({e})")

def read_corpus():
    return [{"path": str(fp), "text": fp.read_text(encoding="utf-8")} 
            for fp in DATA_DIR.glob("*.txt")]

def chunk_text(text: str, chunk_chars=1200, overlap=150):
    text = re.sub(r"\n{3,}", "\n\n", text)
    chunks = []
    i = 0
    while i < len(text):
        chunk = text[i:i + chunk_chars].strip()
        if len(chunk) > 200:
            chunks.append(chunk)
        i += chunk_chars - overlap
    return chunks

def build_bm25_index():
    corpus = read_corpus()
    if not corpus:
        raise SystemExit("⚠️ No files in ./data. Run with --scrape first.")
    
    passages, meta = [], []
    for doc in corpus:
        url_match = re.search(r"^URL:\s*(.*)$", doc["text"], flags=re.MULTILINE)
        src_url = url_match.group(1).strip() if url_match else ""
        body = re.sub(r"^URL:.*\n\n", "", doc["text"], flags=re.DOTALL)
        for ch in chunk_text(body):
            passages.append(ch)
            meta.append({"source": doc["path"], "url": src_url})
    
    if not passages:
        raise SystemExit("No chunks found. Run --scrape or adjust chunk_text settings.")
    
    print(f"[index] {len(passages)} chunks")
    
    # Tokenize and build BM25 index
    tokenized_passages = bm25s.tokenize(passages, stopwords="en")
    retriever = bm25s.BM25()
    retriever.index(tokenized_passages)
    
    # Save index and metadata
    retriever.save(str(INDEX_DIR / "bm25_index"))
    (INDEX_DIR / "meta.json").write_text(
        json.dumps({"passages": passages, "meta": meta}, ensure_ascii=False, indent=2),
        encoding="utf-8")
    print("[index] saved to ./index/")

def load_bm25_index():
    index_path, meta_path = INDEX_DIR / "bm25_index", INDEX_DIR / "meta.json"
    if not index_path.exists() or not meta_path.exists():
        raise SystemExit("⚠️ Missing index. Run with --build first.")
    
    meta = json.loads(meta_path.read_text(encoding="utf-8"))
    retriever = bm25s.BM25.load(str(index_path), mmap=True)
    return retriever, meta["passages"], meta["meta"]

class BM25Retriever(dspy.Retrieve):
    def __init__(self, k=5):
        super().__init__(k=k)
        self.retriever, self.passages, self.meta = load_bm25_index()
    
    def forward(self, query: str, k: int = None) -> list[str]:
        k = k or self.k
        query_tokens = bm25s.tokenize(query, stopwords="en")
        results, scores = self.retriever.retrieve(query_tokens, k=k)
        
        return [f"{self.passages[idx]}\n(Source: {self.meta[idx].get('url') or self.meta[idx].get('source', '')})"
                for idx in results[0]]

class GenerateAnswer(dspy.Signature):
    """Answer user's question about ZUS retirement calculator based on retrieved context."""
    context: list[str] = dspy.InputField(desc="Retrieved passages from knowledge base")
    question: str = dspy.InputField(desc="User's question")
    answer: str = dspy.OutputField(desc="Detailed answer with inline citations to sources")

class RetirementRAG(dspy.Module):
    def __init__(self, k=5):
        super().__init__()
        self.retrieve = BM25Retriever(k=k)
        self.generate_answer = dspy.ChainOfThought(GenerateAnswer)
    
    def forward(self, question: str):
        context = self.retrieve(question)
        prediction = self.generate_answer(context=context, question=question)
        return dspy.Prediction(context=context, answer=prediction.answer)

def configure_dspy():
    dspy.configure(lm=dspy.LM(f"openai/{OPENAI_MODEL}", api_key=OPENAI_API_KEY))

def main():
    parser = argparse.ArgumentParser(description="ZUS Retirement Calculator RAG Bot")
    parser.add_argument("--scrape", action="store_true")
    parser.add_argument("--build", action="store_true")
    parser.add_argument("--ask", type=str)
    parser.add_argument("--chat", action="store_true")
    parser.add_argument("--k", type=int, default=5)
    args = parser.parse_args()
    
    if args.scrape:
        crawl_and_save()
    
    if args.build:
        build_bm25_index()
    
    if args.ask or args.chat:
        configure_dspy()
        rag = RetirementRAG(k=args.k)
    
    if args.ask:
        print("\n=== Answer ===\n", rag(args.ask).answer)
    
    if args.chat:
        print("ZUS Chatbot (type 'exit' to quit)\n")
        while True:
            q = input("You: ").strip()
            if q.lower() in {"exit", "quit"}:
                break
            print("Bot:", rag(q).answer, "\n")

if __name__ == "__main__":
    main()