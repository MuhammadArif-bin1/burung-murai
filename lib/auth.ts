import { type NextRequest, type NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import type { Role, User } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const SESSION_COOKIE = "murai_session";

type SessionPayload = {
  sub: string;
  role: Role;
};

const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  phone: true,
  avatar: true,
  address: true,
  city: true,
  role: true,
  status: true,
  createdAt: true,
  updatedAt: true,
} satisfies Record<Exclude<keyof User, "password">, true>;

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET belum dikonfigurasi.");
  }
  return secret;
}

export function createSessionToken(user: Pick<User, "id" | "role">) {
  return jwt.sign(
    {
      sub: user.id,
      role: user.role,
    },
    getJwtSecret(),
    { expiresIn: "7d" },
  );
}

export function setSessionCookie(response: NextResponse, token: string) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function clearSessionCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE,
    value: "",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 0,
  });
}

export async function getCurrentUser(request: NextRequest) {
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  try {
    const payload = jwt.verify(token, getJwtSecret()) as SessionPayload;
    return prisma.user.findUnique({
      where: { id: payload.sub },
      select: publicUserSelect,
    });
  } catch {
    return null;
  }
}

export async function requireUser(request: NextRequest) {
  return getCurrentUser(request);
}

export async function requireRole(request: NextRequest, roles: Role[]) {
  const user = await getCurrentUser(request);
  if (!user || !roles.includes(user.role)) {
    return null;
  }
  return user;
}
