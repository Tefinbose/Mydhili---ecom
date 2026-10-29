
import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "mydhili_admin_session";
const SESSION_DURATION = 60 * 60 * 8; // 8 hours

interface AdminSession {
  email: string;
  expiresAt: number;
}

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET must be set to at least 32 characters."
    );
  }

  return secret;
}

function sign(value: string): string {
  return createHmac("sha256", getSessionSecret())
    .update(value)
    .digest("base64url");
}

export function createAdminSessionToken(email: string): string {
  const payload: AdminSession = {
    email: email.toLowerCase(),
    expiresAt: Math.floor(Date.now() / 1000) + SESSION_DURATION,
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url"
  );

  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  try {
    const parts = token.split(".");

    if (parts.length !== 2) {
      return null;
    }

    const [encodedPayload, suppliedSignature] = parts;
    const expectedSignature = sign(encodedPayload);

    const supplied = Buffer.from(suppliedSignature, "base64url");
    const expected = Buffer.from(expectedSignature, "base64url");

    if (
      supplied.length !== expected.length ||
      !timingSafeEqual(supplied, expected)
    ) {
      return null;
    }

    const payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8")
    ) as AdminSession;

    if (
      typeof payload.email !== "string" ||
      !payload.email ||
      typeof payload.expiresAt !== "number" ||
      payload.expiresAt <= Math.floor(Date.now() / 1000)
    ) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function setAdminSession(email: string): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, createAdminSessionToken(email), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: SESSION_DURATION,
  });
}

export async function clearAdminSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}
