import argparse
import os
import re
import time
import json
import pathlib
import queue
from urllib.parse import urljoin, urlparse

import requests
from bs4 import BeautifulSoup

import faiss
import numpy as np

import dspy
from openai import OpenAI
from dotenv import load_dotenv

# ---------- CONFIG ----------
load_dotenv()  # load from .env

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_MODEL = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
OPENAI_EMBEDDING_MODEL = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-large")

if not OPENAI_API_KEY:
    raise SystemExit("❌ Missing OPENAI_API_KEY in .env")

client = OpenAI(api_key=OPENAI_API_KEY)

DATA_DIR = pathlib.Path("data")
INDEX_DIR = pathlib.Path("index")
DATA_DIR.mkdir(exist_ok=True)
INDEX_DIR.mkdir(exist_ok=True)

SEED_URLS = [
    "https://www.zus.pl/baza-wiedzy",
    "https://www.zus.pl/swiadczenia/emerytury/kalkulatory-emerytalne/emerytura-na-nowych-zasadach/kalkulator-emerytalny-prognozowana-emerytura",
]

ALLOWED_NETLOCS = {urlparse(u).netloc for u in SEED_URLS}
CRAWL_MAX_PAGES = 80
REQUEST_TIMEOUT = 20
SLEEP_BETWEEN_REQ = 0.8

# ---------- HELPERS ----------

