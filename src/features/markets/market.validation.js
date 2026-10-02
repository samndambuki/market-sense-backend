import { z } from "zod";

export const marketSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  category: z.string().trim().min(1, "Category is required"),
  region: z.string().trim().min(1, "Region is required"),
  growthRate: z.coerce.number().finite(),
  description: z.string().trim().min(1, "Description is required"),
  marketSize: z.string().trim().min(1, "Market size is required"),
  riskLevel: z.enum(["LOW", "MEDIUM", "HIGH"]),
});
