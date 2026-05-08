import { type ReactNode } from "react";
import { Navigate, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/auth/use-auth";

const PUBLIC_PATHS = ["/login", "/signup"];

export function AuthGuard({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isPublic = PUBLIC_PATHS.includes(pathname);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-pulse rounded-2xl bg-primary/40" aria-label="Loading" />
      </div>
    );
  }

  if (!user && !isPublic) return <Navigate to="/login" />;
  if (user && isPublic) return <Navigate to="/" />;

  return <>{children}</>;
}
