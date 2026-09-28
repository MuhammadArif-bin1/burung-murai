import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const [totalUsers, totalBirds, availableBirds, soldBirds, totalTransactions, revenue] =
      await Promise.all([
        prisma.user.count(),
        prisma.bird.count(),
        prisma.bird.count({ where: { status: "AVAILABLE" } }),
        prisma.bird.count({ where: { status: "SOLD" } }),
        prisma.transaction.count(),
        prisma.transaction.aggregate({
          _sum: { totalPrice: true },
          where: {
            status: {
              in: ["PAID", "PROCESS", "COMPLETED"],
            },
          },
        }),
      ]);

    return NextResponse.json({
      totalUsers,
      totalBirds,
      availableBirds,
      soldBirds,
      totalTransactions,
      totalRevenue: Number(revenue._sum.totalPrice ?? 0),
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
