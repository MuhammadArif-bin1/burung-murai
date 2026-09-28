import { redirect } from "next/navigation";

/**
 * Root page: Langsung mengarahkan pengguna ke halaman beranda saat aplikasi dijalankan.
 */
export default function RootPage() {
  redirect("/beranda");
}
