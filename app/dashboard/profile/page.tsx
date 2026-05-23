"use client";

import { FormEvent, useState } from "react";
import { useStore } from "@/components/providers/store-provider";

export default function ProfilePage() {
  const { currentUser, updateProfile } = useStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: currentUser?.name ?? "",
    phone: currentUser?.phone ?? "",
    address: currentUser?.address ?? "",
    city: currentUser?.city ?? "",
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    updateProfile(form);
    setSaved(true);
  }

  return (
    <div className="max-w-2xl">
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-emerald-700">
          Profil
        </p>
        <h1 className="mt-2 text-3xl font-bold text-slate-950">Profil akun</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Pastikan nama, nomor HP, alamat, dan kota tetap akurat untuk proses transaksi.
        </p>
      </div>
      <form
        className="mt-6 grid gap-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
        onSubmit={handleSubmit}
      >
        {[
          { key: "name", label: "Nama" },
          { key: "phone", label: "Nomor HP" },
          { key: "address", label: "Alamat" },
          { key: "city", label: "Kota" },
        ].map((field) => (
          <label key={field.key} className="grid gap-2 text-sm font-semibold text-slate-800">
            {field.label}
            <input
              value={form[field.key as keyof typeof form]}
              onChange={(event) =>
                setForm((value) => ({ ...value, [field.key]: event.target.value }))
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-slate-950 shadow-sm focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100"
            />
          </label>
        ))}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
          >
            Simpan perubahan
          </button>
          {saved && <span className="text-sm text-emerald-700">Profil diperbarui.</span>}
        </div>
      </form>
    </div>
  );
}
