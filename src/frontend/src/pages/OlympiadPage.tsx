import { Progress } from "@/components/ui/progress";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import {
  useGetCallerUserProfile,
  useGetLeaderboard,
  useSubmitTestSession,
} from "../hooks/useQueries";

type Question = { q: string; opts: string[]; ans: string; cat: string };
type Tab = "qod" | "mocktest" | "leaderboard";

const QUESTIONS: Question[] = [
  {
    q: "What is 7 × 8?",
    opts: ["54", "56", "64", "48"],
    ans: "56",
    cat: "Math",
  },
  {
    q: "Which comes next: 2, 4, 8, 16, ___?",
    opts: ["24", "28", "32", "36"],
    ans: "32",
    cat: "Logic",
  },
  {
    q: "How many planets in our solar system?",
    opts: ["7", "8", "9", "10"],
    ans: "8",
    cat: "Science",
  },
  {
    q: "What is 15% of 200?",
    opts: ["25", "30", "35", "40"],
    ans: "30",
    cat: "Math",
  },
  {
    q: "A bat+ball costs $1.10. Bat is $1 more than ball. Ball costs?",
    opts: ["$0.10", "$0.05", "$0.15", "$0.20"],
    ans: "$0.05",
    cat: "Logic",
  },
];

const SAMPLE_LEADERS = [
  { name: "Arjun Sharma", score: 98 },
  { name: "Priya Nair", score: 95 },
  { name: "Rohan Mehta", score: 91 },
  { name: "Sneha Iyer", score: 87 },
  { name: "Dev Kapoor", score: 84 },
];

const MEDALS = ["🥇", "🥈", "🥉"];
const CAT_COLORS: Record<string, string> = {
  Math: "#0A8C84",
  Logic: "#F39A3A",
  Science: "#16A34A",
};
const TAB_LABELS: Record<Tab, string> = {
  qod: "⭐ Q of Day",
  mocktest: "📝 Mock Test",
  leaderboard: "📊 Board",
};

