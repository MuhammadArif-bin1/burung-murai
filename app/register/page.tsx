"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { useStore } from "@/components/providers/store-provider";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useStore();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

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
      password: form.password,
    });

    if (!result.ok) {
      setError(result.message ?? "Registrasi gagal.");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <section className="mx-auto w-full max-w-xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-lg border border-slate-200 bg-white p-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Daftar
        </p>
        <h1 className="mt-2 text-3xl font-bold">Buat akun pembeli</h1>
        <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
          {[
            { key: "name", label: "Nama", type: "text" },
            { key: "email", label: "Email", type: "email" },
            { key: "phone", label: "Nomor HP", type: "tel" },
            { key: "password", label: "Password", type: "password" },
            {
              key: "confirmPassword",
              label: "Konfirmasi password",
              type: "password",
            },
          ].map((field) => (
            <label key={field.key} className="grid gap-2 text-sm font-medium">
              {field.label}
              <input
                type={field.type}
                value={form[field.key as keyof typeof form]}
                onChange={(event) =>
                  setForm((value) => ({
                    ...value,
                    [field.key]: event.target.value,
                  }))
                }
                className="rounded-md border border-slate-300 px-3 py-2"
                required
              />
            </label>
          ))}
          {error && <p className="text-sm text-rose-600">{error}</p>}
          <button
            type="submit"
            className="rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Daftar
          </button>
        </form>
        <p className="mt-5 text-sm text-slate-500">
          Sudah punya akun?{" "}
          <Link href="/login" className="font-semibold text-emerald-800">
            Masuk
          </Link>
        </p>
      </div>
    </section>
  );
}
