import React from "react";
import { ZusText } from "../zus-ui";

/* --- Types --- */
type QuizQuestion = {
  question: string;
  answers: string[];
  correct: number;          // index of the correct answer
  explanation: string;      // "Uzasadnienie"
  section?: string;         // optional grouping (PPK, PPE, etc.)
};

/* --- Full Question Set (40) --- */
const QUIZ_QUESTIONS: QuizQuestion[] = [
  // PPK – Pracownicze Plany Kapitałowe
  {
    question: "W PPK obowiązkowa składka pracownika wynosi:",
    answers: ["1% wynagrodzenia brutto", "2% wynagrodzenia brutto", "4% wynagrodzenia brutto"],
    correct: 1,
    explanation: "Uczestnik PPK wpłaca 2% pensji, z możliwością zwiększenia do 4%.",
    section: "PPK",
  },
  {
    question: "Kto finansuje składkę podstawową w PPK oprócz pracownika?",
    answers: ["Tylko państwo", "Pracodawca", "Fundusz inwestycyjny"],
    correct: 1,
    explanation: "Pracodawca dopłaca minimum 1,5% wynagrodzenia do PPK.",
    section: "PPK",
  },
  {
    question: "Jaką dopłatę powitalną otrzymuje uczestnik PPK od państwa?",
    answers: ["120 zł", "250 zł", "500 zł"],
    correct: 1,
    explanation: "Państwo przekazuje 250 zł powitalne i 240 zł rocznie dopłaty.",
    section: "PPK",
  },
  {
    question: "Aby uniknąć podatku Belki, po 60 r.ż. najlepiej wypłacić:",
    answers: ["100% jednorazowo", "25% jednorazowo, 75% w ratach (min. 120)", "50% jednorazowo, 50% w ratach"],
    correct: 1,
    explanation: "Taki podział umożliwia zwolnienie z podatku Belki.",
    section: "PPK",
  },
  {
    question: "Czy można mieć jednocześnie PPK i PPE?",
    answers: [
      "Tak, ale tylko jeśli PPE ma składkę <3,5%",
      "Nie, to się wyklucza",
      "Tak, zawsze",
    ],
    correct: 0,
    explanation:
      "Firma z PPE z min. 3,5% składką i 25% załogi w programie może być zwolniona z PPK.",
    section: "PPK",
  },

  // PPE – Pracownicze Programy Emerytalne
  {
    question: "PPE finansuje głównie:",
    answers: ["Pracodawca", "Pracownik", "Państwo"],
    correct: 0,
    explanation: "PPE to benefit pracodawcy – składka może wynosić do 7% wynagrodzenia.",
    section: "PPE",
  },
  {
    question: "Uczestnictwo w PPE jest:",
    answers: ["Obowiązkowe", "Dobrowolne", "Uzależnione od wieku"],
    correct: 1,
    explanation: "To dobrowolny program dla pracowników firm, które go prowadzą.",
    section: "PPE",
  },
  {
    question:
      "Co daje firmie prowadzenie PPE z min. 3,5% składką i 25% załogi w programie?",
    answers: ["Zwolnienie z PPK", "Ulgi podatkowe", "Obowiązek wprowadzenia PPK"],
    correct: 0,
    explanation: "Taka firma nie musi uruchamiać PPK.",
    section: "PPE",
  },
  {
    question: "Maksymalna składka podstawowa PPE wynosi:",
    answers: ["2%", "5%", "7%"],
    correct: 2,
    explanation: "Pracodawca może wpłacać do 7% wynagrodzenia.",
    section: "PPE",
  },
  {
    question: "Czy w PPE można dopłacać własne środki?",
    answers: ["Nie", "Tak, dobrowolnie", "Tylko jeśli pracodawca się zgodzi"],
    correct: 1,
    explanation: "Pracownik może sam zwiększać swoje wpłaty w PPE.",
    section: "PPE",
  },

  // IKE – Indywidualne Konto Emerytalne
  {
    question: "Czy wpłaty na IKE można odliczyć w PIT?",
    answers: ["Tak", "Nie", "Tylko do 5 000 zł"],
    correct: 1,
    explanation:
      "IKE nie daje ulgi podatkowej dziś, ale pozwala uniknąć podatku Belki przy wypłacie.",
    section: "IKE",
  },
  {
    question: "W jakim wieku można wypłacić środki z IKE bez podatku Belki?",
    answers: ["55 lat", "60 lat", "65 lat"],
    correct: 1,
    explanation: "Po ukończeniu 60 r.ż. lub 55 r.ż. z uprawnieniami emerytalnymi.",
    section: "IKE",
  },
  {
    question: "Warunkiem zwolnienia z podatku Belki jest:",
    answers: [
      "Regularne wpłaty przez 5 lat",
      "Posiadanie IKE powyżej 10 lat",
      "Wpłata powyżej 20 000 zł",
    ],
    correct: 0,
    explanation:
      "Musisz wpłacać co najmniej w 5 różnych latach lub połowę środków 5 lat przed wypłatą.",
    section: "IKE",
  },
  {
    question: "Limit wpłat na IKE w 2025 r. to:",
    answers: ["ok. 20 000 zł", "10 000 zł", "30 000 zł"],
    correct: 0,
    explanation:
      "Limit jest równy trzykrotności przeciętnego wynagrodzenia (ok. 20 tys. zł w 2025 r.).",
    section: "IKE",
  },
  {
    question: "Wypłata z IKE przed terminem:",
    answers: ["Skutkuje podatkiem Belki", "Jest bezkarna", "Jest niemożliwa"],
    correct: 0,
    explanation:
      "Można wypłacić środki wcześniej, ale z potrąceniem podatku od zysków.",
    section: "IKE",
  },

  // IKZE – Indywidualne Konto Zabezpieczenia Emerytalnego
  {
    question: "IKZE różni się od IKE tym, że:",
    answers: [
      "Daje ulgę podatkową przy wpłacie",
      "Jest tylko dla przedsiębiorców",
      "Nie można wypłacić do 70 r.ż.",
    ],
    correct: 0,
    explanation: "Wpłaty na IKZE można odliczyć w rocznym PIT.",
    section: "IKZE",
  },
  {
    question: "Przy wypłacie po 65 r.ż. i 5 latach oszczędzania płacisz:",
    answers: ["Podatek Belki", "Zryczałtowany 10% PIT", "Nic"],
    correct: 1,
    explanation:
      "Zamiast 19% podatku Belki obowiązuje 10% PIT ryczałtowy.",
    section: "IKZE",
  },
  {
    question: "Limit wpłat na IKZE w 2025 r. dla osób fizycznych to:",
    answers: ["6 000 zł", "ok. 10 000 zł", "20 000 zł"],
    correct: 1,
    explanation:
      "Limit stanowi 1,2-krotność przeciętnego wynagrodzenia rocznie.",
    section: "IKZE",
  },
  {
    question: "Co się dzieje przy wcześniejszej wypłacie z IKZE?",
    answers: ["Płacisz podatek według skali PIT", "Tracisz wszystkie środki", "Nic się nie dzieje"],
    correct: 0,
    explanation:
      "Przed 65 r.ż. całość środków traktowana jest jako dochód.",
    section: "IKZE",
  },
  {
    question: "IKZE może posiadać:",
    answers: [
      "Tylko pracownik etatowy",
      "Każda osoba mająca dochody opodatkowane",
      "Tylko osoba z umową o dzieło",
    ],
    correct: 1,
    explanation:
      "Prawo do IKZE ma każdy płacący podatek dochodowy.",
    section: "IKZE",
  },

  // OFE – Otwarte Fundusze Emerytalne
  {
    question: "Do którego filaru należy OFE?",
    answers: ["I filar", "II filar", "III filar"],
    correct: 1,
    explanation: "OFE to element II filaru systemu emerytalnego.",
    section: "OFE",
  },
  {
    question: "Czy można samodzielnie dopłacać do OFE?",
    answers: ["Tak", "Nie", "Tylko raz w roku"],
    correct: 1,
    explanation:
      "Obecnie nie można dokonywać nowych wpłat – środki pochodzą z dawnych składek.",
    section: "OFE",
  },
  {
    question:
      "Co dzieje się z pieniędzmi w OFE na 10 lat przed emeryturą?",
    answers: ["Są zamrażane", "Przechodzą stopniowo do ZUS", "Trafiają na IKE"],
    correct: 1,
    explanation:
      "Działa tzw. suwak bezpieczeństwa – środki przenoszone są do ZUS.",
    section: "OFE",
  },
  {
    question: "Jakie ryzyko ma OFE?",
    answers: ["Gwarancja zysku", "Ryzyko rynkowe inwestycji", "Brak ryzyka"],
    correct: 1,
    explanation:
      "OFE inwestuje na rynku kapitałowym, więc wartość jednostek może się wahać.",
    section: "OFE",
  },
  {
    question: "Kiedy OFE powstały w Polsce?",
    answers: ["1990", "1999", "2005"],
    correct: 1,
    explanation: "Zostały wprowadzone reformą emerytalną w 1999 r.",
    section: "OFE",
  },

  // Porównania i strategie
  {
    question: "Który instrument daje „darmowe dopłaty” od państwa i pracodawcy?",
    answers: ["IKZE", "PPK", "IKE"],
    correct: 1,
    explanation:
      "PPK łączy wpłaty własne z dopłatami pracodawcy i państwa.",
    section: "Porównania i strategie",
  },
  {
    question: "Gdzie środki są w pełni prywatne i dziedziczone?",
    answers: ["IKE", "OFE", "ZUS"],
    correct: 0,
    explanation:
      "Środki z IKE i IKZE są własnością prywatną i dziedziczone.",
    section: "Porównania i strategie",
  },
  {
    question: "Który instrument daje natychmiastową ulgę podatkową?",
    answers: ["IKZE", "IKE", "PPE"],
    correct: 0,
    explanation:
      "IKZE pozwala odliczyć wpłaty od dochodu w PIT już w roku wpłaty.",
    section: "Porównania i strategie",
  },
  {
    question: "Co warto zrobić w pierwszej kolejności przy planowaniu emerytury?",
    answers: ["Założyć IKE", "Wystąpić z PPK", "Skorzystać z PPK"],
    correct: 2,
    explanation:
      "PPK daje największy „zwrot” z dopłat na starcie.",
    section: "Porównania i strategie",
  },
  {
    question: "Jaką kolejność oszczędzania zalecają eksperci?",
    answers: ["IKZE → PPK → IKE", "PPK → IKZE → IKE", "OFE → ZUS → IKE"],
    correct: 1,
    explanation:
      "Najpierw wykorzystaj dopłaty (PPK), potem ulgę PIT (IKZE), na końcu IKE dla zysków bez Belki.",
    section: "Porównania i strategie",
  },

  // ZUS i system emerytalny
  {
    question: "ZUS należy do którego filaru systemu emerytalnego?",
    answers: ["I filar", "II filar", "III filar"],
    correct: 0,
    explanation:
      "ZUS to filar repartycyjny – bieżące składki finansują obecnych emerytów.",
    section: "ZUS i system",
  },
  {
    question: "Składka emerytalna w ZUS wynosi:",
    answers: ["9,76% wynagrodzenia", "19%", "7,5%"],
    correct: 0,
    explanation:
      "Składka dzieli się po połowie między pracodawcę i pracownika.",
    section: "ZUS i system",
  },
  {
    question: "Co oznacza „stopa zastąpienia”?",
    answers: [
      "Wysokość podatku",
      "Relacja emerytury do ostatniego wynagrodzenia",
      "Wiek przejścia na emeryturę",
    ],
    correct: 1,
    explanation:
      "Pokazuje, jaką część pensji zastąpi przyszła emerytura.",
    section: "ZUS i system",
  },
  {
    question: "Co wpływa na wysokość przyszłej emerytury z ZUS?",
    answers: [
      "Wiek, długość pracy i wysokość składek",
      "Liczba dzieci",
      "Pozycja zawodowa",
    ],
    correct: 0,
    explanation:
      "ZUS uwzględnia czas i sumę odprowadzonych składek.",
    section: "ZUS i system",
  },
  {
    question: "Co się dzieje, gdy ktoś pracuje dłużej niż wiek emerytalny?",
    answers: ["Emerytura się obniża", "Emerytura rośnie", "Nie ma zmian"],
    correct: 1,
    explanation:
      "Każdy dodatkowy rok pracy zwiększa podstawę świadczenia.",
    section: "ZUS i system",
  },

  // Ogólne i praktyczne
  {
    question: "Który z instrumentów pozwala na dziedziczenie środków przez bliskich?",
    answers: ["Wszystkie oprócz ZUS", "Tylko PPK", "Tylko IKE"],
    correct: 0,
    explanation:
      "IKE, IKZE, PPK i PPE umożliwiają wskazanie osób uposażonych.",
    section: "Ogólne i praktyczne",
  },
  {
    question: "Co to „podatek Belki”?",
    answers: ["Podatek od emerytury", "Podatek od zysków kapitałowych", "Składka zdrowotna"],
    correct: 1,
    explanation:
      "19% od zysków z inwestycji, unikniesz go m.in. w IKE.",
    section: "Ogólne i praktyczne",
  },
  {
    question: "Co oznacza skrót III filar?",
    answers: [
      "System obowiązkowy",
      "Dobrowolne formy oszczędzania na emeryturę",
      "Ubezpieczenie zdrowotne",
    ],
    correct: 1,
    explanation:
      "To prywatne formy zabezpieczenia emerytalnego (IKE, IKZE, PPK, PPE).",
    section: "Ogólne i praktyczne",
  },
  {
    question: "Jak często można zmieniać fundusz w PPK?",
    answers: ["Raz w roku", "Co miesiąc", "Nigdy"],
    correct: 0,
    explanation:
      "Zmiana funduszu inwestycyjnego PPK jest możliwa co 12 miesięcy.",
    section: "Ogólne i praktyczne",
  },
  {
    question: "Czy środki z PPK, IKE, IKZE można wypłacić wcześniej?",
    answers: ["Tak, ale z konsekwencjami podatkowymi", "Nie", "Tylko po 65 r.ż."],
    correct: 0,
    explanation:
      "Wypłata jest możliwa, ale często wiąże się z utratą ulg lub dopłat.",
    section: "Ogólne i praktyczne",
  },
];

