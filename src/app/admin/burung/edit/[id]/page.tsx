"use client";

import { useParams } from "next/navigation";
import { BirdForm } from "@/components/admin/bird-form";
import { EmptyState } from "@/components/ui/empty-state";
import { useStore } from "@/components/providers/store-provider";

export default function EditBirdPage() {
  const params = useParams<{ id: string }>();
  const { getBirdById } = useStore();
  const bird = getBirdById(params.id);

  if (!bird) {
    return (
      <EmptyState
        title="Burung tidak ditemukan"
        description="Data yang ingin diedit tidak tersedia."
      />
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold">Edit burung</h1>
      <div className="mt-6">
        <BirdForm bird={bird} />
      </div>
    </div>
  );
}
