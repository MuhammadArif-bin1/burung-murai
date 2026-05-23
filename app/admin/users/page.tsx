"use client";

import { useStore } from "@/components/providers/store-provider";
import type { UserStatus } from "@/lib/types";

export default function AdminUsersPage() {
  const { users, currentUser, updateUserStatus, deleteUser } = useStore();

  return (
    <div>
      <div>
        <p className="text-sm text-slate-500">Pengguna</p>
        <h1 className="text-3xl font-bold">Data user</h1>
      </div>
      <div className="mt-6 overflow-hidden rounded-lg border border-slate-200 bg-white">
        {users.map((user) => (
          <div
            key={user.id}
            className="grid gap-3 border-b border-slate-200 px-5 py-4 last:border-b-0 lg:grid-cols-[1.3fr_1fr_1fr_auto] lg:items-center"
          >
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-slate-500">{user.email}</p>
            </div>
            <span className="text-sm">{user.role}</span>
            <select
              value={user.status}
              disabled={user.id === currentUser?.id}
              onChange={(event) =>
                updateUserStatus(user.id, event.target.value as UserStatus)
              }
              className="rounded-md border border-slate-300 px-3 py-2 text-sm disabled:bg-slate-100"
            >
              <option value="ACTIVE">Aktif</option>
              <option value="SUSPENDED">Nonaktif</option>
            </select>
            <button
              type="button"
              disabled={user.id === currentUser?.id}
              onClick={() => deleteUser(user.id)}
              className="rounded-md border border-rose-200 px-3 py-2 text-sm font-medium text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Hapus
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
