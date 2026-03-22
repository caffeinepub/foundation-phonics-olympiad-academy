import { useQueryClient } from "@tanstack/react-query";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Role } from "../backend";
import BottomNav from "../components/BottomNav";
import TopBar from "../components/TopBar";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";

const STATS = [
  { icon: "🏆", val: "0", label: "Quizzes" },
  { icon: "📚", val: "0", label: "Phonics" },
  { icon: "⭐", val: "0", label: "Stars" },
];

export default function ProfilePage() {
  const { clear } = useInternetIdentity();
  const queryClient = useQueryClient();
  const { data: profile } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();

  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");

  const fullName = profile?.fullName ?? "";
  const isStudent = profile?.role?.__kind__ === "student";
  const initials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";

  const handleEdit = () => {
    setEditName(fullName);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    const role: Role = profile?.role ?? {
      __kind__: "student",
      student: BigInt(0),
    };
    try {
      await saveProfile.mutateAsync({ fullName: editName.trim(), role });
      setEditing(false);
      toast.success("Profile updated!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to update. Please try again.");
    }
  };

  const handleSignOut = async () => {
    await clear();
    queryClient.clear();
  };

  return (
    <div className="min-h-screen bg-app-bg">
      <TopBar title="My Profile" />

      <main className="px-4 pb-24 pt-6">
        {/* Avatar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center mb-6"
        >
          <div
            className="w-24 h-24 rounded-full flex items-center justify-center font-display font-black text-3xl text-white shadow-card mb-3"
            style={{ background: "linear-gradient(135deg, #0A8C84, #19A79C)" }}
          >
            {initials}
          </div>

          {editing ? (
            <div className="w-full max-w-xs space-y-3">
              <input
                data-ocid="profile.name.input"
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-app-text text-base text-center focus:outline-none focus:ring-2 focus:ring-teal"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  data-ocid="profile.save.button"
                  onClick={handleSave}
                  disabled={saveProfile.isPending}
                  className="flex-1 py-3 rounded-xl font-bold text-white text-sm"
                  style={{ background: "#0A8C84" }}
                >
                  {saveProfile.isPending ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  data-ocid="profile.cancel.button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-3 rounded-xl font-bold text-sm border border-border bg-white text-app-muted"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="font-display font-extrabold text-xl text-app-text">
                {fullName}
              </h2>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className="px-3 py-1 rounded-full text-xs font-bold text-white"
                  style={{ background: isStudent ? "#0A8C84" : "#F39A3A" }}
                >
                  {isStudent ? "📚 Student" : "👨‍👩‍👦 Parent"}
                </span>
              </div>
            </>
          )}
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-3 mb-6"
        >
          <div className="bg-white rounded-2xl p-4 shadow-card">
            <h3 className="font-display font-bold text-sm text-teal mb-3">
              Account Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-app-muted">Full Name</span>
                <span className="text-sm font-semibold text-app-text">
                  {fullName || "—"}
                </span>
              </div>
              <div className="h-px bg-border" />
              <div className="flex justify-between items-center">
                <span className="text-sm text-app-muted">Role</span>
                <span className="text-sm font-semibold text-app-text capitalize">
                  {profile?.role?.__kind__ ?? "—"}
                </span>
              </div>
            </div>
          </div>

          {isStudent && (
            <div className="bg-white rounded-2xl p-4 shadow-card">
              <h3 className="font-display font-bold text-sm text-teal mb-3">
                My Stats
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <p className="text-2xl">{stat.icon}</p>
                    <p className="font-display font-bold text-lg text-teal">
                      {stat.val}
                    </p>
                    <p className="text-xs text-app-muted">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          {!editing && (
            <button
              type="button"
              data-ocid="profile.edit.button"
              onClick={handleEdit}
              className="w-full py-4 rounded-2xl font-bold text-sm border-2 bg-white transition-all"
              style={{ borderColor: "#0A8C84", color: "#0A8C84" }}
            >
              ✏️ Edit Name
            </button>
          )}

          <button
            type="button"
            data-ocid="profile.signout.button"
            onClick={handleSignOut}
            className="w-full py-4 rounded-2xl font-bold text-sm text-white transition-all"
            style={{ background: "#DC2626" }}
          >
            🚪 Sign Out
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
