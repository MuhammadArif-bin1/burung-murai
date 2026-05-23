import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const transactions = await prisma.transaction.findMany({
      where: {
        status: {
          in: ["PAID", "PROCESS", "COMPLETED"],
        },
      },
      select: {
        totalPrice: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    const monthly = new Map<string, { month: string; totalTransactions: number; totalRevenue: number }>();

    for (const transaction of transactions) {
      const month = transaction.createdAt.toISOString().slice(0, 7);
      const current = monthly.get(month) ?? {
        month,
        totalTransactions: 0,
        totalRevenue: 0,
      };
      current.totalTransactions += 1;
      current.totalRevenue += Number(transaction.totalPrice);
      monthly.set(month, current);
    }

    return NextResponse.json({
      monthly: [...monthly.values()],
      totalRevenue: transactions.reduce(
        (total: number, transaction: any) => total + Number(transaction.totalPrice),
        0,
      ),
      totalTransactions: transactions.length,
    });
  } catch (error) {
    return handleRouteError(error);
  }
}
