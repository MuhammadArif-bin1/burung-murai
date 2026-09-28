import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/serializers";
import { registerSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = registerSchema.parse(await request.json());
    const existingUser = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (existingUser) {
      return jsonError("Email sudah digunakan.", 409);
    }

    const user = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        password: await bcrypt.hash(body.password, 10),
      },
    });

    const response = NextResponse.json(
      { user: publicUser(user) },
      { status: 201 },
    );
    setSessionCookie(response, createSessionToken(user));
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
