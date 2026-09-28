import { AuthGuard } from "@/components/layout/auth-guard";
import { DashboardShell } from "@/components/layout/dashboard-shell";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard roles={["ADMIN", "SUPER_ADMIN"]}>
      <DashboardShell mode="admin">{children}</DashboardShell>
    </AuthGuard>
  );
}
