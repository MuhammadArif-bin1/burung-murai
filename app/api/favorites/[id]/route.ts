import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const { id } = await params;
    const favorite = await prisma.favorite.findUnique({
      where: { id },
    });

    if (!favorite || favorite.userId !== user.id) {
      return jsonError("Favorit tidak ditemukan.", 404);
    }

    await prisma.favorite.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
