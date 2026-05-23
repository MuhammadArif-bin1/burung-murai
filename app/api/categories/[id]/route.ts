import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { categoryPatchSchema } from "@/lib/validations";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const { id } = await params;
    const body = categoryPatchSchema.parse(await request.json());
    const category = await prisma.category.update({
      where: { id },
      data: {
        ...body,
        ...(body.name ? { slug: slugify(body.name) } : {}),
      },
    });
    return NextResponse.json(category);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const { id } = await params;
    await prisma.category.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
