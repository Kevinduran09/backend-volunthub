import { jwtVerify, createRemoteJWKSet } from "jose";

const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);

export function verifySupabaseToken(token) {
  try {
    const { payload } = jwtVerify(token, secret);
    console.log(payload);

    return payload;
  } catch (error) {
    console.error("Token invalido", error);
    return null;
  }
}
