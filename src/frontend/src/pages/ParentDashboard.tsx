import { Badge } from "@/components/ui/badge";
import { motion } from "motion/react";
import BottomNav from "../components/BottomNav";
import {
  useGetAnnouncements,
  useGetCallerUserProfile,
} from "../hooks/useQueries";

const SAMPLE_ANNOUNCEMENTS = [
  {
    id: BigInt(1),
    title: "🎉 Diwali Special Offer!",
    body: "Enroll before Oct 31st and get 20% off on annual membership. Limited seats available!",
    announcementType: "offer",
  },
  {
    id: BigInt(2),
    title: "📅 Holiday Schedule Update",
    body: "Classes will be suspended from Nov 1\u20135 for Diwali break. Regular schedule resumes Nov 6.",
    announcementType: "schedule",
  },
  {
    id: BigInt(3),
    title: "🏆 Olympiad Mock Test \u2013 This Saturday",
    body: "The monthly mock Olympiad test is scheduled for this Saturday, 10 AM\u201312 PM. All students of Grade 3\u20138 are encouraged to participate.",
    announcementType: "event",
  },
];

const STATS = [
  { icon: "📊", value: "—", label: "Avg Score" },
  { icon: "✅", value: "—", label: "Completed" },
  { icon: "🔥", value: "—", label: "Streak" },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  offer: { bg: "#FFF8E6", text: "#C9A23A" },
  schedule: { bg: "#EAF4FF", text: "#1F4B9A" },
  event: { bg: "#F0FDF4", text: "#16A34A" },
  general: { bg: "#F5F5F5", text: "#6B7280" },
};

export default function ParentDashboard() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: announcements, isLoading } = useGetAnnouncements();
  const displayName = profile?.fullName ?? "Parent";
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const announcementList =
    !isLoading && announcements && announcements.length > 0
      ? announcements
      : SAMPLE_ANNOUNCEMENTS;

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: "linear-gradient(135deg, #C9A23A, #A8832A)" }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-white/80 text-sm font-medium">Parent Portal</p>
            <h1 className="font-display font-extrabold text-2xl text-white mt-0.5">
              Hello, {displayName.split(" ")[0]}! 👋
            </h1>
          </div>
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-lg"
            style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}
          >
            {initials}
          </div>
        </div>
      </div>

      <main className="px-4 pb-24 pt-5 space-y-5">
        {/* Child Progress Card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-5 shadow-card"
          data-ocid="parent.progress.card"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">👶</span>
            <h2 className="font-display font-bold text-base text-app-text">
              Child Progress
            </h2>
          </div>
          <div
            className="rounded-2xl p-4 text-center"
            style={{ background: "#EAF4FF" }}
          >
            <p className="text-4xl mb-2">🔗</p>
            <p className="font-semibold text-royal-blue text-sm">
              Link a student account
            </p>
            <p className="text-app-muted text-xs mt-1">
              to see their progress and achievements
            </p>
            <button
              type="button"
              data-ocid="parent.link_student.button"
              className="mt-3 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
              style={{ background: "#1F4B9A" }}
            >
              Link Student
            </button>
          </div>
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-3 text-center shadow-card"
            >
              <p className="text-2xl">{stat.icon}</p>
              <p className="font-display font-bold text-lg text-royal-blue">
                {stat.value}
              </p>
              <p className="text-xs text-app-muted">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Announcements */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <h3 className="font-display font-bold text-base text-app-text mb-3">
            📢 Announcements
          </h3>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-4 shadow-card animate-pulse"
                >
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-3/4 mt-1" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {announcementList.map((ann, i) => {
                const typeColors =
                  TYPE_COLORS[ann.announcementType] ?? TYPE_COLORS.general;
                return (
                  <div
                    key={String(ann.id)}
                    data-ocid={`parent.announcement.item.${i + 1}`}
                    className="bg-white rounded-2xl p-4 shadow-card"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <p className="font-bold text-sm text-app-text flex-1">
                        {ann.title}
                      </p>
                      <Badge
                        className="capitalize text-xs flex-shrink-0 border-0"
                        style={{
                          background: typeColors.bg,
                          color: typeColors.text,
                        }}
                      >
                        {ann.announcementType}
                      </Badge>
                    </div>
                    <p className="text-sm text-app-muted leading-relaxed">
                      {ann.body}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
