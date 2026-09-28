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
  CheckCircle2,
} from "lucide-react";
import type { ReactNode } from "react";
import { useStore } from "@/components/providers/store-provider";

const userLinks = [
  { href: "/dashboard", label: "Ringkasan Akun", icon: House },
  { href: "/dashboard/transaksi", label: "Riwayat Transaksi", icon: Receipt },
  { href: "/dashboard/favorit", label: "Favorit Saya", icon: Heart },
  { href: "/dashboard/profile", label: "Profil Pembeli", icon: UserRound },
];

const adminLinks = [
  { href: "/admin/transaksi", label: "Konfirmasi Pembelian", icon: CheckCircle2 },
  { href: "/admin", label: "Ringkasan Operasional", icon: House },
  { href: "/admin/burung", label: "Kelola Stok Burung", icon: Bird },
  { href: "/admin/kategori", label: "Kategori Burung", icon: Tags },
  { href: "/admin/laporan", label: "Laporan Keuangan", icon: ChartColumn },
  { href: "/admin/users", label: "Data Pelanggan", icon: UsersRound },
];

export function DashboardShell({
  children,
  mode,
}: {
  children: ReactNode;
  mode?: "user" | "admin";
}) {
  const pathname = usePathname();
  const { currentUser, payments } = useStore();

  const isExplicitAdmin = mode === "admin";
  const isUserAdminRole =
    currentUser?.role === "ADMIN" || currentUser?.role === "SUPER_ADMIN";
  const links =
    isExplicitAdmin || (!mode && isUserAdminRole) ? adminLinks : userLinks;

  // Hitung jumlah pembayaran yang butuh verifikasi
  const pendingVerificationCount = payments.filter(
    (p) => p.status === "WAITING_VERIFICATION" || p.status === "PENDING"
  ).length;

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 text-slate-950 sm:px-6 lg:flex-row lg:gap-8 lg:px-8">
      <aside className="w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-xs lg:sticky lg:top-24 lg:h-fit lg:w-64">
        <div className="border-b border-slate-100 bg-slate-50/70 p-5">
          <div className="flex items-center gap-3">
            <div className="flex size-11 items-center justify-center rounded-xl bg-emerald-700 text-lg font-bold text-white shadow-sm shadow-emerald-700/20">
              {currentUser?.name?.charAt(0).toUpperCase() || "A"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-900">
                {currentUser?.name || (mode === "admin" ? "Admin Murai" : "Pembeli")}
              </p>
              <p className="text-[11px] font-semibold tracking-wide uppercase text-emerald-700">
                {mode === "admin" || isUserAdminRole ? "Petugas Verifikasi" : "Akun Pembeli"}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex gap-1.5 overflow-x-auto p-3 lg:grid lg:overflow-visible lg:p-4">
          {links.map(({ href, label, icon: Icon }) => {
            const active =
              pathname === href ||
              (href !== "/admin" &&
                href !== "/dashboard" &&
                pathname.startsWith(`${href}/`));
            const isVerificationLink = href === "/admin/transaksi";

            return (
              <Link
                key={href}
                href={href}
                className={`flex shrink-0 items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all lg:gap-3 ${
                  active
                    ? "bg-emerald-700 text-white shadow-sm shadow-emerald-700/20 font-semibold"
                    : "text-slate-600 hover:bg-emerald-50/80 hover:text-emerald-900"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`size-4.5 ${active ? "text-white" : "text-slate-500"}`} />
                  <span>{label}</span>
                </div>

                {isVerificationLink && (mode === "admin" || isUserAdminRole) && pendingVerificationCount > 0 && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      active
                        ? "bg-amber-400 text-slate-950"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {pendingVerificationCount}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </aside>

      <section className="min-w-0 flex-1">{children}</section>
    </div>
  );
}
