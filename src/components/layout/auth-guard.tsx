"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useStore } from "@/components/providers/store-provider";
import type { Role } from "@/lib/types";

export function AuthGuard({
  children,
  roles,
}: {
  children: React.ReactNode;
  roles: Role[];
}) {
  const router = useRouter();
  const { authReady, currentUser } = useStore();

  useEffect(() => {
    if (!authReady) return;

    if (!currentUser) {
      router.replace("/login");
      return;
    }

    if (!roles.includes(currentUser.role)) {
      router.replace("/");
    }
  }, [authReady, currentUser, roles, router]);

  if (!authReady) {
    return (
      <div className="mx-auto grid w-full max-w-7xl gap-4 px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
          <div className="h-24 animate-pulse rounded-lg bg-slate-200" />
        </div>
      </div>
    );
  }

  if (!currentUser || !roles.includes(currentUser.role)) {
    return (
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="h-28 animate-pulse rounded-lg bg-slate-200" />
      </div>
    );
  }

  return <>{children}</>;
}
