import { type NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { favoriteSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const favorites = await prisma.favorite.findMany({
      where: { userId: user.id },
      include: {
        bird: {
          include: {
            category: true,
            images: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(favorites);
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireUser(request);
    if (!user) return jsonError("Harus login terlebih dahulu.", 401);

    const body = favoriteSchema.parse(await request.json());
    const favorite = await prisma.favorite.create({
      data: {
        userId: user.id,
        birdId: body.birdId,
      },
    });

    return NextResponse.json(favorite, { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
