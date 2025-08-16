# Partner-Only JWT Auth + JWKS (Reference)

This doc is a quick reference for when we need **partner-only** (third-party) access to our APIs using **JWTs** verified via **JWKS**.  
Our **own app** (same origin, browser) continues to use **sessions** (cookies + `getSession()`), so nothing changes there.

---

## When to use what

- **Browser → our API (same origin)**: use **sessions** (existing `withAuth` middleware).
- **Partner / microservice → our API**: use **JWT** in `Authorization: Bearer <token>`  
  and **verify via JWKS** using the `verifyPartnerJWT` middleware below.

---

## Prereqs (server)

- Better-auth configured with:
  - `nextCookies()` (sessions for web)
  - `jwt()` (for issuing/verifying JWTs for partners)
- JWKS automatically exposed at:
    - GET /api/auth/jwks


- Optional token mint endpoint:
    - GET /api/auth/token

- **Important**: keep `BETTER_AUTH_SECRET` identical across all runtimes connecting to the same DB.  
- Force the auth route to run on Node (avoid Edge env secret drift):
```ts



- **Minimal mental model 
    - Our server signs JWTs with a private key; public keys live in ba_jwks and are served at /api/auth/jwks.
    - Partners call our API with Authorization: Bearer <token>.
    - The verifyPartnerJWT middleware verifies the token using the public key from JWKS (no DB hit).
    - We keep sessions for all browser traffic.