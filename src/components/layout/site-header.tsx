"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/providers";
import { Bird, Heart, LogOut, Menu, X, LogIn, User, Search } from "lucide-react";
import { useState } from "react";

export function SiteHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, logout } = useStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const isInAdminArea = pathname.startsWith("/admin");

  const publicLinks = [
    { href: "/burung", label: "KATALOG" },
    { href: "/beranda", label: "BERANDA" },
    { href: "/dashboard/transaksi", label: "TRANSAKSI" },
    { href: "/dashboard/favorit", label: "FAVORIT" },
  ];

  function handleLogout() {
    logout();
    router.push("/login");
  }

  // ADMIN HEADER
  if (isAdmin || isInAdminArea) {
    return (
      <header className="sticky top-0 z-50 w-full bg-stone-900 text-white border-b border-stone-800 shadow-md">
        <div className="mx-auto max-w-7xl px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="flex items-center gap-2.5 group">
              <Bird className="w-5 h-5 text-amber-400" />
              <div>
                <span className="font-bold text-sm tracking-[0.1em] uppercase text-white block leading-tight font-body">
                  MuraiMarket
                </span>
                <span className="text-[10px] font-medium text-stone-400 block tracking-wider uppercase font-body">
                  Admin Panel
                </span>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/beranda"
              className="hidden md:inline-flex text-xs text-stone-400 hover:text-white transition-colors uppercase tracking-wider font-body"
            >
              Lihat Website
            </Link>

            <div className="flex items-center gap-2 pl-3 border-l border-stone-700">
              <div className="hidden sm:flex flex-col text-right">
                <span className="text-xs font-semibold text-stone-200 font-body">
                  {currentUser?.name || "Administrator"}
                </span>
                <span className="text-[10px] text-amber-400 font-medium font-body">
                  {currentUser?.role || "ADMIN"}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer font-body"
                title="Keluar"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }

  // PUBLIC HEADER — NatureHike style
  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-stone-200 transition-all">
      <div className="mx-auto max-w-7xl px-4">
        {/* Main header row */}
        <div className="flex h-16 items-center justify-between">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-4">
            <button
              className="md:hidden p-1.5 text-stone-700 hover:text-stone-900 cursor-pointer"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link
              href="/beranda"
              className="flex items-center gap-2 group"
            >
              <Bird className="w-5 h-5 text-stone-900" />
              <span className="font-bold text-base tracking-[0.15em] uppercase text-stone-900 font-body">
                MuraiMarket
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/beranda" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors hover:text-stone-900 font-body ${
                    isActive
                      ? "text-stone-900 border-b-2 border-stone-900 pb-0.5"
                      : "text-stone-500"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-3">
            <Link href="/burung" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <Search className="w-4 h-4" />
            </Link>

            <Link href="/dashboard/favorit" className="p-2 text-stone-600 hover:text-stone-900 transition-colors">
              <Heart className="w-4 h-4" />
            </Link>

            {currentUser ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/dashboard"
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors font-body"
                >
                  <User className="w-3.5 h-3.5" />
                  <span className="uppercase tracking-wider">{currentUser.name.split(" ")[0]}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-2 text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
                  title="Keluar"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-[10px] font-semibold uppercase tracking-[0.2em] hover:bg-stone-800 transition-colors font-body"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Masuk</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-stone-100 absolute w-full left-0 shadow-lg">
          <nav className="flex flex-col py-4">
            {publicLinks.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/beranda" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`px-6 py-3 text-xs font-semibold uppercase tracking-[0.2em] transition-colors font-body ${
                    isActive
                      ? "bg-stone-50 text-stone-900"
                      : "text-stone-600 hover:bg-stone-50"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="mx-6 mt-3 pt-3 border-t border-stone-100">
              {currentUser ? (
                <div className="flex items-center justify-between py-2">
                  <span className="text-xs font-semibold text-stone-700 font-body">{currentUser.name}</span>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="text-xs font-semibold text-stone-500 uppercase tracking-wider font-body"
                  >
                    Keluar
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 bg-stone-900 text-white text-xs font-semibold uppercase tracking-[0.2em] font-body"
                >
                  <LogIn className="w-4 h-4" />
                  Masuk Akun
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
