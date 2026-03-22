import { useGetCallerUserProfile } from "../hooks/useQueries";

interface TopBarProps {
  title?: string;
}

export default function TopBar({ title }: TopBarProps) {
  const { data: profile } = useGetCallerUserProfile();
  const fullName = profile?.fullName ?? "";
  const initials =
    fullName
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "👤";

  return (
    <header
      className="flex items-center justify-between px-4 pt-10 pb-3"
      style={{ background: "linear-gradient(135deg, #1F4B9A, #2D5EC7)" }}
    >
      <div className="flex items-center gap-2">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          🎓
        </div>
        <div>
          <p className="text-white font-display font-extrabold text-base leading-tight">
            {title ?? "FP&OA"}
          </p>
          {!title && (
            <p className="text-white/60 text-[10px] leading-tight">
              Foundation Phonics & Olympiad
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          type="button"
          data-ocid="topbar.notification.button"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-xl"
          style={{ background: "rgba(255,255,255,0.15)" }}
        >
          🔔
        </button>
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center font-display font-bold text-sm text-white"
          style={{ background: "rgba(201,162,58,0.9)" }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
