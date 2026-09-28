"use client";

import { FormEvent, useState } from "react";
import { useStore } from "@/components/providers/store-provider";

export default function AdminCategoriesPage() {
  const { categories, createCategory, updateCategory, deleteCategory } = useStore();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) return;

    if (editingId) {
      updateCategory(editingId, { name, description });
    } else {
      createCategory({ name, description });
    }
    setName("");
    setDescription("");
    setEditingId(null);
  }

  return (
    <div className="grid gap-6">
      <div>
        <p className="text-sm text-slate-500">Master data</p>
        <h1 className="text-3xl font-bold">Kategori</h1>
      </div>
      <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-5 md:grid-cols-[1fr_1fr_auto]" onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Nama kategori"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Deskripsi singkat"
          className="rounded-md border border-slate-300 px-3 py-2"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-900 px-4 py-2 font-semibold text-white hover:bg-emerald-800"
        >
          {editingId ? "Simpan" : "Tambah"}
        </button>
      </form>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="font-semibold">{category.name}</p>
              <p className="text-sm text-slate-500">{category.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setEditingId(category.id);
                  setName(category.name);
                  setDescription(category.description ?? "");
                }}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deleteCategory(category.id)}
                className="rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
