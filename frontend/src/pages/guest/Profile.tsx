import { updateProfile } from "@/api/endpoints/auth.api";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { userRoleLabelUk } from "@/lib/labels";
import { useAuthStore } from "@/store/authStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

export function Profile() {
  const user = useAuthStore((s) => s.user);
  const qc = useQueryClient();
  const [firstName, setFirstName] = useState(user?.firstName ?? "");
  const [lastName, setLastName] = useState(user?.lastName ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [msg, setMsg] = useState<string | null>(null);

  const mut = useMutation({
    mutationFn: () => updateProfile({ firstName, lastName, phone: phone || null }),
    onSuccess: (u) => {
      useAuthStore.setState({ user: u });
      setMsg("Збережено");
      void qc.invalidateQueries();
    },
    onError: (e: Error) => setMsg(e.message),
  });

  if (!user) return null;

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold">Профіль</h1>
      <div className="mx-auto mt-8 max-w-md space-y-4 rounded-xl border border-navy/10 bg-white p-6 shadow-sm">
        <div>
          <Label>Імʼя</Label>
          <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div>
          <Label>Прізвище</Label>
          <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
        <div>
          <Label>Телефон</Label>
          <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
        </div>
        <p className="text-xs text-slate-custom">
          Електронна пошта: {user.email}
        </p>
        <p className="text-xs text-slate-custom">
          Роль: {userRoleLabelUk(user.role)}
        </p>
        {msg && <p className="text-sm text-success">{msg}</p>}
        <Button variant="gold" type="button" disabled={mut.isPending} onClick={() => mut.mutate()}>
          {mut.isPending ? "…" : "Зберегти"}
        </Button>
      </div>
    </PageTransition>
  );
}
