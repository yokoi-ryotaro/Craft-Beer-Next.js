// lib/auth.tsx
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.SESSION_SECRET || "secret");
const cookieName = "session_token";

export async function setSessionCookie(res: Response, userId: number) {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("7d")
    .sign(secret);

  (res as any).cookies.set(cookieName, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7日
  });
}

export async function getCurrentUser() {
  const cookieStore = cookies();
  const token = (await cookieStore).get(cookieName)?.value;
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secret);
    return { id: payload.userId as number };
  } catch (e) {
    return null;
  }
}

export function clearSessionCookie(res: Response) {
  (res as any).cookies.set(cookieName, "", { httpOnly: true, path: "/", maxAge: 0 });
}