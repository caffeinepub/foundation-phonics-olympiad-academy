import { useLocation, useNavigate } from "@tanstack/react-router";

const NAV_ITEMS = [
  { icon: "🏠", label: "Home", path: "/dashboard" },
  { icon: "📚", label: "Phonics", path: "/phonics" },
  { icon: "🏆", label: "Olympiad", path: "/olympiad" },
  { icon: "📊", label: "Board", path: "/olympiad" },
  { icon: "👤", label: "Profile", path: "/profile" },
];

export default function BottomNav() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bottom-nav-height shadow-nav z-40"
      style={{ background: "#1F4B9A" }}
    >
      <div className="flex items-center justify-around h-[60px]">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.path;
          return (
            <button
              key={item.path + item.label}
              type="button"
              data-ocid={`nav.${item.label.toLowerCase()}.link`}
              onClick={() =>
                navigate({
                  to: item.path as
                    | "/dashboard"
                    | "/phonics"
                    | "/olympiad"
                    | "/profile",
                })
              }
              className="flex flex-col items-center justify-center flex-1 h-full relative py-1 transition-all"
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span
                className="text-[10px] font-bold mt-0.5 transition-colors"
                style={{ color: active ? "#C9A23A" : "rgba(255,255,255,0.7)" }}
              >
                {item.label}
              </span>
              {active && (
                <span
                  className="absolute bottom-1 w-1 h-1 rounded-full"
                  style={{ background: "#C9A23A" }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
