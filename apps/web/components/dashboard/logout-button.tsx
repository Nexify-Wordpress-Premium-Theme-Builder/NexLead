"use client";

import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { IconLogout } from "@/components/ui/icons";
import { logoutAction } from "@/lib/auth/actions";

type LogoutButtonProps = {
  compact?: boolean;
};

export function LogoutButton({ compact = false }: LogoutButtonProps) {
  const [pending, startTransition] = useTransition();

  function handleLogout() {
    startTransition(async () => {
      await logoutAction();
    });
  }

  return (
    <Button
      variant={compact ? "ghost" : "secondary"}
      size="sm"
      onClick={handleLogout}
      loading={pending}
      className={compact ? "w-full justify-start" : ""}
    >
      <IconLogout className="h-4 w-4" />
      Çıkış Yap
    </Button>
  );
}
