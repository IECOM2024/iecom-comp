import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  /**
   * Specify your server-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars.
   */
  server: {
    DATABASE_URL: z.string().url(),
    NODE_ENV: z.enum(["development", "test", "production"]),
    NEXTAUTH_SECRET:
      process.env.NODE_ENV === "production"
        ? z.string().min(1)
        : z.string().min(1).optional(),
    NEXTAUTH_URL: z.preprocess(
      // This makes Vercel deployments not fail if you don't set NEXTAUTH_URL
      // Since NextAuth.js automatically uses the VERCEL_URL if present.
      (str) => process.env.VERCEL_URL ?? str,
      // VERCEL_URL doesn't include `https` so it cant be validated as a URL
      process.env.VERCEL ? z.string().min(1) : z.string().url()
    ),
    // Add `.min(1) on ID and SECRET if you want to make sure they're not empty

    JWT_SECRET: z.string().min(1),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
    SESSION_COOKIE_DOMAIN: z.string(),
    SESSION_MAXAGE: z.number().int().positive(),
    GOOGLE_APPLICATION_CREDENTIALS: z.string().min(1),
    BUCKET_NAME: z.string().min(1),
    URL_EXPIRATION_TIME: z.preprocess(
      // If URL_EXPIRATION_TIME is not set, set it to 7 day
      (str) => (str ? +str : 60 * 60 * 24 * 7),
      // URL_EXPIRATION_TIME must be a positive integer
      z.number().int().positive().min(1)
    ),
    BUCKET_CORS_EXPIRATION_TIME: z.preprocess(
      // If BUCKET_CORS_EXPIRATION_TIME is not set, set it to 1 hour
      (str) => (str ? +str : 60 * 60),
      // BUCKET_CORS_EXPIRATION_TIME must be a positive integer
      z.number().int().positive().min(1)
    )
  },

  /**
   * Specify your client-side environment variables schema here. This way you can ensure the app
   * isn't built with invalid env vars. To expose them to the client, prefix them with
   * `NEXT_PUBLIC_`.
   */
  client: {
    // NEXT_PUBLIC_CLIENTVAR: z.string().min(1),
  },

  /**
   * You can't destruct `process.env` as a regular object in the Next.js edge runtimes (e.g.
   * middlewares) or client-side so we need to destruct manually.
   */
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    SESSION_COOKIE_DOMAIN: process.env.SESSION_COOKIE_DOMAIN ?? "localhost",
    SESSION_MAXAGE: parseInt(process.env.SESSION_MAXAGE ?? "7200"),
    GOOGLE_APPLICATION_CREDENTIALS: process.env.NODE_ENV === "production" ? process.env.PROD_GOOGLE_APPLICATION_CREDENTIALS : process.env.GOOGLE_APPLICATION_CREDENTIALS,
    BUCKET_NAME: process.env.BUCKET_NAME,
    URL_EXPIRATION_TIME: process.env.URL_EXPIRATION_TIME,
    BUCKET_CORS_EXPIRATION_TIME: process.env.BUCKET_CORS_EXPIRATION_TIME
  },
  /**
   * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
   * This is especially useful for Docker builds.
   */
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
