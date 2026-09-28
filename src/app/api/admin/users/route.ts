import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/serializers";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const users = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(users.map(publicUser));
  } catch (error) {
    return handleRouteError(error);
  }
}
