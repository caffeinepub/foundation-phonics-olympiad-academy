import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import {
  useGetCallerUserProfile,
  useGetLeaderboard,
  useGetStudentPhonics,
} from "../hooks/useQueries";

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const [lastTestScore, setLastTestScore] = useState<number | null>(null);

  const firstName = profile?.fullName?.split(" ")[0] ?? "Learner";
  const studentId =
    profile?.role?.__kind__ === "student" ? profile.role.student : null;

  const { data: phonicsData, isLoading: phonicsLoading } =
    useGetStudentPhonics(studentId);
  const { data: leaderboard } = useGetLeaderboard();

  // Compute phonics progress
  const masteredCount = phonicsData
    ? phonicsData.filter((p) => p.mastered).length
    : 0;
  const phonicsProgress =
    phonicsData && phonicsData.length > 0
      ? Math.round((masteredCount / 26) * 100)
      : 0;

  // Compute olympiad progress from leaderboard
  const olympiadScore =
    leaderboard && studentId !== null
      ? (leaderboard.find(([id]) => id === studentId)?.[1] ?? BigInt(0))
      : BigInt(0);
  const olympiadProgress = Math.min(
    100,
    Math.round((Number(olympiadScore) / 5) * 100),
  );

  // Build activity list from phonics data
  const activities: {
    icon: string;
    label: string;
    time: string;
    score: string;
  }[] = [];

  if (lastTestScore !== null) {
    activities.push({
      icon: "🏆",
      label: "Olympiad Mock Test",
      time: "Just now",
      score: `${lastTestScore}/5`,
    });
  }

  if (phonicsData) {
    const activePhonics = phonicsData
      .filter((p) => Number(p.attempts) > 0)
      .slice(0, 5 - activities.length);
    for (const entry of activePhonics) {
      activities.push({
        icon: "📚",
        label: `Phonics: Letter ${entry.letter}`,
        time: "Phonics practice",
        score: entry.mastered
          ? "✓ Mastered"
          : `${Number(entry.attempts)} attempts`,
      });
    }
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  // Expose setter so OlympiadPage can update — stored in sessionStorage as workaround
  // (OlympiadPage is a sibling route; we use storage event to communicate)
  // Simpler: poll localStorage for last test score
  const storedScore =
    typeof window !== "undefined"
      ? localStorage.getItem("lastTestScore")
      : null;
  const displayTestScore =
    lastTestScore !== null
      ? lastTestScore
      : storedScore !== null
        ? Number(storedScore)
        : null;

  const allActivities: typeof activities = [];
  if (displayTestScore !== null) {
    allActivities.push({
      icon: "🏆",
      label: "Olympiad Mock Test",
      time: "Recent session",
      score: `${displayTestScore}/5`,
    });
  }
  if (phonicsData) {
    const activePhonics = phonicsData
      .filter((p) => Number(p.attempts) > 0)
      .slice(0, 5 - allActivities.length);
    for (const entry of activePhonics) {
      allActivities.push({
        icon: "📚",
        label: `Phonics: Letter ${entry.letter}`,
        time: "Phonics practice",
        score: entry.mastered
          ? "✓ Mastered"
          : `${Number(entry.attempts)} attempts`,
      });
    }
  }

  void setLastTestScore; // suppress unused warning — used indirectly via localStorage

  return (
    <div className="min-h-screen bg-app-bg">
      <TopBar />

      <main className="px-4 pb-24 pt-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-display font-extrabold text-2xl text-teal">
            Welcome back, {firstName}! 👋
          </h2>
          <p className="text-app-muted text-sm mt-0.5">{today}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="rounded-3xl p-5 relative overflow-hidden shadow-card"
          style={{
            background:
              "linear-gradient(135deg, #0A8C84 0%, #19A79C 60%, #1DBDB1 100%)",
          }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">Daily Goal</p>
            <p className="text-white font-display font-extrabold text-xl mt-1">
              Ready to learn today? ⭐
            </p>
            <p className="text-white/70 text-sm mt-1">
              Complete 2 activities to earn your star!
            </p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-8xl">
            🌟
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            Quick Start
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              data-ocid="dashboard.phonics.button"
              onClick={() => navigate({ to: "/phonics" })}
              className="rounded-3xl p-5 text-left min-h-[120px] touch-target shadow-card transition-transform active:scale-95"
              style={{ background: "#0A8C84" }}
            >
              <span className="text-4xl block mb-2">📚</span>
              <p className="text-white font-display font-extrabold text-base leading-tight">
                PHONICS
              </p>
              <p className="text-white font-display font-extrabold text-base leading-tight">
                MODULE
              </p>
              <p className="text-white/70 text-xs mt-2">Tap to Start</p>
            </button>

            <button
              type="button"
              data-ocid="dashboard.olympiad.button"
              onClick={() => navigate({ to: "/olympiad" })}
              className="rounded-3xl p-5 text-left min-h-[120px] touch-target shadow-card transition-transform active:scale-95"
              style={{ background: "#F39A3A" }}
            >
              <span className="text-4xl block mb-2">🏆</span>
              <p className="text-white font-display font-extrabold text-base leading-tight">
                OLYMPIAD
              </p>
              <p className="text-white font-display font-extrabold text-base leading-tight">
                MODULE
              </p>
              <p className="text-white/70 text-xs mt-2">Take a Quiz</p>
            </button>
          </div>
        </motion.div>

        {/* Learning Path */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            Learning Path
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            {phonicsLoading && studentId !== null ? (
              <>
                <Skeleton className="flex-shrink-0 w-44 h-32 rounded-2xl" />
                <Skeleton className="flex-shrink-0 w-44 h-32 rounded-2xl" />
              </>
            ) : (
              <>
                <div
                  className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4"
                  style={{ borderLeftColor: "#0A8C84" }}
                >
                  <p className="text-2xl mb-2">📚</p>
                  <p className="font-bold text-sm text-teal">Phonics</p>
                  <p className="text-xs text-app-muted mb-2">
                    {masteredCount}/26 Letters
                  </p>
                  <Progress value={phonicsProgress} className="h-2" />
                  <p className="text-xs text-teal font-semibold mt-1">
                    {phonicsProgress}%
                  </p>
                </div>

                <div
                  className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4"
                  style={{ borderLeftColor: "#F39A3A" }}
                >
                  <p className="text-2xl mb-2">🏆</p>
                  <p className="font-bold text-sm text-amber">Olympiad</p>
                  <p className="text-xs text-app-muted mb-2">
                    Score: {Number(olympiadScore)}/5
                  </p>
                  <Progress value={olympiadProgress} className="h-2" />
                  <p className="text-xs text-amber font-semibold mt-1">
                    {olympiadProgress}%
                  </p>
                </div>

                <div className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4 border-l-emerald-500">
                  <p className="text-2xl mb-2">🧠</p>
                  <p className="font-bold text-sm text-emerald-600">Logic</p>
                  <p className="text-xs text-app-muted mb-2">Coming soon</p>
                  <Progress value={0} className="h-2" />
                  <p className="text-xs text-emerald-600 font-semibold mt-1">
                    0%
                  </p>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            Recent Activity
          </h3>

          {phonicsLoading && studentId !== null ? (
            <div className="space-y-2">
              {[1, 2].map((i) => (
                <Skeleton key={i} className="h-16 rounded-2xl" />
              ))}
            </div>
          ) : allActivities.length === 0 ? (
            <div
              data-ocid="dashboard.activity.empty_state"
              className="bg-white rounded-2xl p-6 text-center shadow-card"
            >
              <p className="text-4xl mb-2">🌱</p>
              <p className="font-semibold text-sm text-app-text">
                No activity yet — start learning!
              </p>
              <p className="text-xs text-app-muted mt-1">
                Tap Phonics or Olympiad above to begin.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {allActivities.slice(0, 5).map((a, i) => (
                <div
                  key={`${a.label}-${i}`}
                  data-ocid={`dashboard.activity.item.${i + 1}`}
                  className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card"
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: "#E8F5F4" }}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-app-text truncate">
                      {a.label}
                    </p>
                    <p className="text-xs text-app-muted">{a.time}</p>
                  </div>
                  <div
                    className="text-xs font-bold px-2 py-1 rounded-lg text-white flex-shrink-0 whitespace-nowrap"
                    style={{
                      background: a.icon === "🏆" ? "#F39A3A" : "#0A8C84",
                    }}
                  >
                    {a.score}
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
