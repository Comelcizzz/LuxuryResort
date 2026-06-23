import { register as apiRegister } from "@/api/endpoints/auth.api";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { translateApiMessage } from "@/lib/apiMessages";
import { registerSchema } from "@/lib/validators";
import { useAuthStore } from "@/store/authStore";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

type Form = z.infer<typeof registerSchema>;

export function Register() {
  const navigate = useNavigate();
  const setFromAuthResponse = useAuthStore((s) => s.setFromAuthResponse);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError: setFormError,
  } = useForm<Form>({ resolver: zodResolver(registerSchema) });

  async function onSubmit(values: Form) {
    try {
      const auth = await apiRegister({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone || undefined,
        password: values.password,
      });
      setFromAuthResponse(auth);
      navigate("/", { replace: true });
    } catch (e) {
      const msg = translateApiMessage(e instanceof Error ? e.message : null);
      setFormError("root", {
        message: msg ?? "Помилка реєстрації. Спробуйте ще раз.",
      });
    }
  }

  return (
    <PageTransition>
      <div className="mx-auto max-w-md rounded-2xl border border-navy/10 bg-white p-8 shadow-lg">
        <h1 className="font-display text-2xl font-bold">Реєстрація</h1>
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="fn">Імʼя</Label>
              <Input id="fn" {...register("firstName")} />
              {errors.firstName && <p className="text-xs text-error">{errors.firstName.message}</p>}
            </div>
            <div>
              <Label htmlFor="ln">Прізвище</Label>
              <Input id="ln" {...register("lastName")} />
              {errors.lastName && <p className="text-xs text-error">{errors.lastName.message}</p>}
            </div>
          </div>
          <div>
            <Label htmlFor="email">Електронна пошта</Label>
            <Input id="email" type="email" {...register("email")} />
            {errors.email && <p className="text-xs text-error">{errors.email.message}</p>}
          </div>
          <div>
            <Label htmlFor="phone">Телефон (необовʼязково)</Label>
            <Input id="phone" {...register("phone")} />
          </div>
          <div>
            <Label htmlFor="pw">Пароль (мін. 8 символів)</Label>
            <PasswordInput id="pw" autoComplete="new-password" {...register("password")} />
            {errors.password && <p className="text-xs text-error">{errors.password.message}</p>}
          </div>
          {errors.root && <p className="text-sm text-error">{errors.root.message}</p>}
          <Button variant="gold" className="w-full" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "…" : "Створити акаунт"}
          </Button>
        </form>
        <p className="mt-4 text-center text-sm text-slate-custom">
          Вже є акаунт?{" "}
          <Link className="text-gold underline" to="/login">
            Увійти
          </Link>
        </p>
      </div>
    </PageTransition>
  );
}
