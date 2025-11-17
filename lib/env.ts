import { z } from "zod";

const serverSchema = z.object({
  BASE_DOMAIN: z.string().min(1, "BASE_DOMAIN is required"),
  MAIN_SUBDOMAIN: z.string().min(1, "MAIN_SUBDOMAIN is required"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_BASE_URL: z.string().url({ message: "NEXT_PUBLIC_BASE_URL must be a valid URL" }),
});

const baseDomain =
  process.env.BASE_DOMAIN ?? (process.env.NODE_ENV === "development" ? "localhost" : undefined);
const mainSubdomain =
  process.env.MAIN_SUBDOMAIN ??
  (process.env.NODE_ENV === "development" ? "toolcenter" : undefined);

export const serverEnv = serverSchema.parse({
  BASE_DOMAIN: baseDomain,
  MAIN_SUBDOMAIN: mainSubdomain,
});

const publicBaseUrl =
  process.env.NEXT_PUBLIC_BASE_URL ??
  (process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined);

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_BASE_URL: publicBaseUrl,
});
