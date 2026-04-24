import { z } from "zod";

export const respondentSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  workEmail: z.string().email("Invalid work email"),
  companyName: z.string().min(1, "Company name is required"),
  jobTitle: z.string().min(1, "Job title is required"),
  industry: z.string().min(1, "Industry is required"),
  employeeCountBand: z.string().min(1, "Employee count is required"),
  phoneCountryCode: z.string().optional(),
  phone: z.string().optional(),
  mainChallenge: z.string().optional(),
  consent: z.boolean().refine((value) => value, {
    message: "You must consent to receive the report",
  }),
  honeypot: z.string().max(0, "Spam detected").optional(),
});

export type RespondentFormData = z.infer<typeof respondentSchema>;
