"use client";

import Image from "next/image";
import Link from "next/link";
import { MonthlyChart } from "@/components/admin/monthly-chart";
import { useStore } from "@/components/providers/store-provider";
import { formatCurrency } from "@/lib/format";
import { CheckCircle2, ArrowRight, Bird, Receipt, Users, TrendingUp } from "lucide-react";

export default function AdminDashboardPage() {
  const { users, birds, transactions, payments } = useStore();

  const revenue = transactions
    .filter((transaction) =>
      ["PAID", "PROCESS", "COMPLETED"].includes(transaction.status)
    )
    .reduce((total, transaction) => total + transaction.totalPrice, 0);

  const pendingVerificationCount = payments.filter(
    (p) => p.status === "WAITING_VERIFICATION" || p.status === "PENDING"
  ).length;

  const stats = [
    {
      label: "Menunggu Konfirmasi",
      value: `${pendingVerificationCount} Pesanan`,
      icon: Receipt,
      highlight: pendingVerificationCount > 0,
    },
    {
      label: "Total Pendapatan",
      value: formatCurrency(revenue),
      icon: TrendingUp,
      highlight: false,
    },
    {
      label: "Burung Tersedia",
      value: `${birds.filter((b) => b.status === "AVAILABLE").length} Ekor`,
      icon: Bird,
      highlight: false,
    },
    {
      label: "Total Pengguna",
      value: `${users.length} Akun`,
      icon: Users,
      highlight: false,
    },
  ];

  const monthly = [
    { month: "Jan", amount: 1200000 },
    { month: "Feb", amount: 1800000 },
    { month: "Mar", amount: 2400000 },
    { month: "Apr", amount: 3100000 },
    { month: "Mei", amount: revenue },
    { month: "Jun", amount: 0 },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner with Burung Murai Background */}
      <div className="relative overflow-hidden rounded-3xl bg-emerald-950 text-white p-6 sm:p-8 shadow-sm">
        <Image
          src="/images/burung-murai-background.jfif"
          alt="Burung Murai Background"
          fill
          priority
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-emerald-950/60" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Panel Manajemen Administrator</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Dashboard Operasional
            </h1>
            <p className="mt-1.5 text-sm text-emerald-100/80 leading-relaxed">
              Pantau transaksi masuk, verifikasi bukti pembayaran transfer, dan kelola ketersediaan stok burung murai.
            </p>
          </div>

          <Link
            href="/admin/transaksi"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-all shadow-md self-start md:self-auto"
          >
            <span>Verifikasi Pembelian</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article
              key={stat.label}
              className={`rounded-2xl border p-5 bg-white transition-all shadow-xs ${
                stat.highlight
                  ? "border-amber-300 bg-amber-50/40 ring-1 ring-amber-200"
                  : "border-slate-200/80"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                <div
                  className={`size-8 rounded-lg flex items-center justify-center ${
                    stat.highlight
                      ? "bg-amber-100 text-amber-800"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <p
                className={`mt-3 text-2xl font-bold tracking-tight ${
                  stat.highlight ? "text-amber-900" : "text-slate-900"
                }`}
              >
                {stat.value}
              </p>
            </article>
          );
        })}
      </div>

      {/* Monthly Chart */}
      <MonthlyChart values={monthly} />
    </div>
  );
}
