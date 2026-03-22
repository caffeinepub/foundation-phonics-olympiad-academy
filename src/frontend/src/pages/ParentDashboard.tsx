import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import BottomNav from "../components/BottomNav";
import {
  useGetAnnouncements,
  useGetCallerUserProfile,
  useGetStudentPhonics,
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
    body: "Classes will be suspended from Nov 1–5 for Diwali break. Regular schedule resumes Nov 6.",
    announcementType: "schedule",
  },
  {
    id: BigInt(3),
    title: "🏆 Olympiad Mock Test – This Saturday",
    body: "The monthly mock Olympiad test is scheduled for this Saturday, 10 AM–12 PM. All students of Grade 3–8 are encouraged to participate.",
    announcementType: "event",
  },
];

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  offer: { bg: "#FFF5E6", text: "#F39A3A" },
  schedule: { bg: "#E8F5F4", text: "#0A8C84" },
  event: { bg: "#F0FDF4", text: "#16A34A" },
  general: { bg: "#F5F5F5", text: "#6B7280" },
};

const STORAGE_KEY = "linkedStudentIds";

function getLinkedIds(): bigint[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as string[]).map((s) => BigInt(s));
  } catch {
    return [];
  }
}

function saveLinkedIds(ids: bigint[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(ids.map(String)));
}

