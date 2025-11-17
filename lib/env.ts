import { z } from "zod";

const serverSchema = z.object({
  BASE_DOMAIN: z.string().default("localhost"),
  MAIN_SUBDOMAIN: z.string().default("toolcenter"),
});

const clientSchema = z.object({
  NEXT_PUBLIC_BASE_DOMAIN: z.string().optional(),
});

export const serverEnv = serverSchema.parse({
  BASE_DOMAIN: process.env.BASE_DOMAIN,
  MAIN_SUBDOMAIN: process.env.MAIN_SUBDOMAIN,
});

export const clientEnv = clientSchema.parse({
  NEXT_PUBLIC_BASE_DOMAIN: process.env.NEXT_PUBLIC_BASE_DOMAIN,
});
