import { z } from "zod";

export const emailSchema = z
  .string()
  .trim()
  .email("Please enter a valid email address.");

export const passwordSchema = z
  .string()
  .min(6, "Password must be at least 6 characters long.");

export const otpSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, "Please enter a valid 6-digit verification code.");

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const signupEmailSchema = z.object({
  email: emailSchema,
});

export const signupVerificationSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export const verifyOtpSchema = z.object({
  email: emailSchema,
  otp: otpSchema,
});

export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    otp: otpSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

export const authUserSchema = z
  .object({
    email: emailSchema,
  })
  .passthrough();

export const getFirstZodErrorMessage = (error, fallback) =>
  error?.issues?.[0]?.message || fallback;