function LinkedStudentCard({ studentId }: { studentId: bigint }) {
  const { data: phonics, isLoading } = useGetStudentPhonics(studentId);
  const mastered = phonics ? phonics.filter((p) => p.mastered).length : 0;
  const progress = Math.round((mastered / 26) * 100);
  const [showProgress, setShowProgress] = useState(false);

  return (
    <div className="rounded-2xl border border-gray-100 p-4 bg-white shadow-card">
      <div className="flex items-center gap-3 mb-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center font-display font-bold text-white text-base flex-shrink-0"
          style={{ background: "#0A8C84" }}
        >
          {String(studentId).slice(-2)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-app-text truncate">
            Student #{String(studentId)}
          </p>
          <p className="text-xs text-app-muted">Linked account</p>
        </div>
        <button
          type="button"
          data-ocid="parent.view_progress.button"
          onClick={() => setShowProgress((v) => !v)}
          className="text-xs font-bold px-3 py-2 rounded-xl text-white min-h-[36px]"
          style={{ background: "#F39A3A" }}
        >
          {showProgress ? "Hide" : "View Progress"}
        </button>
      </div>

      {showProgress && (
        <div className="rounded-xl p-3" style={{ background: "#E8F5F4" }}>
          {isLoading ? (
            <p className="text-xs text-app-muted">Loading progress…</p>
          ) : (
            <>
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-semibold text-teal">
                  Phonics Progress
                </p>
                <p className="text-xs text-teal font-bold">
                  {mastered}/26 letters
                </p>
              </div>
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-app-muted mt-1">
                {progress}% mastered
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function ParentDashboard() {
  const { data: profile } = useGetCallerUserProfile();
  const { data: announcements, isLoading } = useGetAnnouncements();
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [studentIdInput, setStudentIdInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [linkedIds, setLinkedIds] = useState<bigint[]>(getLinkedIds);
  const [linkError, setLinkError] = useState("");

  useEffect(() => {
    setLinkedIds(getLinkedIds());
  }, []);

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

  const handleLinkStudent = () => {
    setLinkError("");
    const idStr = studentIdInput.trim();
    if (!idStr && !nameInput.trim()) {
      setLinkError("Please enter a Student ID or name.");
      return;
    }
    if (idStr) {
      const num = Number(idStr);
      if (Number.isNaN(num) || num <= 0) {
        setLinkError("Please enter a valid numeric Student ID.");
        return;
      }
      const newId = BigInt(num);
      if (!linkedIds.some((id) => id === newId)) {
        const updated = [...linkedIds, newId];
        saveLinkedIds(updated);
        setLinkedIds(updated);
      }
    } else {
      // Link by name — generate a placeholder ID based on name hash for demo
      const hash = nameInput
        .trim()
        .split("")
        .reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const newId = BigInt(1000 + (hash % 9000));
      if (!linkedIds.some((id) => id === newId)) {
        const updated = [...linkedIds, newId];
        saveLinkedIds(updated);
        setLinkedIds(updated);
      }
    }
    setStudentIdInput("");
    setNameInput("");
    setShowLinkModal(false);
  };

  const removeLinked = (id: bigint) => {
    const updated = linkedIds.filter((i) => i !== id);
    saveLinkedIds(updated);
    setLinkedIds(updated);
  };

  return (
    <div className="min-h-screen bg-app-bg">
      {/* Header */}
      <div
        className="px-5 pt-12 pb-6"
        style={{ background: "linear-gradient(135deg, #F39A3A, #D67622)" }}
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
          <div className="flex items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">👶</span>
              <h2 className="font-display font-bold text-base text-app-text">
                Child Progress
              </h2>
            </div>
            <button
              type="button"
              data-ocid="parent.link_student.button"
              onClick={() => setShowLinkModal(true)}
              className="text-xs font-bold px-3 py-2 rounded-xl text-white min-h-[36px] flex-shrink-0"
              style={{ background: "#0A8C84" }}
            >
              + Link Student
            </button>
          </div>

          {linkedIds.length === 0 ? (
            <div
              className="rounded-2xl p-4 text-center"
              style={{ background: "#E8F5F4" }}
            >
              <p className="text-4xl mb-2">🔗</p>
              <p className="font-semibold text-teal text-sm">
                Link a student account
              </p>
              <p className="text-app-muted text-xs mt-1">
                to see their progress and achievements
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {linkedIds.map((id) => (
                <div key={String(id)} className="relative">
                  <LinkedStudentCard studentId={id} />
                  <button
                    type="button"
                    data-ocid="parent.unlink_student.button"
                    onClick={() => removeLinked(id)}
                    className="absolute top-3 right-3 text-xs text-red-400 hover:text-red-600 font-semibold"
                  >
                    ✕ Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: "📊", value: "—", label: "Avg Score" },
            { icon: "✅", value: "—", label: "Completed" },
            { icon: "🔥", value: "—", label: "Streak" },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="bg-white rounded-2xl p-3 text-center shadow-card"
            >
              <p className="text-2xl">{stat.icon}</p>
              <p className="font-display font-bold text-lg text-teal">
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
                      <p className="font-bold text-sm text-app-text flex-1 break-words">
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
                    <p className="text-sm text-app-muted leading-relaxed break-words">
                      {ann.body}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>
      </main>

      {/* Link Student Modal */}
      <Dialog open={showLinkModal} onOpenChange={setShowLinkModal}>
        <DialogContent
          className="max-w-sm mx-auto rounded-3xl"
          data-ocid="parent.link_student.dialog"
        >
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-lg text-app-text">
              🔗 Link a Student
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div>
              <Label
                htmlFor="student-id-input"
                className="text-sm font-semibold text-app-text mb-1.5 block"
              >
                Student ID
              </Label>
              <Input
                id="student-id-input"
                data-ocid="parent.student_id.input"
                type="number"
                placeholder="e.g. 12345"
                value={studentIdInput}
                onChange={(e) => setStudentIdInput(e.target.value)}
                className="rounded-xl"
              />
              <p className="text-xs text-app-muted mt-1">
                Ask your child&apos;s teacher for their Student ID.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gray-200" />
              <span className="text-xs text-app-muted font-medium">OR</span>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            <div>
              <Label
                htmlFor="student-name-input"
                className="text-sm font-semibold text-app-text mb-1.5 block"
              >
                Search by Name
              </Label>
              <Input
                id="student-name-input"
                data-ocid="parent.student_name.input"
                type="text"
                placeholder="Enter student name"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="rounded-xl"
              />
            </div>

            {linkError && (
              <p
                data-ocid="parent.link_error.error_state"
                className="text-xs text-red-500 font-medium"
              >
                {linkError}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              data-ocid="parent.link_cancel.cancel_button"
              onClick={() => {
                setShowLinkModal(false);
                setStudentIdInput("");
                setNameInput("");
                setLinkError("");
              }}
              className="rounded-xl flex-1"
            >
              Cancel
            </Button>
            <Button
              data-ocid="parent.link_confirm.confirm_button"
              onClick={handleLinkStudent}
              className="rounded-xl flex-1 font-bold text-white"
              style={{ background: "#0A8C84" }}
            >
              Link Student
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <BottomNav />
    </div>
  );
}
