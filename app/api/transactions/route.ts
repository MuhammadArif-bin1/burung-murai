import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeTransaction } from "@/lib/serializers";
import { createInvoiceNumber } from "@/lib/utils";
import { transactionSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const transactions = await prisma.transaction.findMany({
      where:
        user.role === "ADMIN" || user.role === "SUPER_ADMIN"
          ? undefined
          : { buyerId: user.id },
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
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(transactions.map(serializeTransaction));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);
    if (user.role !== "USER") {
      return jsonError("Hanya user pembeli yang dapat checkout.", 403);
    }

    const body = transactionSchema.parse(await request.json());
    const transaction = await prisma.$transaction(async (tx) => {
      const bird = await tx.bird.findUnique({
        where: { id: body.birdId },
      });

      if (!bird || bird.status !== "AVAILABLE") {
        throw new Error("BIRD_UNAVAILABLE");
      }

      const created = await tx.transaction.create({
        data: {
          invoiceNo: createInvoiceNumber(),
          buyerId: user.id,
          birdId: bird.id,
          totalPrice: bird.price,
          note: body.note,
        },
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

      await tx.payment.create({
        data: {
          transactionId: created.id,
          userId: user.id,
          amount: bird.price,
          paymentType: "BANK",
          paymentLabel: "BCA Virtual Account",
          bankName: "BCA",
          accountName: "PT Murai Market Indonesia",
          accountNumber: "1234567890",
          status: "PENDING",
        },
      });

      await tx.bird.update({
        where: { id: bird.id },
        data: { status: "BOOKED" },
      });

      return tx.transaction.findUniqueOrThrow({
        where: { id: created.id },
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
    });

    return NextResponse.json(serializeTransaction(transaction), { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === "BIRD_UNAVAILABLE") {
      return jsonError("Burung tidak tersedia untuk dibeli.", 409);
    }
    return handleRouteError(error);
  }
}
