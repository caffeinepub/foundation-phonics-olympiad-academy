import { Progress } from "@/components/ui/progress";
import { useNavigate } from "@tanstack/react-router";
import { motion } from "motion/react";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import { useGetCallerUserProfile } from "../hooks/useQueries";

const ACTIVITIES = [
  {
    icon: "📚",
    label: "Phonics: Letter A-E",
    time: "Today, 10:30 AM",
    score: "5/5",
  },
  {
    icon: "🏆",
    label: "Math Quiz \u2013 Olympiad Prep",
    time: "Yesterday, 3:15 PM",
    score: "4/5",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { data: profile } = useGetCallerUserProfile();
  const firstName = profile?.fullName?.split(" ")[0] ?? "Learner";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-app-bg">
      <TopBar />

      <main className="px-4 pb-24 pt-4 space-y-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="font-display font-extrabold text-2xl text-royal-blue">
            Welcome back, {firstName}! \ud83d\udc4b
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
              "linear-gradient(135deg, #1F4B9A 0%, #2D5EC7 60%, #3B6FD4 100%)",
          }}
        >
          <div className="relative z-10">
            <p className="text-white/80 text-sm font-medium">Daily Goal</p>
            <p className="text-white font-display font-extrabold text-xl mt-1">
              Ready to learn today? \u2b50
            </p>
            <p className="text-white/70 text-sm mt-1">
              Complete 2 activities to earn your star!
            </p>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 text-8xl">
            \ud83c\udf1f
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
              className="rounded-3xl p-5 text-left touch-target shadow-card transition-transform active:scale-95"
              style={{ background: "#1F4B9A" }}
            >
              <span className="text-4xl block mb-2">\ud83d\udcda</span>
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
              className="rounded-3xl p-5 text-left touch-target shadow-card transition-transform active:scale-95"
              style={{ background: "#C9A23A" }}
            >
              <span className="text-4xl block mb-2">\ud83c\udfc6</span>
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

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            Learning Path
          </h3>
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
            <div
              className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4"
              style={{ borderLeftColor: "#1F4B9A" }}
            >
              <p className="text-2xl mb-2">\ud83d\udcda</p>
              <p className="font-bold text-sm text-royal-blue">Phonics</p>
              <p className="text-xs text-app-muted mb-2">Level 3 of 5</p>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-royal-blue font-semibold mt-1">60%</p>
            </div>
            <div
              className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4"
              style={{ borderLeftColor: "#C9A23A" }}
            >
              <p className="text-2xl mb-2">\ud83c\udfc6</p>
              <p className="font-bold text-sm text-gold">Olympiad</p>
              <p className="text-xs text-app-muted mb-2">Level 1 of 5</p>
              <Progress value={30} className="h-2" />
              <p className="text-xs text-gold font-semibold mt-1">30%</p>
            </div>
            <div className="flex-shrink-0 w-44 rounded-2xl p-4 shadow-card bg-white border-l-4 border-l-emerald-500">
              <p className="text-2xl mb-2">\ud83e\udde0</p>
              <p className="font-bold text-sm text-emerald-600">Logic</p>
              <p className="text-xs text-app-muted mb-2">Level 2 of 5</p>
              <Progress value={45} className="h-2" />
              <p className="text-xs text-emerald-600 font-semibold mt-1">45%</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            Recent Activity
          </h3>
          <div className="space-y-2">
            {ACTIVITIES.map((a, i) => (
              <div
                key={a.label}
                data-ocid={`dashboard.activity.item.${i + 1}`}
                className="bg-white rounded-2xl p-4 flex items-center gap-3 shadow-card"
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: "#EAF4FF" }}
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
                  className="text-xs font-bold px-2 py-1 rounded-lg text-white flex-shrink-0"
                  style={{ background: "#1F4B9A" }}
                >
                  {a.score}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
