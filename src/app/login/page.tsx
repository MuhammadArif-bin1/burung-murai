"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useStore } from "@/providers";
import {
  ShieldCheck,
  LockKeyhole,
  Mail,
  Eye,
  EyeOff,
  UserCheck,
  ArrowRight,
  Bird,
} from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const { authReady, currentUser, login, users } = useStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const demoAccounts = [
    {
      role: "ADMIN",
      label: "Admin Murai",
      email: "admin@muraimarket.test",
      password: "admin123",
      description: "Manajemen stok, verifikasi transaksi, & laporan",
      icon: ShieldCheck,
    },
    {
      role: "USER",
      label: "Budi Santoso (Pembeli)",
      email: "user@muraimarket.test",
      password: "user123",
      description: "Katalog, checkout, upload bukti bayar",
      icon: UserCheck,
    },
  ];

  useEffect(() => {
    if (!authReady || !currentUser) return;
    if (currentUser.role === "ADMIN" || currentUser.role === "SUPER_ADMIN") {
      router.replace("/admin");
    } else {
      router.replace("/dashboard");
    }
  }, [authReady, currentUser, router]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = login(email, password);
    if (!result.ok) {
      setError(result.message ?? "Email atau kata sandi tidak sesuai.");
      setLoading(false);
      return;
    }

    const loggedUser = users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (loggedUser?.role === "ADMIN" || loggedUser?.role === "SUPER_ADMIN") {
      router.push("/admin");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8 overflow-hidden bg-stone-950">
      {/* Background */}
      <Image
        src="/images/hero-banner.jpg"
        alt="Background"
        fill
        priority
        className="object-cover opacity-30"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-stone-950/90 via-stone-950/80 to-stone-950/95" />

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-4xl bg-white overflow-hidden flex flex-col lg:grid lg:grid-cols-12 min-h-[560px] shadow-2xl">
        {/* Left Panel */}
        <div className="lg:col-span-5 relative bg-stone-900 p-8 lg:p-10 text-white flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-stone-800">
          <div className="space-y-5">
            <div className="flex items-center gap-2">
              <Bird className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-white font-body">
                MuraiMarket
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight font-heading">
                Selamat Datang
              </h1>
              <p className="mt-3 text-xs leading-6 text-stone-400 font-body">
                Masuk untuk mengelola transaksi, stok burung murai, atau mengakses dashboard pembelian Anda.
              </p>
            </div>
          </div>

          {/* Demo Accounts */}
          <div className="mt-8 space-y-3">
            <h2 className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-500 font-body">
              Akun Demo
            </h2>

            <div className="grid gap-2.5">
              {demoAccounts.map((acc, idx) => {
                const isSelected = email === acc.email;
                const Icon = acc.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setEmail(acc.email);
                      setPassword(acc.password);
                      setError(null);
                    }}
                    className={`flex flex-col text-left p-3.5 border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-stone-800 border-amber-400/60 shadow-md"
                        : "bg-stone-800/50 hover:bg-stone-800 border-stone-700/60"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-3.5 h-3.5 text-amber-400" />
                      <span className="font-semibold text-xs text-white font-body">{acc.label}</span>
                    </div>
                    <span className="text-[10px] text-stone-400 mt-1 font-mono">{acc.email}</span>
                    <span className="text-[10px] text-stone-500 mt-0.5 font-body">{acc.description}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Panel: Form */}
        <div className="lg:col-span-7 p-8 lg:p-12 flex flex-col justify-center bg-white z-10">
          <div className="max-w-md w-full mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-stone-900 tracking-tight font-heading">
                Masuk ke Akun
              </h2>
              <p className="mt-1.5 text-xs text-stone-500 font-body">
                Masukkan email dan kata sandi Anda
              </p>
            </div>

            {error && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-body">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="email">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="block w-full pl-10 pr-4 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                    placeholder="nama@muraimarket.test"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="password">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <LockKeyhole className="w-4 h-4" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full pl-10 pr-10 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-stone-800 active:scale-[0.99] focus:outline-none transition-all duration-200 shadow-sm disabled:opacity-75 cursor-pointer font-body"
                >
                  {loading ? (
                    <div className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Masuk</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>

            <div className="pt-4 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-body">
              <span className="text-stone-500">
                Belum punya akun?{" "}
                <Link href="/register" className="font-semibold text-stone-900 hover:underline">
                  Daftar di sini
                </Link>
              </span>
              <Link href="/beranda" className="text-stone-500 hover:text-stone-900 transition-colors">
                Lihat Marketplace →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
