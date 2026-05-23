import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializePayment } from "@/lib/serializers";
import { paymentPatchSchema } from "@/lib/validations";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const { id } = await params;
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: {
        transaction: true,
      },
    });

    if (
      !payment ||
      (user.role === "USER" && payment.userId !== user.id)
    ) {
      return jsonError("Pembayaran tidak ditemukan.", 404);
    }

    return NextResponse.json(serializePayment(payment));
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
    const body = paymentPatchSchema.parse(await request.json());
    const payment = await prisma.$transaction(async (tx) => {
      const updated = await tx.payment.update({
        where: { id },
        data: {
          status: body.status,
          adminNote: body.adminNote,
          paidAt: body.status === "PAID" ? new Date() : undefined,
        },
      });

      if (body.status === "PAID") {
        await tx.transaction.update({
          where: { id: updated.transactionId },
          data: { status: "PAID" },
        });
      }

      if (body.status === "REJECTED") {
        await tx.transaction.update({
          where: { id: updated.transactionId },
          data: { status: "WAITING_PAYMENT" },
        });
      }

      return updated;
    });

    return NextResponse.json(serializePayment(payment));
  } catch (error) {
    return handleRouteError(error);
  }
}
