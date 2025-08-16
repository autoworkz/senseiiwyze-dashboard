import { createRemoteJWKSet, jwtVerify, JWTPayload } from "jose";

function getJwksUrl(req: Request) {
  const base = process.env.NEXT_PUBLIC_BASE_URL;
  if (base) return new URL("/api/auth/jwks", base);
  const url = new URL(req.url);
  return new URL("/api/auth/jwks", `${url.protocol}//${url.host}`);
}

const jwksCache = new Map<string, ReturnType<typeof createRemoteJWKSet>>();

function getRemoteJWKS(jwksUrl: URL) {
  const key = jwksUrl.toString();
  let remote = jwksCache.get(key);
  if (!remote) {
    remote = createRemoteJWKSet(jwksUrl);
    jwksCache.set(key, remote);
  }
  return remote;
}

export type PartnerClaims = JWTPayload & {
  scope?: string | string[];
  aud?: string | string[];
};

export async function verifyPartnerJWT(req: Request): Promise<PartnerClaims> {
  const auth = req.headers.get("authorization") || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";

  if (!token) {
    throw Object.assign(new Error("Missing bearer token"), { status: 401 });
  }

  const jwksUrl = getJwksUrl(req);
  const JWKS = getRemoteJWKS(jwksUrl);

  const { payload } = await jwtVerify(token, JWKS, {});
  return payload as PartnerClaims;
}

export function withPartnerJWT<
  H extends (req: Request, claims: PartnerClaims) => Promise<Response>
>(handler: H) {
  return async (req: Request): Promise<Response> => {
    try {
      const claims = await verifyPartnerJWT(req);
      return handler(req, claims);
    } catch (err: any) {
      const status = typeof err?.status === "number" ? err.status : 401;
      return new Response("Unauthorized", { status });
    }
  };
}
