import { Prisma, type BirdStatus, type BirdGender } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeBird } from "@/lib/serializers";
import { slugify } from "@/lib/utils";
import { birdPatchSchema } from "@/lib/validations";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const bird = await prisma.bird.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
      },
    });

    if (!bird) return jsonError("Burung tidak ditemukan.", 404);
    return NextResponse.json(serializeBird(bird));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const { id } = await params;
    const body = birdPatchSchema.parse(await request.json());
    const data: Prisma.BirdUpdateInput = {};

    if (body.categoryId) {
      data.category = { connect: { id: body.categoryId } };
    }
    if (body.name) {
      data.name = body.name;
      data.slug = slugify(body.name);
    }
    if (body.description !== undefined) data.description = body.description;
    if (body.price !== undefined) data.price = body.price;
    if (body.location !== undefined) data.location = body.location;
    if (body.city !== undefined) data.city = body.city;
    if (body.age !== undefined) data.age = body.age;
    if (body.gender !== undefined) data.gender = body.gender as BirdGender;
    if (body.condition !== undefined) data.condition = body.condition;
    if (body.status !== undefined) data.status = body.status as BirdStatus;
    if (body.isFeatured !== undefined) data.isFeatured = body.isFeatured;
    if (body.images) {
      data.images = {
        deleteMany: {},
        create: body.images.map((imageUrl, index) => ({
          imageUrl,
          isPrimary: index === 0,
        })),
      };
    }

    const bird = await prisma.bird.update({
      where: { id },
      data,
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(serializeBird(bird));
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
    await prisma.bird.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return handleRouteError(error);
  }
}
