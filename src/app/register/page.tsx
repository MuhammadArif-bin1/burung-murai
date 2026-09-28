"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useStore } from "@/components/providers/store-provider";
import { UserRound, Mail, Phone, LockKeyhole, Eye, EyeOff, Bird } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Konfirmasi password belum sama.");
      return;
    }
    const result = register({
      name: form.name,
      email: form.email,
      phone: form.phone,
      password: form.password
    });
    if (!result.ok) {
      setError(result.message ?? "Registrasi gagal.");
      return;
    }
    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-lg bg-white shadow-xl overflow-hidden border border-stone-200">
        <div className="p-8 sm:p-10">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="flex items-center justify-center gap-2">
              <Bird className="w-5 h-5 text-stone-900" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-stone-900 font-body">MuraiMarket</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight font-heading">
              Daftar Akun Baru
            </h1>
            <p className="text-xs text-stone-500 font-body">
              Bergabung dengan MuraiMarket sekarang
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-body">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="name">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <UserRound className="w-4 h-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                  placeholder="Nama Lengkap"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                  placeholder="nama@email.com"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="phone">
                Nomor HP
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <Phone className="w-4 h-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="block w-full pl-10 pr-4 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                  placeholder="081234567890"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="block w-full pl-10 pr-10 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-[0.15em] text-stone-600 font-body" htmlFor="confirmPassword">
                Konfirmasi Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                  <LockKeyhole className="w-4 h-4" />
                </div>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="block w-full pl-10 pr-10 py-2.5 border border-stone-300 bg-white text-stone-900 placeholder:text-stone-400 focus:border-stone-800 text-xs font-body"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 px-4 inline-flex justify-center items-center gap-2 bg-stone-900 text-white text-xs font-semibold uppercase tracking-[0.2em] hover:bg-stone-800 transition-all duration-200 shadow-sm font-body"
              >
                Daftar Sekarang
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-stone-500 font-body">
            Sudah punya akun?{" "}
            <Link href="/login" className="font-semibold text-stone-900 hover:underline transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
