import { z } from "zod";

export const updateSystemStateSchema = z.object({
  state: z.enum(["ACTIVE", "MAINTENANCE", "READ_ONLY", "EMERGENCY", "COMING_SOON"], {
    errorMap: () => ({ message: "Invalid system state mapping provided." })
  }),
  title: z.string().trim().max(150).optional().nullable(),
  description: z.string().trim().max(1000).optional().nullable(),
  estimatedCompletion: z.string().datetime({ message: "ETA must be a valid ISO-8601 datetime string." }).optional().nullable(),
  supportEmail: z.string().email("Invalid support email architecture.").optional().nullable(),
  supportPhone: z.string().max(25).optional().nullable(),
  showSocialLinks: z.boolean().default(true),
  allowSearchEngine: z.boolean().default(true),
  reason: z.string().trim().min(5, "A valid administrative reason is required for audit logs.").max(500),
  version: z.number().int().min(1, "Version matrix tracking integer is required for concurrency safety."),
  bypassToken: z.string().trim().max(64).optional().nullable()
}).strict();