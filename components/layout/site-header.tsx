"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bird, Heart, LogOut, Menu, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/providers/store-provider";

const publicLinks = [
  { href: "/", label: "Beranda" },
  { href: "/burung", label: "Katalog" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [open, setOpen] = useState(false);

  function handleLogout() {
    logout();
    router.push("/");
  }

  const accountHref =
    currentUser?.role === "USER"
      ? "/dashboard"
      : currentUser
        ? "/admin"
        : "/login";

  return (
    <header className="sticky top-0 z-30 border-b border-emerald-950/10 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-emerald-950">
          <span className="flex size-10 items-center justify-center rounded-md bg-emerald-900 text-white">
            <Bird className="size-5" />
          </span>
          <span>
            <span className="block text-lg font-bold leading-none">MuraiMarket</span>
            <span className="block text-xs text-slate-500">Marketplace burung murai</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {publicLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium ${
                pathname === link.href
                  ? "bg-emerald-50 text-emerald-900"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {link.label}
            </Link>
          ))}
          {currentUser?.role === "USER" && (
            <Link
              href="/dashboard/favorit"
              className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
            >
              <Heart className="size-4" />
              Favorit
            </Link>
          )}
          <Link
            href={accountHref}
            className="inline-flex items-center gap-2 rounded-md bg-emerald-900 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-800"
          >
            {currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN" ? (
              <ShieldCheck className="size-4" />
            ) : (
              <UserRound className="size-4" />
            )}
            {currentUser ? currentUser.name.split(" ")[0] : "Masuk"}
          </Link>
          {currentUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100"
              aria-label="Keluar"
              title="Keluar"
            >
              <LogOut className="size-4" />
            </button>
          )}
        </nav>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-md border border-slate-200 md:hidden"
          aria-label="Buka menu"
          onClick={() => setOpen((value) => !value)}
        >
          <Menu className="size-5" />
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-3 md:hidden">
          <div className="flex flex-col gap-2">
            {publicLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={accountHref}
              className="rounded-md bg-emerald-900 px-3 py-2 text-sm font-medium text-white"
              onClick={() => setOpen(false)}
            >
              {currentUser ? "Dashboard" : "Masuk"}
            </Link>
            {currentUser && (
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-md px-3 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Keluar
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
