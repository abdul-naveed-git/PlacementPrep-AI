const { z } = require("../utils/zod");

const emailSchema = z.string().trim().email("Please enter a valid email address.");
const passwordSchema = z.string().min(6, "Password must be at least 6 characters long.");
const otpSchema = z.string().trim().regex(/^\d{6}$/, "Please enter a valid 6-digit verification code.");

const authRequestSchemas = {
  register: z.object({
    email: emailSchema,
  }),
  verify: z.object({
    email: emailSchema,
    otp: otpSchema,
    password: passwordSchema,
  }),
  login: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
  forgotPassword: z.object({
    email: emailSchema,
  }),
  verifyResetOtp: z.object({
    email: emailSchema,
    otp: otpSchema,
  }),
  resetPassword: z.object({
    email: emailSchema,
    password: passwordSchema,
  }),
};

const profileSchema = z.object({
  leetcodeUsername: z.string().trim().optional().or(z.literal("")),
  targetCompanies: z.array(z.string().trim().min(1)).optional(),
  targetRole: z.string().trim().optional().or(z.literal("")),
  weakTopics: z.array(z.string().trim().min(1)).optional(),
  fullName: z.string().trim().optional().or(z.literal("")),
  academicYear: z.string().trim().optional().or(z.literal("")),
  department: z.string().trim().optional().or(z.literal("")),
});

const experienceSchema = z.object({
  company: z.string().trim().min(1, "Company is required."),
  role: z.string().trim().min(1, "Role is required."),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  title: z.string().trim().min(1, "Title is required."),
  content: z.string().trim().min(1, "Experience details are required."),
});

const commentSchema = z.object({
  author: z.string().trim().min(1, "Comment author is required."),
  text: z.string().trim().min(1, "Comment text is required."),
});

const summarizeCommentsSchema = z.object({
  title: z.string().trim().optional().or(z.literal("")),
  comments: z.array(commentSchema).min(1, "At least one comment is required."),
});

const summarizeGroupSchema = z.object({
  experiences: z
    .array(
      z.object({
        id: z.string().optional(),
        company: z.string().trim().min(1, "Company is required."),
        title: z.string().trim().optional().or(z.literal("")),
        role: z.string().trim().optional().or(z.literal("")),
        description: z.string().trim().optional().or(z.literal("")),
        difficulty: z.string().trim().optional().or(z.literal("")),
      }),
    )
    .min(1, "At least one experience is required."),
});

const summarizeCompanySchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required."),
});

module.exports = {
  authRequestSchemas,
  profileSchema,
  experienceSchema,
  summarizeCommentsSchema,
  summarizeGroupSchema,
  summarizeCompanySchema,
};
