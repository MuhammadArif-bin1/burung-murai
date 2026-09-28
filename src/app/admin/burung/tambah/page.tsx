import { BirdForm } from "@/components/admin/bird-form";

export default function AddBirdPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">Tambah burung</h1>
      <div className="mt-6">
        <BirdForm />
      </div>
    </div>
  );
}
