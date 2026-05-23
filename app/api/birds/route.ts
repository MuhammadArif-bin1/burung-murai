import { Prisma } from "@prisma/client";
import { type NextRequest, NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { serializeBird } from "@/lib/serializers";
import { slugify } from "@/lib/utils";
import { birdSchema } from "@/lib/validations";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const where: Prisma.BirdWhereInput = {};
    const search = searchParams.get("search");
    const city = searchParams.get("city");
    const category = searchParams.get("category");
    const condition = searchParams.get("condition");
    const gender = searchParams.get("gender");
    const status = searchParams.get("status");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    if (search) where.name = { contains: search, mode: "insensitive" };
    if (city) where.city = { contains: city, mode: "insensitive" };
    if (condition) where.condition = { contains: condition, mode: "insensitive" };
    if (category) where.category = { slug: category };
    if (gender) where.gender = gender as Prisma.EnumBirdGenderFilter["equals"];
    if (status) where.status = status as Prisma.EnumBirdStatusFilter["equals"];
    if (minPrice || maxPrice) {
      where.price = {
        ...(minPrice ? { gte: Number(minPrice) } : {}),
        ...(maxPrice ? { lte: Number(maxPrice) } : {}),
      };
    }

    const birds = await prisma.bird.findMany({
      where,
      include: {
        category: true,
        images: true,
      },
      orderBy:
        sort === "lowest"
          ? { price: "asc" }
          : sort === "highest"
            ? { price: "desc" }
            : { createdAt: "desc" },
    });

    return NextResponse.json(birds.map(serializeBird));
  } catch (error) {
    return handleRouteError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole(request, ["ADMIN", "SUPER_ADMIN"]);
    if (!user) return jsonError("Akses ditolak.", 403);

    const body = birdSchema.parse(await request.json());
    const slug = slugify(body.name);

    const bird = await prisma.bird.create({
      data: {
        ...body,
        slug,
        images: {
          create: body.images.map((imageUrl, index) => ({
            imageUrl,
            isPrimary: index === 0,
          })),
        },
      },
      include: {
        category: true,
        images: true,
      },
    });

    return NextResponse.json(serializeBird(bird), { status: 201 });
  } catch (error) {
    return handleRouteError(error);
  }
}
