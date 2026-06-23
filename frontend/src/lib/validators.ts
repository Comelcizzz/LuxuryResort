import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Невірний формат email"),
  password: z.string().min(1, "Введіть пароль"),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, "Введіть імʼя").max(100),
  lastName: z.string().min(1, "Введіть прізвище").max(100),
  email: z.string().email("Невірний формат email"),
  phone: z.string().max(20).optional().or(z.literal("")),
  password: z.string().min(8, "Пароль має містити щонайменше 8 символів").max(100),
});

export const wizardDatesSchema = z
  .object({
    checkIn: z.string().min(1),
    checkOut: z.string().min(1),
  })
  .refine(
    (d) => {
      const a = new Date(d.checkIn);
      const b = new Date(d.checkOut);
      return b > a;
    },
    { message: "Дата виїзду має бути після заїзду", path: ["checkOut"] }
  );

export const wizardDetailsSchema = z.object({
  guests: z.coerce.number().int().min(1).max(20),
  specialRequests: z.string().max(2000).optional().or(z.literal("")),
});

export const wizardPaymentSchema = z.object({
  paymentMethod: z.enum(["CARD", "APPLE_PAY", "GOOGLE_PAY", "BANK_TRANSFER"]),
});
