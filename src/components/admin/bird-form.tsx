"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/components/providers/store-provider";
import type { Bird } from "@/lib/types";

type BirdFormProps = {
  bird?: Bird;
};

type BirdFormState = {
  name: string;
  categoryId: string;
  price: string;
  location: string;
  city: string;
  age: string;
  gender: Bird["gender"];
  condition: string;
  description: string;
  image: string;
  status: Bird["status"];
  isFeatured: boolean;
};

export function BirdForm({ bird }: BirdFormProps) {
  const router = useRouter();
  const { categories, createBird, updateBird } = useStore();
  const [form, setForm] = useState<BirdFormState>({
    name: bird?.name ?? "",
    categoryId: bird?.categoryId ?? categories[0]?.id ?? "",
    price: String(bird?.price ?? ""),
    location: bird?.location ?? "",
    city: bird?.city ?? "",
    age: bird?.age ?? "",
    gender: bird?.gender ?? "UNKNOWN",
    condition: bird?.condition ?? "",
    description: bird?.description ?? "",
    image: bird?.images[0] ?? "/images/bird-1.png",
    status: bird?.status ?? "AVAILABLE",
    isFeatured: bird?.isFeatured ?? false,
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const draft = {
      categoryId: form.categoryId,
      name: form.name,
      description: form.description,
      price: Number(form.price),
      location: form.location,
      city: form.city,
      age: form.age,
      gender: form.gender as Bird["gender"],
      condition: form.condition,
      status: form.status as Bird["status"],
      isFeatured: form.isFeatured,
      images: [form.image],
    };

    if (bird) {
      updateBird(bird.id, draft);
    } else {
      createBird(draft);
    }
    router.push("/admin/burung");
  }

  return (
    <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5" onSubmit={handleSubmit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm font-medium">
          Nama burung
          <input
            value={form.name}
            onChange={(event) => setForm((value) => ({ ...value, name: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Kategori
          <select
            value={form.categoryId}
            onChange={(event) =>
              setForm((value) => ({ ...value, categoryId: event.target.value }))
            }
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Harga
          <input
            value={form.price}
            onChange={(event) => setForm((value) => ({ ...value, price: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2"
            inputMode="numeric"
            required
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Status
          <select
            value={form.status}
            onChange={(event) =>
              setForm((value) => ({
                ...value,
                status: event.target.value as Bird["status"],
              }))
            }
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="AVAILABLE">Tersedia</option>
            <option value="BOOKED">Dipesan</option>
            <option value="SOLD">Terjual</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Lokasi
          <input
            value={form.location}
            onChange={(event) =>
              setForm((value) => ({ ...value, location: event.target.value }))
            }
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Kota
          <input
            value={form.city}
            onChange={(event) => setForm((value) => ({ ...value, city: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Umur
          <input
            value={form.age}
            onChange={(event) => setForm((value) => ({ ...value, age: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Jenis kelamin
          <select
            value={form.gender}
            onChange={(event) =>
              setForm((value) => ({
                ...value,
                gender: event.target.value as Bird["gender"],
              }))
            }
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="MALE">Jantan</option>
            <option value="FEMALE">Betina</option>
            <option value="UNKNOWN">Belum diketahui</option>
          </select>
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Kondisi
          <input
            value={form.condition}
            onChange={(event) =>
              setForm((value) => ({ ...value, condition: event.target.value }))
            }
            className="rounded-md border border-slate-300 px-3 py-2"
          />
        </label>
        <label className="grid gap-2 text-sm font-medium">
          Foto utama
          <select
            value={form.image}
            onChange={(event) => setForm((value) => ({ ...value, image: event.target.value }))}
            className="rounded-md border border-slate-300 px-3 py-2"
          >
            <option value="/images/bird-1.png">bird-1.png</option>
            <option value="/images/bird-2.png">bird-2.png</option>
            <option value="/images/bird-3.png">bird-3.png</option>
          </select>
        </label>
      </div>
      <label className="grid gap-2 text-sm font-medium">
        Deskripsi
        <textarea
          value={form.description}
          onChange={(event) =>
            setForm((value) => ({ ...value, description: event.target.value }))
          }
          className="min-h-28 rounded-md border border-slate-300 px-3 py-2"
        />
      </label>
      <label className="flex items-center gap-3 text-sm font-medium">
        <input
          type="checkbox"
          checked={form.isFeatured}
          onChange={(event) =>
            setForm((value) => ({ ...value, isFeatured: event.target.checked }))
          }
        />
        Tampilkan sebagai unggulan
      </label>
      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-emerald-900 px-4 py-3 font-semibold text-white hover:bg-emerald-800"
        >
          {bird ? "Simpan perubahan" : "Tambah burung"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/burung")}
          className="rounded-md border border-slate-300 px-4 py-3 font-semibold hover:bg-slate-50"
        >
          Batal
        </button>
      </div>
    </form>
  );
}
