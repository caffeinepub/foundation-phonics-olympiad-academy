import { Toaster } from "@/components/ui/sonner";
import { useQuery } from "@tanstack/react-query";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
  useNavigate,
} from "@tanstack/react-router";
import { useEffect } from "react";
import type { T__1 } from "./backend";
import { useActor } from "./hooks/useActor";
import { useInternetIdentity } from "./hooks/useInternetIdentity";
import AuthPage from "./pages/AuthPage";
import OlympiadPage from "./pages/OlympiadPage";
import ParentDashboard from "./pages/ParentDashboard";
import PhonicsPage from "./pages/PhonicsPage";
import ProfilePage from "./pages/ProfilePage";
import SetupProfile from "./pages/SetupProfile";
import StudentDashboard from "./pages/StudentDashboard";

function RootComponent() {
  return (
    <>
      <Outlet />
      <Toaster position="top-center" />
    </>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const profileQuery = useQuery<T__1 | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  const profileLoading =
    actorFetching || (isAuthenticated && profileQuery.isLoading);
  const isFetched = !!actor && profileQuery.isFetched;
  const userProfile = profileQuery.data ?? null;
  const showProfileSetup =
    isAuthenticated && !profileLoading && isFetched && userProfile === null;

  useEffect(() => {
    if (!isAuthenticated) {
      navigate({ to: "/" });
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) return null;

  if (profileLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-app-bg">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
            style={{ borderColor: "#0A8C84", borderTopColor: "transparent" }}
          />
          <p className="text-app-muted font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (showProfileSetup) return <SetupProfile />;

  return <>{children}</>;
}

function IndexRoute() {
  const { identity } = useInternetIdentity();
  const { actor, isFetching: actorFetching } = useActor();
  const navigate = useNavigate();
  const isAuthenticated = !!identity;

  const profileQuery = useQuery<T__1 | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching && isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (!isAuthenticated) return;
    const profile = profileQuery.data;
    if (profile === undefined) return;
    if (profile === null) return;
    if (profile.role.__kind__ === "parent") {
      navigate({ to: "/parent" });
    } else {
      navigate({ to: "/dashboard" });
    }
  }, [isAuthenticated, profileQuery.data, navigate]);

  if (!isAuthenticated) return <AuthPage />;
  return (
    <div className="min-h-screen flex items-center justify-center bg-app-bg">
      <div
        className="w-12 h-12 rounded-full border-4 border-t-transparent animate-spin"
        style={{ borderColor: "#0A8C84", borderTopColor: "transparent" }}
      />
    </div>
  );
}

const rootRoute = createRootRoute({ component: RootComponent });
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: IndexRoute,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: () => (
    <AuthGuard>
      <StudentDashboard />
    </AuthGuard>
  ),
});
const parentRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/parent",
  component: () => (
    <AuthGuard>
      <ParentDashboard />
    </AuthGuard>
  ),
});
const phonicsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/phonics",
  component: () => (
    <AuthGuard>
      <PhonicsPage />
    </AuthGuard>
  ),
});
const olympiadRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/olympiad",
  component: () => (
    <AuthGuard>
      <OlympiadPage />
    </AuthGuard>
  ),
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile",
  component: () => (
    <AuthGuard>
      <ProfilePage />
    </AuthGuard>
  ),
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  dashboardRoute,
  parentRoute,
  phonicsRoute,
  olympiadRoute,
  profileRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
