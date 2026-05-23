import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializePayment } from "@/lib/serializers";
import { paymentSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);
    if (user.role !== "USER") {
      return jsonError("Hanya user pembeli yang dapat upload pembayaran.", 403);
    }

    const body = paymentSchema.parse(await request.json());
    const transaction = await prisma.transaction.findUnique({
      where: { id: body.transactionId },
    });

    if (!transaction || transaction.buyerId !== user.id) {
      return jsonError("Transaksi tidak ditemukan.", 404);
    }

    const payment = await prisma.payment.upsert({
      where: { transactionId: body.transactionId },
      update: {
        paymentType: body.paymentType,
        paymentLabel: body.paymentLabel,
        bankName: body.bankName,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        proofImage: body.proofImage,
        proofImageUrl: body.proofImageUrl,
        status: "WAITING_VERIFICATION",
      },
      create: {
        transactionId: transaction.id,
        userId: user.id,
        amount: transaction.totalPrice,
        paymentType: body.paymentType,
        paymentLabel: body.paymentLabel,
        bankName: body.bankName,
        accountName: body.accountName,
        accountNumber: body.accountNumber,
        proofImage: body.proofImage,
        proofImageUrl: body.proofImageUrl,
        status: "WAITING_VERIFICATION",
      },
    });

    await prisma.transaction.update({
      where: { id: transaction.id },
      data: { status: "WAITING_VERIFICATION" },
    });

    return NextResponse.json(serializePayment(payment), { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
