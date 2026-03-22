import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import type { Role } from "../backend";
import { useSaveProfile } from "../hooks/useQueries";

export default function SetupProfile() {
  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"student" | "parent">("student");
  const [grade, setGrade] = useState("1");
  const saveProfile = useSaveProfile();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }
    const roleObj: Role =
      role === "student"
        ? { __kind__: "student", student: BigInt(0) }
        : { __kind__: "parent", parent: null };
    try {
      await saveProfile.mutateAsync({
        fullName: fullName.trim(),
        role: roleObj,
      });
      toast.success("Profile created!");
    } catch (e) {
      console.error(e);
      toast.error("Failed to create profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-app-bg">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <div
            className="w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg, #1F4B9A, #2D5EC7)" }}
          >
            <span className="text-4xl">👋</span>
          </div>
          <h1 className="font-display font-extrabold text-2xl text-royal-blue">
            Welcome!
          </h1>
          <p className="text-app-muted text-sm mt-1">
            Let&apos;s set up your profile
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="setup-fullname"
              className="block text-sm font-semibold text-app-text mb-1.5"
            >
              Full Name
            </label>
            <input
              id="setup-fullname"
              data-ocid="setup.name.input"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-app-text text-base focus:outline-none focus:ring-2 focus:ring-royal-blue"
              autoComplete="name"
            />
          </div>

          <div>
            <p className="block text-sm font-semibold text-app-text mb-1.5">
              I am a
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                data-ocid="setup.student.toggle"
                onClick={() => setRole("student")}
                className="py-3 rounded-xl font-bold text-sm transition-all border-2"
                style={{
                  background: role === "student" ? "#1F4B9A" : "#fff",
                  color: role === "student" ? "#fff" : "#1F4B9A",
                  borderColor: role === "student" ? "#C9A23A" : "#e5e7eb",
                }}
              >
                📚 Student
              </button>
              <button
                type="button"
                data-ocid="setup.parent.toggle"
                onClick={() => setRole("parent")}
                className="py-3 rounded-xl font-bold text-sm transition-all border-2"
                style={{
                  background: role === "parent" ? "#C9A23A" : "#fff",
                  color: role === "parent" ? "#fff" : "#C9A23A",
                  borderColor: role === "parent" ? "#1F4B9A" : "#e5e7eb",
                }}
              >
                👨‍👩‍👦 Parent
              </button>
            </div>
          </div>

          {role === "student" && (
            <div>
              <label
                htmlFor="setup-grade"
                className="block text-sm font-semibold text-app-text mb-1.5"
              >
                Grade Level
              </label>
              <select
                id="setup-grade"
                data-ocid="setup.grade.select"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl border border-border bg-white text-app-text text-base focus:outline-none focus:ring-2 focus:ring-royal-blue"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map((g) => (
                  <option key={g} value={String(g)}>
                    Grade {g}
                  </option>
                ))}
              </select>
            </div>
          )}

          <button
            type="submit"
            data-ocid="setup.submit.button"
            disabled={saveProfile.isPending}
            className="w-full py-4 rounded-2xl font-display font-bold text-white text-lg mt-2 transition-all disabled:opacity-60"
            style={{ background: "linear-gradient(135deg, #1F4B9A, #2D5EC7)" }}
          >
            {saveProfile.isPending ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Setting up...
              </span>
            ) : (
              "Get Started 🚀"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
