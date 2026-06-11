"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { IconLock, IconMail } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { loginAction, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function LoginForm() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form className="auth-stagger space-y-5" action={formAction}>
      <input type="hidden" name="redirectTo" value={redirectTo} />

      <Input
        name="email"
        type="email"
        label="E-posta"
        autoComplete="email"
        placeholder="ornek@sirket.com"
        icon={<IconMail className="h-[18px] w-[18px]" />}
        required
      />

      <Input
        name="password"
        type="password"
        label="Şifre"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<IconLock className="h-[18px] w-[18px]" />}
        required
      />

      {state.error ? (
        <p className="rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" loading={pending}>
        Giriş Yap
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Hesabınız yok mu?{" "}
        <Link href="/register" className="font-medium text-accent hover:underline">
          Kayıt olun
        </Link>
      </p>
    </form>
  );
}
