"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bird,
  ChartColumn,
  Heart,
  House,
  Receipt,
  Tags,
  UserRound,
  UsersRound,
} from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/components/providers/store-provider";

const userLinks = [
  { href: "/dashboard", label: "Ringkasan", icon: House },
  { href: "/dashboard/favorit", label: "Favorit", icon: Heart },
  { href: "/dashboard/transaksi", label: "Transaksi", icon: Receipt },
  { href: "/dashboard/profile", label: "Profil", icon: UserRound },
];

const adminLinks = [
  { href: "/admin", label: "Ringkasan", icon: House },
  { href: "/admin/burung", label: "Burung", icon: Bird },
  { href: "/admin/kategori", label: "Kategori", icon: Tags },
  { href: "/admin/users", label: "User", icon: UsersRound },
  { href: "/admin/transaksi", label: "Transaksi", icon: Receipt },
  { href: "/admin/laporan", label: "Laporan", icon: ChartColumn },
];

export function DashboardShell({
  children,
  mode,
}: {
  children: ReactNode;
  mode: "user" | "admin";
}) {
  const pathname = usePathname();
  const { currentUser } = useStore();
  const links = mode === "admin" ? adminLinks : userLinks;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-5 px-4 py-4 text-slate-950 sm:px-6 sm:py-6 lg:flex-row lg:gap-6 lg:px-8">
      <aside className="w-full shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm lg:sticky lg:top-6 lg:h-fit lg:w-64">
        <div className="border-b border-slate-200 p-4">
          <p className="text-sm font-medium text-slate-600">
            {mode === "admin" ? "Panel admin" : "Akun pembeli"}
          </p>
          <p className="mt-1 truncate font-semibold text-slate-900">
            {currentUser?.name}
          </p>
        </div>
        <nav className="flex gap-1.5 overflow-x-auto p-3 lg:grid lg:overflow-visible lg:p-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              ((href !== "/admin" && href !== "/dashboard") &&
                pathname.startsWith(`${href}/`));
            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium lg:gap-3 ${
                  active
                    ? "bg-emerald-900 text-white shadow-sm"
                    : "text-slate-700 hover:bg-emerald-50 hover:text-emerald-950"
                }`}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
