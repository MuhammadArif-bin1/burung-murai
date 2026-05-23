import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { createSessionToken, setSessionCookie } from "@/lib/auth";
import { handleRouteError, jsonError } from "@/lib/http";
import { prisma } from "@/lib/prisma";
import { publicUser } from "@/lib/serializers";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const body = loginSchema.parse(await request.json());
    const user = await prisma.user.findUnique({
      where: { email: body.email },
    });

    if (!user || !(await bcrypt.compare(body.password, user.password))) {
      return jsonError("Email atau password salah.", 401);
    }

    if (user.status !== "ACTIVE") {
      return jsonError("Akun sedang dinonaktifkan.", 403);
    }

    const response = NextResponse.json({ user: publicUser(user) });
    setSessionCookie(response, createSessionToken(user));
    return response;
  } catch (error) {
    return handleRouteError(error);
  }
}
