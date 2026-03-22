import { motion } from "motion/react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function AuthPage() {
  const { login, loginStatus } = useInternetIdentity();
  const [selectedRole, setSelectedRole] = useState<"student" | "parent" | null>(
    null,
  );
  const isLoggingIn = loginStatus === "logging-in";

  const handleLogin = async () => {
    try {
      await login();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-5 bg-app-bg">
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-8"
      >
        <img
          src="/assets/uploads/foundation-logo-1.png"
          alt="Foundation Phonics &amp; Olympiad Academy"
          className="w-48 h-auto mx-auto mb-4"
        />
        <p className="text-app-muted text-sm mt-1">Learn · Compete · Excel</p>
      </motion.div>

      {/* Role Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full max-w-sm space-y-3 mb-6"
      >
        <button
          type="button"
          data-ocid="auth.student.button"
          onClick={() =>
            setSelectedRole(selectedRole === "student" ? null : "student")
          }
          className="w-full rounded-2xl p-5 text-left transition-all duration-200 shadow-card border-2"
          style={{
            background: selectedRole === "student" ? "#0A8C84" : "#fff",
            borderColor: selectedRole === "student" ? "#F39A3A" : "transparent",
            color: selectedRole === "student" ? "#fff" : "#0A8C84",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background:
                  selectedRole === "student"
                    ? "rgba(255,255,255,0.2)"
                    : "#E8F5F4",
              }}
            >
              📚
            </div>
            <div>
              <p className="font-display font-bold text-lg">I am a Student</p>
              <p
                className="text-sm"
                style={{
                  color:
                    selectedRole === "student"
                      ? "rgba(255,255,255,0.8)"
                      : "#6B7280",
                }}
              >
                Learn phonics &amp; ace Olympiad exams
              </p>
            </div>
            {selectedRole === "student" && (
              <div className="ml-auto text-xl" style={{ color: "#F39A3A" }}>
                ✓
              </div>
            )}
          </div>
        </button>

        <button
          type="button"
          data-ocid="auth.parent.button"
          onClick={() =>
            setSelectedRole(selectedRole === "parent" ? null : "parent")
          }
          className="w-full rounded-2xl p-5 text-left transition-all duration-200 shadow-card border-2"
          style={{
            background: selectedRole === "parent" ? "#F39A3A" : "#fff",
            borderColor: selectedRole === "parent" ? "#0A8C84" : "transparent",
            color: selectedRole === "parent" ? "#fff" : "#F39A3A",
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
              style={{
                background:
                  selectedRole === "parent"
                    ? "rgba(255,255,255,0.2)"
                    : "#FFF5E6",
              }}
            >
              👨‍👩‍👦
            </div>
            <div>
              <p className="font-display font-bold text-lg">I am a Parent</p>
              <p
                className="text-sm"
                style={{
                  color:
                    selectedRole === "parent"
                      ? "rgba(255,255,255,0.8)"
                      : "#6B7280",
                }}
              >
                Track progress &amp; stay updated
              </p>
            </div>
            {selectedRole === "parent" && (
              <div className="ml-auto text-2xl">✓</div>
            )}
          </div>
        </button>
      </motion.div>

      {/* Login Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full max-w-sm"
      >
        <button
          type="button"
          data-ocid="auth.login.button"
          onClick={handleLogin}
          disabled={isLoggingIn}
          className="w-full py-4 rounded-2xl font-display font-bold text-white text-lg transition-all duration-200 touch-target shadow-card disabled:opacity-60"
          style={{
            background: isLoggingIn
              ? "#6B7280"
              : "linear-gradient(135deg, #0A8C84, #19A79C)",
          }}
        >
          {isLoggingIn ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Logging in...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              🔐 Login with Internet Identity
            </span>
          )}
        </button>
        <p className="text-center text-xs text-app-muted mt-4">
          Secure, decentralized authentication powered by ICP
        </p>
      </motion.div>
    </div>
  );
}
