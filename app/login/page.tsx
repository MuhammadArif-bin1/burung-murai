"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { BadgeCheck, LockKeyhole, Mail } from "lucide-react";
import { useStore } from "@/components/providers/store-provider";

const demoAccounts = [
  { label: "User", email: "user@muraimarket.test", password: "user123" },
  { label: "Admin", email: "admin@muraimarket.test", password: "admin123" },
  { label: "Super Admin", email: "super@muraimarket.test", password: "super123" },
];

export default function LoginPage() {
  const router = useRouter();
  const { authReady, currentUser, login } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!authReady || !currentUser) return;

    router.replace(currentUser.role === "USER" ? "/dashboard" : "/admin");
  }, [authReady, currentUser, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = login(email, password);
    if (!result.ok) {
      setError(result.message ?? "Login gagal.");
      return;
    }

    if (email.startsWith("user")) router.push("/dashboard");
    else router.push("/admin");
  }

  return (
    <section className="mx-auto grid w-full max-w-6xl flex-1 gap-6 px-4 py-6 sm:px-6 sm:py-10 lg:grid-cols-[1fr_420px] lg:items-center lg:px-8">
      <div className="rounded-lg bg-emerald-950 p-6 text-white shadow-sm sm:p-8">
        <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm font-semibold text-emerald-100">
          <BadgeCheck className="size-4" />
          Marketplace murai terkurasi
        </div>
        <h1 className="mt-5 text-3xl font-bold leading-tight sm:text-4xl">
          Masuk ke MuraiMarket
        </h1>
        <p className="mt-4 max-w-lg leading-7 text-emerald-50">
          Kelola transaksi, upload bukti pembayaran, dan pantau status pembelian
          murai dari satu dashboard.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
          {demoAccounts.map((account) => (
            <button
              key={account.label}
              type="button"
              onClick={() => {
                setEmail(account.email);
                setPassword(account.password);
                setError("");
              }}
              className="rounded-md border border-white/20 px-4 py-3 text-left text-sm hover:bg-white/10"
            >
              <span className="block font-semibold">{account.label}</span>
              <span className="block truncate text-emerald-100">{account.email}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Login akun</h2>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-sm font-medium">
            Email
            <span className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700">
              <Mail className="size-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 border-0 p-0"
                required
              />
            </span>
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Password
            <span className="flex items-center gap-2 rounded-md border border-slate-300 px-3 py-2 focus-within:border-emerald-700 focus-within:ring-1 focus-within:ring-emerald-700">
              <LockKeyhole className="size-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 border-0 p-0"
                required
              />
            </span>
          </label>
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Masuk
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          Belum punya akun?{" "}
          <Link href="/register" className="font-semibold text-emerald-800">
            Daftar sekarang
          </Link>
        </p>
      </div>
    </section>
  );
}