/* --- Knowledge Quiz Tile Component --- */
export function KnowledgeQuizTile() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [shuffledQuestions, setShuffledQuestions] = React.useState<QuizQuestion[]>([]);
  const [selectedAnswers, setSelectedAnswers] = React.useState<(number | null)[]>([]);
  const [locked, setLocked] = React.useState<boolean[]>([]);
  const [quizStarted, setQuizStarted] = React.useState(false);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [points, setPoints] = React.useState(0);

  // Shuffle function to randomly select 10 questions
  const shuffleQuestions = () => {
    const shuffled = [...QUIZ_QUESTIONS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 10);
    setShuffledQuestions(selected);
    setSelectedAnswers(Array(10).fill(null));
    setLocked(Array(10).fill(false));
    setCurrentQuestion(0);
    setQuizStarted(false);
    setQuizCompleted(false);
    setPoints(0);
  };

  // Initialize with shuffled questions on component mount
  React.useEffect(() => {
    shuffleQuestions();
  }, []);

  const questions = shuffledQuestions;

  // Don't render quiz content until questions are shuffled
  if (questions.length === 0) {
    return (
      <div className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 bg-blue-50 h-full">
        <div className="relative z-10 flex items-center justify-center h-full">
          <div className="text-center">
            <div className="text-2xl mb-2">📋</div>
            <ZusText variant="body" className="text-neutral-600">
              Przygotowywanie testu wiedzy...
            </ZusText>
          </div>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    if (locked[currentQuestion]) return;
    const nextSelected = [...selectedAnswers];
    nextSelected[currentQuestion] = answerIndex;
    setSelectedAnswers(nextSelected);

    // Check if answer is correct and add points
    if (answerIndex === questions[currentQuestion].correct) {
      setPoints(prev => prev + 1);
    }

    // lock this question so user sees immediate feedback + explanation
    const nextLocked = [...locked];
    nextLocked[currentQuestion] = true;
    setLocked(nextLocked);
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((q) => q + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(Array(10).fill(null));
    setLocked(Array(10).fill(false));
    setQuizStarted(false);
    setQuizCompleted(false);
    setPoints(0);
  };

  const correctAnswersCount = selectedAnswers.reduce((acc, ans, idx) => {
    if (ans === questions[idx].correct) return (acc ?? 0) + 1;
    return acc;
  }, 0);
  const scorePercentage = Math.round(((correctAnswersCount ?? 0) / questions.length) * 100);

  const getScoreColor = () => {
    if (scorePercentage >= 75) return "text-green-700";
    if (scorePercentage >= 50) return "text-blue-700";
    return "text-orange-700";
  };

  const getScoreIcon = () => {
    if (scorePercentage >= 75) return "✓";
    if (scorePercentage >= 50) return "●";
    return "○";
  };

  const getScoreMessage = () => {
    if (scorePercentage >= 75) return "Bardzo dobry wynik";
    if (scorePercentage >= 50) return "Dobry wynik";
    return "Wynik do poprawy";
  };

  const current = questions[currentQuestion];
  const userPick = selectedAnswers[currentQuestion];

      const choiceClass = (index: number) => {
    const picked = userPick === index;
    const isCorrect = index === current.correct;

    // Before selection: hover hint
    if (!locked[currentQuestion]) {
      return `border-gray-200 hover:border-blue-300 hover:bg-blue-50`;
    }

    // After selection: color feedback
    if (picked && isCorrect) return "border-green-600 bg-green-50 text-green-900";
    if (picked && !isCorrect) return "border-red-600 bg-red-50 text-red-900";
    if (!picked && isCorrect) return "border-green-500 bg-green-50/60 text-green-800"; // reveal correct
    return "border-gray-200 bg-white text-neutral-800 opacity-75";
  };

  return (
    <div className="group relative overflow-hidden rounded-xl p-6 transition-all duration-300 bg-blue-50 h-full">
      {/* Decorative background circles */}
      <svg
        aria-hidden
        className="absolute inset-0 w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
        viewBox="0 0 200 200"
        preserveAspectRatio="none"
      >
        <circle cx="170" cy="-10" r="90" className="fill-blue-500/5" />
        <circle cx="30" cy="180" r="50" className="fill-blue-500/5" />
      </svg>

      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <span className="text-3xl">📋</span>
          <div>
            <div
              className="text-lg font-semibold text-neutral-700"
              style={{ fontSize: `calc(1rem * var(--font-scale))` }}
            >
              Test wiedzy emerytalnej
            </div>
            <ZusText variant="small" className="text-neutral-600">
              Sprawdź swoją wiedzę o polskim systemie emerytalnym
            </ZusText>
          </div>
        </div>

        {/* Start Screen */}
        {!quizStarted && !quizCompleted && (
          <div className="space-y-4">
            <div
              className="text-2xl font-bold text-blue-700"
              style={{ fontSize: `calc(1.5rem * var(--font-scale))` }}
            >
              Test wiedzy o systemie emerytalnym
            </div>
            <ZusText variant="body" className="text-neutral-600">
              Sprawdź swoją znajomość polskiego systemu emerytalnego w teście składającym się z 10 losowo wybranych pytań
            </ZusText>
            
            {/* Show question categories in current set */}
            {shuffledQuestions.length > 0 && (
              <div className="text-xs text-neutral-500">
                <span className="font-medium">Obszary tematyczne: </span>
                {Array.from(new Set(shuffledQuestions.map(q => q.section).filter(Boolean))).join(", ")}
              </div>
            )}

            <div className="flex gap-3 items-stretch">
              <button
                onClick={() => setQuizStarted(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                Rozpocznij test
              </button>
              
              <button
                onClick={shuffleQuestions}
                className="flex-shrink-0 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
              >
                📋 Nowe pytania
              </button>
            </div>
          </div>
        )}

        {/* Question Flow */}
        {quizStarted && !quizCompleted && (
          <div className="space-y-4">
            {/* Progress and Points */}
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm text-neutral-600">
                  Pytanie {currentQuestion + 1} z {questions.length}
                  {current.section ? (
                    <span className="ml-2 rounded-full bg-blue-100 text-blue-800 px-2 py-0.5 text-[11px] align-middle">
                      {current.section}
                    </span>
                  ) : null}
                </span>
                <div className="flex items-center gap-1 text-sm font-medium text-green-700">
                  <span>✓</span>
                  <span>{points} pkt</span>
                </div>
              </div>
              <div className="w-28 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestion + 1) / questions.length) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="text-lg font-semibold text-neutral-800">
              {current.question}
            </div>

            {/* Answers */}
            <div className="space-y-2">
              {current.answers.map((answer, index) => {
                const picked = userPick === index;
                const isCorrect = index === current.correct;
                return (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleAnswerSelect(index)}
                    disabled={locked[currentQuestion]}
                    className={`w-full p-3 text-left rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-300 ${choiceClass(index)}`}
                    aria-pressed={picked}
                    aria-describedby={
                      locked[currentQuestion] && picked ? `explain-${currentQuestion}` : undefined
                    }
                  >
                    <div className="flex items-center gap-2">
                      {/* Icon after lock */}
                      {locked[currentQuestion] ? (
                        <span className="text-xl" aria-hidden>
                          {isCorrect ? "✓" : picked ? "✗" : "○"}
                        </span>
                      ) : (
                        <span className="text-xl" aria-hidden>○</span>
                      )}
                      <span>{answer}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Explanation shows after selection */}
            {locked[currentQuestion] && (
              <div
                id={`explain-${currentQuestion}`}
                className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900"
              >
                <span className="font-medium">Uzasadnienie: </span>
                {current.explanation}
              </div>
            )}

            {/* Next button appears after selection */}
            {locked[currentQuestion] && (
              <button
                onClick={nextQuestion}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
              >
                {currentQuestion === questions.length - 1 ? "Zakończ test" : "Następne pytanie"}
              </button>
            )}
          </div>
        )}

        {/* Results */}
        {quizCompleted && (
          <div className="space-y-4 flex flex-col items-center gap-2">
            <div className="text-center">
              <div className="text-4xl mb-2">{getScoreIcon()}</div>
              <div
                className={`text-3xl font-bold ${getScoreColor()}`}
                style={{ fontSize: `calc(1.875rem * var(--font-scale))` }}
              >
                {scorePercentage}%
              </div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <span className="text-green-700 font-medium">✓ {points} punktów</span>
                <span className="text-neutral-400">z {questions.length}</span>
              </div>
              <ZusText variant="small" className="text-neutral-600">
                Wynik: {correctAnswersCount} z {questions.length} poprawnych odpowiedzi
              </ZusText>
              <ZusText variant="small" className={getScoreColor()}>
                {getScoreMessage()}
              </ZusText>
            </div>

            <div className="flex gap-3 w-90">
              <button
                onClick={restartQuiz}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
              >
                Powtórz test
              </button>
            </div>

            {/* Optional: quick review list (collapsed by default) could be added later */}
          </div>
        )}
      </div>
    </div>
  );
}