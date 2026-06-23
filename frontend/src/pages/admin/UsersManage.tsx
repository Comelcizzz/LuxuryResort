import { updateUserRole } from "@/api/endpoints/admin.api";
import { PaginationBar } from "@/components/common/PaginationBar";
import { PageTransition } from "@/components/common/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAdminUsers } from "@/hooks/useAdmin";
import { userRoleLabelUk } from "@/lib/labels";
import { useListQuery } from "@/lib/listQuery";
import { canChangeRoles } from "@/lib/roles";
import { useAuthStore } from "@/store/authStore";
import { UserRole } from "@/types/domain";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

const roles = [UserRole.ADMIN, UserRole.MANAGER, UserRole.RECEPTIONIST, UserRole.GUEST] as const;

export function UsersManage() {
  const me = useAuthStore((s) => s.user);
  const { query, patch } = useListQuery({ sort: "createdAt,desc", size: 6 });
  const [roleFilter, setRoleFilter] = useState("");
  const { data } = useAdminUsers({
    page: query.page,
    size: query.size,
    sort: query.sort,
    q: query.q || undefined,
    role: (roleFilter || undefined) as UserRole | undefined,
  });
  const qc = useQueryClient();
  const [pending, setPending] = useState<Partial<Record<string, (typeof roles)[number]>>>({});

  const mut = useMutation({
    mutationFn: ({ id, role }: { id: string; role: (typeof roles)[number] }) => updateUserRole(id, role),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  const canRole = canChangeRoles(me?.role);

  return (
    <PageTransition>
      <h1 className="font-display text-3xl font-bold">Користувачі</h1>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        <Input value={query.q} onChange={(e) => patch({ q: e.target.value, page: 0 })} placeholder="Пошук: email/ім'я" />
        <select className="rounded border border-navy/20 px-2 py-2" value={roleFilter} onChange={(e) => { setRoleFilter(e.target.value); patch({ page: 0 }); }}>
          <option value="">Усі ролі</option>
          {roles.map((r) => <option key={r} value={r}>{userRoleLabelUk(r)}</option>)}
        </select>
      </div>
      {!canRole && (
        <p className="mt-4 text-sm text-slate-custom">Зміна ролей доступна лише адміністратору.</p>
      )}
      {data && (
        <>
        <div className="mt-8 overflow-x-auto rounded-xl border border-navy/10 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="bg-navy text-cream">
              <tr>
                <th className="p-3">Електронна пошта</th>
                <th className="p-3">Імʼя</th>
                <th className="p-3">Роль</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {data.content.map((u) => (
                <tr key={u.id} className="border-t border-navy/10">
                  <td className="p-3">{u.email}</td>
                  <td className="p-3">
                    {u.firstName} {u.lastName}
                  </td>
                  <td className="p-3">
                    <select
                      className="rounded border border-navy/20 px-2 py-1"
                      disabled={!canRole}
                      value={pending[u.id] ?? u.role}
                      onChange={(e) =>
                        setPending((p) => ({
                          ...p,
                          [u.id]: e.target.value as (typeof roles)[number],
                        }))
                      }
                    >
                      {roles.map((r) => (
                        <option key={r} value={r}>
                          {userRoleLabelUk(r)}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="p-3">
                    {canRole && (
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                        disabled={mut.isPending || (pending[u.id] ?? u.role) === u.role}
                        onClick={() => {
                          const role = pending[u.id] ?? u.role;
                          mut.mutate({ id: u.id, role });
                        }}
                      >
                        Зберегти
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <PaginationBar page={query.page} totalPages={data.totalPages} onPageChange={(p) => patch({ page: p })} />
        </>
      )}
    </PageTransition>
  );
}