export default function OlympiadPage() {
  const [tab, setTab] = useState<Tab>("qod");
  const [qodSelected, setQodSelected] = useState<string | null>(null);
  const [qodSubmitted, setQodSubmitted] = useState(false);
  const [testActive, setTestActive] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState<string | null>(null);
  const [answers, setAnswers] = useState<(string | null)[]>(
    Array(QUESTIONS.length).fill(null),
  );
  const [timeLeft, setTimeLeft] = useState(60);
  const [testDone, setTestDone] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { data: leaderboard, isLoading: lbLoading } = useGetLeaderboard();
  const { data: profile } = useGetCallerUserProfile();
  const submitTest = useSubmitTestSession();

  const studentId =
    profile?.role?.__kind__ === "student" ? profile.role.student : BigInt(0);

  const finishTest = useCallback(
    async (finalAnswers: (string | null)[]) => {
      if (timerRef.current) clearInterval(timerRef.current);
      setTestDone(true);
      setTestActive(false);
      const scoreVal = finalAnswers.filter(
        (a, i) => a === QUESTIONS[i].ans,
      ).length;
      try {
        await submitTest.mutateAsync({ studentId, score: BigInt(scoreVal) });
      } catch (e) {
        console.error(e);
        toast.error("Could not save score");
      }
    },
    [studentId, submitTest],
  );

  const handleNextQuestion = useCallback(
    (
      currentAnswers: (string | null)[],
      currentSelected: string | null,
      qIndex: number,
    ) => {
      const newAnswers = [...currentAnswers];
      newAnswers[qIndex] = currentSelected;
      setAnswers(newAnswers);
      setSelectedAns(null);
      setTimeLeft(60);
      if (qIndex + 1 >= QUESTIONS.length) {
        finishTest(newAnswers);
      } else {
        setCurrentQ((q) => q + 1);
      }
    },
    [finishTest],
  );

  useEffect(() => {
    if (!testActive || testDone) return;
    const capturedQ = currentQ;
    const capturedAnswers = answers;
    const capturedSelected = selectedAns;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          handleNextQuestion(capturedAnswers, capturedSelected, capturedQ);
          return 60;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [
    testActive,
    testDone,
    currentQ,
    answers,
    selectedAns,
    handleNextQuestion,
  ]);

  const startTest = () => {
    setTestActive(true);
    setTestDone(false);
    setCurrentQ(0);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setSelectedAns(null);
    setTimeLeft(60);
  };

  const score = answers.filter((a, i) => a === QUESTIONS[i].ans).length;

  const leaders =
    !lbLoading && leaderboard && leaderboard.length > 0
      ? leaderboard.map(([, sc], i) => ({
          name: `Student #${i + 1}`,
          score: Number(sc),
        }))
      : SAMPLE_LEADERS;

  return (
    <div className="min-h-screen bg-app-bg">
      <TopBar title="Olympiad" />

      <div className="px-4 py-3">
        <div className="flex bg-white rounded-2xl p-1 shadow-xs gap-1">
          {(["qod", "mocktest", "leaderboard"] as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              data-ocid={`olympiad.${t}.tab`}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-xl text-xs font-bold transition-all"
              style={{
                background: tab === t ? "#F39A3A" : "transparent",
                color: tab === t ? "#fff" : "#6B7280",
              }}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </div>
      </div>

      <main className="px-4 pb-24">
        <AnimatePresence mode="wait">
          {tab === "qod" && (
            <motion.div
              key="qod"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <div
                className="rounded-3xl p-5 text-white"
                style={{
                  background: "linear-gradient(135deg, #F39A3A, #D67622)",
                }}
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl">⭐</span>
                  <span className="font-bold text-sm text-white/80">
                    Question of the Day
                  </span>
                  <span
                    className="ml-auto text-xs font-bold px-2 py-1 rounded-lg"
                    style={{ background: "rgba(255,255,255,0.2)" }}
                  >
                    {QUESTIONS[0].cat}
                  </span>
                </div>
                <p className="font-display font-bold text-lg leading-snug">
                  {QUESTIONS[0].q}
                </p>
              </div>

              <div className="space-y-2">
                {QUESTIONS[0].opts.map((opt) => {
                  let bg = "#fff";
                  let textColor = "#111111";
                  let borderColor = "#e5e7eb";
                  if (qodSubmitted) {
                    if (opt === QUESTIONS[0].ans) {
                      bg = "#F0FDF4";
                      borderColor = "#16A34A";
                      textColor = "#16A34A";
                    } else if (opt === qodSelected) {
                      bg = "#FEF2F2";
                      borderColor = "#DC2626";
                      textColor = "#DC2626";
                    }
                  } else if (opt === qodSelected) {
                    bg = "#E8F5F4";
                    borderColor = "#0A8C84";
                    textColor = "#0A8C84";
                  }
                  return (
                    <button
                      key={opt}
                      type="button"
                      data-ocid="olympiad.qod.option.button"
                      disabled={qodSubmitted}
                      onClick={() => setQodSelected(opt)}
                      className="w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all border-2 shadow-xs"
                      style={{ background: bg, color: textColor, borderColor }}
                    >
                      <span
                        className="inline-block w-7 h-7 rounded-lg text-center text-xs font-bold mr-3 leading-7"
                        style={{ background: "#E8F5F4", color: "#0A8C84" }}
                      >
                        {["A", "B", "C", "D"][QUESTIONS[0].opts.indexOf(opt)]}
                      </span>
                      {opt}
                    </button>
                  );
                })}
              </div>

              {!qodSubmitted ? (
                <button
                  type="button"
                  data-ocid="olympiad.qod.submit.button"
                  disabled={!qodSelected}
                  onClick={() => setQodSubmitted(true)}
                  className="w-full py-4 rounded-2xl font-bold text-white transition-all disabled:opacity-40"
                  style={{ background: "#F39A3A" }}
                >
                  Submit Answer
                </button>
              ) : (
                <div
                  className="rounded-2xl p-4 text-center"
                  style={{
                    background:
                      qodSelected === QUESTIONS[0].ans ? "#F0FDF4" : "#FEF2F2",
                  }}
                >
                  <p className="text-2xl mb-1">
                    {qodSelected === QUESTIONS[0].ans ? "🎉" : "💡"}
                  </p>
                  <p
                    className="font-bold text-base"
                    style={{
                      color:
                        qodSelected === QUESTIONS[0].ans
                          ? "#16A34A"
                          : "#DC2626",
                    }}
                  >
                    {qodSelected === QUESTIONS[0].ans
                      ? "Correct!"
                      : "Not quite!"}
                  </p>
                  <p className="text-sm text-app-muted mt-1">
                    The correct answer is <strong>{QUESTIONS[0].ans}</strong>.
                  </p>
                  <button
                    type="button"
                    data-ocid="olympiad.qod.retry.button"
                    onClick={() => {
                      setQodSubmitted(false);
                      setQodSelected(null);
                    }}
                    className="mt-3 px-5 py-2 rounded-xl text-sm font-bold text-white"
                    style={{ background: "#0A8C84" }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {tab === "mocktest" && (
            <motion.div
              key="mocktest"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
            >
              {!testActive && !testDone && (
                <div className="text-center py-6">
                  <div
                    className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl mx-auto mb-4"
                    style={{ background: "#E8F5F4" }}
                  >
                    📝
                  </div>
                  <h2 className="font-display font-extrabold text-xl text-teal mb-2">
                    Timed Mock Test
                  </h2>
                  <p className="text-app-muted text-sm mb-6">
                    5 questions · 60 seconds each · Mixed topics
                  </p>
                  <button
                    type="button"
                    data-ocid="olympiad.test.start.button"
                    onClick={startTest}
                    className="px-10 py-4 rounded-2xl font-display font-bold text-white text-lg shadow-card"
                    style={{
                      background: "linear-gradient(135deg, #F39A3A, #D67622)",
                    }}
                  >
                    🚀 Start Timed Test
                  </button>
                </div>
              )}

              {testActive && !testDone && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-teal">
                      Question {currentQ + 1} of {QUESTIONS.length}
                    </span>
                    <span
                      className="text-sm font-bold px-3 py-1 rounded-lg text-white"
                      style={{
                        background: timeLeft <= 10 ? "#DC2626" : "#0A8C84",
                      }}
                    >
                      ⏱ {timeLeft}s
                    </span>
                  </div>
                  <Progress value={(timeLeft / 60) * 100} className="h-2" />

                  <div
                    className="rounded-3xl p-5 text-white"
                    style={{
                      background: `linear-gradient(135deg, ${
                        CAT_COLORS[QUESTIONS[currentQ].cat] ?? "#0A8C84"
                      }, #19A79C)`,
                    }}
                  >
                    <span
                      className="text-xs font-bold px-2 py-1 rounded-lg mb-3 inline-block"
                      style={{ background: "rgba(255,255,255,0.2)" }}
                    >
                      {QUESTIONS[currentQ].cat}
                    </span>
                    <p className="font-display font-bold text-lg leading-snug">
                      {QUESTIONS[currentQ].q}
                    </p>
                  </div>

                  <div className="space-y-2">
                    {QUESTIONS[currentQ].opts.map((opt) => (
                      <button
                        key={opt}
                        type="button"
                        data-ocid="olympiad.test.option.button"
                        onClick={() => setSelectedAns(opt)}
                        className="w-full p-4 rounded-2xl text-left font-semibold text-sm transition-all border-2"
                        style={{
                          background: selectedAns === opt ? "#E8F5F4" : "#fff",
                          borderColor:
                            selectedAns === opt ? "#0A8C84" : "#e5e7eb",
                          color: selectedAns === opt ? "#0A8C84" : "#111111",
                        }}
                      >
                        <span
                          className="inline-block w-7 h-7 rounded-lg text-center text-xs font-bold mr-3 leading-7"
                          style={{ background: "#E8F5F4", color: "#0A8C84" }}
                        >
                          {
                            ["A", "B", "C", "D"][
                              QUESTIONS[currentQ].opts.indexOf(opt)
                            ]
                          }
                        </span>
                        {opt}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    data-ocid="olympiad.test.next.button"
                    onClick={() =>
                      handleNextQuestion(answers, selectedAns, currentQ)
                    }
                    className="w-full py-4 rounded-2xl font-bold text-white"
                    style={{ background: "#F39A3A" }}
                  >
                    {currentQ + 1 === QUESTIONS.length
                      ? "Finish Test"
                      : "Next Question →"}
                  </button>
                </div>
              )}

              {testDone && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6"
                  data-ocid="olympiad.test.result.card"
                >
                  <div className="text-6xl mb-4">🎉</div>
                  <h2 className="font-display font-extrabold text-2xl text-teal">
                    Test Complete!
                  </h2>
                  <div
                    className="my-5 py-6 px-8 rounded-3xl"
                    style={{
                      background: "linear-gradient(135deg, #0A8C84, #19A79C)",
                    }}
                  >
                    <p className="text-white/80 text-sm">Your Score</p>
                    <p className="font-display font-black text-5xl text-white mt-1">
                      {score}/{QUESTIONS.length}
                    </p>
                    <p className="text-sm mt-1" style={{ color: "#FFBB63" }}>
                      {score === QUESTIONS.length
                        ? "Perfect! 🌟"
                        : score >= 3
                          ? "Great job! 👏"
                          : "Keep practicing! 💪"}
                    </p>
                  </div>
                  <button
                    type="button"
                    data-ocid="olympiad.test.retry.button"
                    onClick={startTest}
                    className="w-full py-4 rounded-2xl font-bold text-white"
                    style={{ background: "#F39A3A" }}
                  >
                    Try Again 🔁
                  </button>
                </motion.div>
              )}
            </motion.div>
          )}

          {tab === "leaderboard" && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="space-y-3"
            >
              <div
                className="rounded-3xl p-4 text-center"
                style={{
                  background: "linear-gradient(135deg, #F39A3A, #D67622)",
                }}
              >
                <p className="text-3xl mb-1">🏆</p>
                <p className="font-display font-extrabold text-lg text-white">
                  Leaderboard
                </p>
                <p className="text-white/70 text-xs">
                  Top performers this month
                </p>
              </div>

              {lbLoading ? (
                <div
                  data-ocid="olympiad.leaderboard.loading_state"
                  className="space-y-2"
                >
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="bg-white rounded-2xl p-4 animate-pulse shadow-card"
                    >
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : leaders.length === 0 ? (
                <div
                  data-ocid="olympiad.leaderboard.empty_state"
                  className="text-center py-8"
                >
                  <p className="text-4xl mb-2">📊</p>
                  <p className="text-app-muted">
                    No results yet. Take a test to join!
                  </p>
                </div>
              ) : (
                leaders.map((entry, i) => (
                  <div
                    key={entry.name}
                    data-ocid={`olympiad.leaderboard.item.${i + 1}`}
                    className="flex items-center gap-3 rounded-2xl p-4 shadow-card"
                    style={{
                      background:
                        i === 0
                          ? "linear-gradient(135deg, #FFF5E6, #FFF)"
                          : "#fff",
                      border: i === 0 ? "2px solid #F39A3A" : "none",
                    }}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{
                        background: i < 3 ? "#E8F5F4" : "#F5F5F5",
                        color: "#0A8C84",
                      }}
                    >
                      {i < 3 ? (
                        MEDALS[i]
                      ) : (
                        <span className="text-app-muted">#{i + 1}</span>
                      )}
                    </div>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-display font-bold text-sm text-white flex-shrink-0"
                      style={{ background: "#0A8C84" }}
                    >
                      {entry.name
                        .split(" ")
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join("")}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-app-text">
                        {entry.name}
                      </p>
                      <p className="text-xs text-app-muted">
                        Score: {entry.score}
                      </p>
                    </div>
                    {i === 0 && (
                      <span
                        className="text-xs font-bold px-2 py-1 rounded-lg"
                        style={{ background: "#FFF5E6", color: "#F39A3A" }}
                      >
                        Top!
                      </span>
                    )}
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
}
