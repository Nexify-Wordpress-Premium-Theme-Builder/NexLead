"use client";

import Link from "next/link";
import { useActionState } from "react";

import { Button } from "@/components/ui/button";
import { IconLock, IconMail, IconUser } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { registerAction, type AuthActionState } from "@/lib/auth/actions";

const initialState: AuthActionState = {};

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, initialState);

  return (
    <form className="auth-stagger space-y-5" action={formAction}>
      <Input
        name="fullName"
        type="text"
        label="Ad Soyad"
        autoComplete="name"
        placeholder="Adınız Soyadınız"
        icon={<IconUser className="h-[18px] w-[18px]" />}
        required
      />

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
        autoComplete="new-password"
        placeholder="En az 8 karakter"
        icon={<IconLock className="h-[18px] w-[18px]" />}
        minLength={8}
        required
      />

      {state.error ? (
        <p className="rounded-lg border border-error/20 bg-error/5 px-3 py-2 text-sm text-error">
          {state.error}
        </p>
      ) : null}

      {state.success ? (
        <p className="rounded-lg border border-success/20 bg-success/5 px-3 py-2 text-sm text-success">
          {state.success}
        </p>
      ) : null}

      <Button type="submit" className="w-full" loading={pending}>
        Hesap Oluştur
      </Button>

      <p className="text-center text-sm text-text-secondary">
        Zaten hesabınız var mı?{" "}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Giriş yapın
        </Link>
      </p>
    </form>
  );
}
