import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/serializers";
import { userPatchSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!currentUser) return jsonError("Akses ditolak.", 403);

    const { id } = await params;
    const body = userPatchSchema.parse(await request.json());
    const target = await prisma.user.findUnique({ where: { id } });

    if (!target) return jsonError("User tidak ditemukan.", 404);
    if (target.role !== "USER" && currentUser.role !== "SUPER_ADMIN") {
      return jsonError("Hanya super admin yang dapat mengelola admin lain.", 403);
    }
    if (body.role && currentUser.role !== "SUPER_ADMIN") {
      return jsonError("Hanya super admin yang dapat mengubah role.", 403);
    }

    const user = await prisma.user.update({
      where: { id },
      data: body,
    });

    return NextResponse.json(publicUser(user));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const currentUser = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!currentUser) return jsonError("Akses ditolak.", 403);

    const { id } = await params;
    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) return jsonError("User tidak ditemukan.", 404);
    if (target.id === currentUser.id) {
      return jsonError("Tidak dapat menghapus akun sendiri.", 400);
    }
    if (target.role !== "USER" && currentUser.role !== "SUPER_ADMIN") {
      return jsonError("Hanya super admin yang dapat menghapus admin lain.", 403);
    }

    await prisma.user.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
