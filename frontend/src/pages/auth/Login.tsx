import { login } from "@/api/endpoints/auth.api";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { translateApiMessage } from "@/lib/apiMessages";
import { loginSchema } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { z } from "zod";

type Form = z.infer<typeof loginSchema>;

const DEMO_PASSWORD = "Passw0rd!";

const DEMO_ACCOUNTS = [
  { label: "Гість", email: "guest.showcase@luxuryresort.local", hint: "бронювання та послуги" },
  { label: "Ресепшн", email: "reception.showcase@luxuryresort.local", hint: "замовлення послуг" },
  { label: "Менеджер", email: "manager.showcase@luxuryresort.local", hint: "модерація та керування" },
  { label: "Адмін", email: "admin.showcase@luxuryresort.local", hint: "повний доступ" },
];

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const setFromAuthResponse = useAuthStore((s) => s.setFromAuthResponse);
  const from = (location.state as { from?: string } | null)?.from ?? "/";
  const [quickLoginEmail, setQuickLoginEmail] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
    setValue,
  } = useForm<Form>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: Form) {
    try {
      const auth = await login(values.email, values.password);
      setFromAuthResponse(auth);
      navigate(from, { replace: true });
    } catch (e) {
      const msg = translateApiMessage(e instanceof Error ? e.message : null);
      setFormError("root", {
        message: msg ?? "Невірний email або пароль",
      });
    }
  }

  async function onQuickLogin(email: string) {
    setQuickLoginEmail(email);
    setValue("email", email, { shouldValidate: true });
    setValue("password", DEMO_PASSWORD, { shouldValidate: true });
    await onSubmit({ email, password: DEMO_PASSWORD });
    setQuickLoginEmail(null);
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-8 shadow-lg">
        <h1 className="font-display text-2xl font-bold">Вхід</h1>
        <div className="mt-5 rounded-xl border border-gold/20 bg-gold/10 p-4">
          <p className="text-sm font-semibold text-navy">Швидкий демо-вхід</p>
          <p className="mt-1 text-xs text-slate-custom">Оберіть роль, і система увійде автоматично.</p>
          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {DEMO_ACCOUNTS.map((account) => (
              <Button
                key={account.email}
                type="button"
                variant="outline"
                className="h-auto flex-col items-start gap-0 px-3 py-2 text-left"
                disabled={isSubmitting || quickLoginEmail !== null}
                onClick={() => void onQuickLogin(account.email)}
              >
                <span>{quickLoginEmail === account.email ? "Входимо…" : account.label}</span>
                <span className="text-xs font-normal text-slate-custom">{account.hint}</span>
              </Button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-custom">Пароль для всіх демо-акаунтів: {DEMO_PASSWORD}</p>
        </div>
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div>
            <Label htmlFor="email">Електронна пошта</Label>
            <Input id="email" type="email" autoComplete="email" {...register("email")} />
            {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="password">Пароль</Label>
            <PasswordInput id="password" autoComplete="current-password" {...register("password")} />
            {errors.password && <p className="mt-1 text-xs text-error">{errors.password.message}</p>}
          </div>
          {errors.root && <p className="text-sm text-error">{errors.root.message}</p>}
          <Button variant="gold" className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "…" : "Увійти"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-custom">
          Немає акаунту?{" "}
          <Link className="text-gold underline" to="/register">
            Реєстрація
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
