import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers";
import { transactionPatchSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const { id } = await params;
    const transaction = await prisma.transaction.findUnique({
      where: { id },
      include: {
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
        bird: {
          include: {
            category: true,
            images: true,
          },
        },
        payment: true,
      },
    });

    if (
      !transaction ||
      (user.role === "USER" && transaction.buyerId !== user.id)
    ) {
      return jsonError("Transaksi tidak ditemukan.", 404);
    }

    return NextResponse.json(serializeTransaction(transaction));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);
    if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
      return jsonError("Akses ditolak.", 403);
    }

    const { id } = await params;
    const body = transactionPatchSchema.parse(await request.json());
    const transaction = await prisma.$transaction(async (tx) => {
      const updated = await tx.transaction.update({
        where: { id },
        data: { status: body.status },
        include: {
          bird: {
            include: {
              category: true,
              images: true,
            },
          },
          payment: true,
        },
      });

      if (body.status === "COMPLETED") {
        await tx.bird.update({
          where: { id: updated.birdId },
          data: { status: "SOLD" },
        });
      }

      if (body.status === "CANCELLED") {
        await tx.bird.update({
          where: { id: updated.birdId },
          data: { status: "AVAILABLE" },
        });
      }

      return updated;
    });

    return NextResponse.json(serializeTransaction(transaction));
  } catch (error) {
    return handleRouteError(error);
  }
}
