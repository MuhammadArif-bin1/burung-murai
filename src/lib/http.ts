import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ message }, { status });
}

export function handleRouteError(error: unknown) {
  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        message: "Data tidak valid.",
        issues: error.flatten(),
      },
      { status: 400 },
    );
  }

  console.error(error);
  return NextResponse.json(
    { message: "Terjadi kesalahan pada server." },
    { status: 500 },
  );
}