def clean_text(html: str) -> str:
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup(["script", "style", "noscript"]):
        tag.decompose()
    for tag in soup.find_all(["nav", "footer", "form"]):
        tag.decompose()
    text = soup.get_text(separator="\n")
    text = re.sub(r"\n{2,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)
    return text.strip()

def is_valid_link(link: str, base_url: str) -> bool:
    if not link:
        return False
    full = urljoin(base_url, link)
    p = urlparse(full)
    if p.scheme not in {"http", "https"}:
        return False
    if p.netloc not in ALLOWED_NETLOCS:
        return False
    if any(p.path.lower().endswith(ext) for ext in [".pdf", ".jpg", ".png", ".gif", ".zip"]):
        return False
    return True

def fetch(url: str) -> str:
    resp = requests.get(url, timeout=REQUEST_TIMEOUT, headers={"User-Agent": "ZUS-RAG-Bot/1.0"})
    resp.raise_for_status()
    return resp.text

def save_page_text(url: str, text: str) -> pathlib.Path:
    safe_name = re.sub(r"[^a-zA-Z0-9_-]+", "_", url.strip("/"))[:200]
    if not safe_name:
        safe_name = "index"
    path = DATA_DIR / f"{safe_name}.txt"
    with open(path, "w", encoding="utf-8") as f:
        f.write(f"URL: {url}\n\n{text}")
    return path

def crawl_and_save(seed_urls=SEED_URLS, max_pages=CRAWL_MAX_PAGES):
    visited = set()
    q = queue.Queue()
    for u in seed_urls:
        q.put(u)
    saved = []
    while not q.empty() and len(visited) < max_pages:
        url = q.get()
        if url in visited:
            continue
        visited.add(url)
        try:
            html = fetch(url)
            text = clean_text(html)
            path = save_page_text(url, text)
            saved.append(str(path))
            print(f"[saved] {url} -> {path.name}")
            time.sleep(SLEEP_BETWEEN_REQ)

            soup = BeautifulSoup(html, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if is_valid_link(href, url):
                    q.put(urljoin(url, href))

        except Exception as e:
            print(f"[skip] {url} ({e})")
    return saved

def read_corpus():
    corpus = []
    files = list(DATA_DIR.glob("*.txt"))
    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            txt = f.read()
        corpus.append({"path": str(fp), "text": txt})
    return corpus

def chunk_text(text: str, chunk_chars=1200, overlap=150):
    text = re.sub(r"\n{3,}", "\n\n", text)
    chunks = []
    i = 0
    while i < len(text):
        chunk = text[i : i + chunk_chars]
        chunks.append(chunk.strip())
        i += chunk_chars - overlap
    return [c for c in chunks if len(c) > 200]

def embed_texts(texts):
    if not texts:
        raise SystemExit("No texts to embed. Did you run --scrape successfully?")
    return np.array([d.embedding for d in client.embeddings.create(
        model=OPENAI_EMBEDDING_MODEL, input=texts
    ).data], dtype="float32")


def build_faiss_index():
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

    print(f"[index] {len(passages)} chunks")

    # >>> ADD THIS GUARD HERE <<<
    if not passages:
        raise SystemExit(
            "No chunks found. Make sure ./data contains non-empty .txt files "
            "(run --scrape), or lower the chunk length filter in chunk_text()."
        )
    # >>> END GUARD <<<

    vecs = embed_texts(passages)  # this won't run if passages is empty
    d = vecs.shape[1]
    index = faiss.IndexFlatIP(d)
    faiss.normalize_L2(vecs)
    index.add(vecs)

    faiss.write_index(index, str(INDEX_DIR / "faiss.index"))
    with open(INDEX_DIR / "meta.json", "w", encoding="utf-8") as f:
        json.dump({"passages": passages, "meta": meta}, f, ensure_ascii=False, indent=2)

    print("[index] saved to ./index/")


def load_faiss_index():
    index_path = INDEX_DIR / "faiss.index"
    meta_path = INDEX_DIR / "meta.json"
    if not index_path.exists() or not meta_path.exists():
        raise SystemExit("⚠️ Missing index. Run with --build first.")
    index = faiss.read_index(str(index_path))
    with open(meta_path, "r", encoding="utf-8") as f:
        meta = json.load(f)
    return index, meta["passages"], meta["meta"]

def retrieve(query: str, k=5):
    index, passages, meta = load_faiss_index()
    qvec = embed_texts([query]).astype("float32")
    faiss.normalize_L2(qvec)
    D, I = index.search(qvec, k)
    out = []
    for rank, idx in enumerate(I[0].tolist()):
        out.append({
            "rank": rank + 1,
            "passage": passages[idx],
            "meta": meta[idx],
            "score": float(D[0][rank]),
        })
    return out

# ---------- DSPy ----------
class AnswerRetirementSignature(dspy.Signature):
    """Answer user’s question about ZUS retirement calculator based on context."""
    context = dspy.InputField(desc="Retrieved passages")
    question = dspy.InputField()
    answer = dspy.OutputField(desc="Answer with short inline citations")

def configure_dspy():
    lm = dspy.OpenAI(model=OPENAI_MODEL, api_key=OPENAI_API_KEY)
    dspy.configure(lm=lm)

def rag_answer(question: str, k=5) -> str:
    hits = retrieve(question, k=k)
    ctx_blocks = []
    for h in hits:
        src = h["meta"].get("url") or h["meta"].get("source", "")
        ctx_blocks.append(f"[{h['rank']}] {h['passage']}\n(Source: {src})")
    context = "\n\n---\n\n".join(ctx_blocks)
    predictor = dspy.Predict(AnswerRetirementSignature)
    pred = predictor(context=context, question=question)
    return pred.answer

# ---------- CLI ----------
def main():
    parser = argparse.ArgumentParser(description="ZUS Retirement Calculator RAG Bot")
    parser.add_argument("--scrape", action="store_true")
    parser.add_argument("--build", action="store_true")
    parser.add_argument("--ask", type=str)
    parser.add_argument("--chat", action="store_true")
    parser.add_argument("--k", type=int, default=5)
    args = parser.parse_args()

    configure_dspy()

    if args.scrape:
        crawl_and_save()

    if args.build:
        build_faiss_index()

    if args.ask:
        ans = rag_answer(args.ask, k=args.k)
        print("\n=== Answer ===\n", ans)

    if args.chat:
        print("ZUS Chatbot (type 'exit' to quit)\n")
        while True:
            q = input("You: ").strip()
            if q.lower() in {"exit", "quit"}:
                break
            ans = rag_answer(q, k=args.k)
            print("Bot:", ans, "\n")

if __name__ == "__main__":
    main()
