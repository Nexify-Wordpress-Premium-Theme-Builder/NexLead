"use server";

import { redirect } from "next/navigation";

import { ensureServerBootstrap } from "./bootstrap-server";
import { mapAuthErrorMessage } from "./errors";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export type AuthActionState = {
  error?: string;
  success?: string;
};

function isNextRedirect(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string" &&
    (error as { digest: string }).digest.startsWith("NEXT_REDIRECT")
  );
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const fullName = String(formData.get("fullName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!fullName || !email || !password) {
    return { error: "Lütfen tüm alanları doldurun." };
  }

  if (password.length < 8) {
    return { error: "Şifre en az 8 karakter olmalıdır." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/auth/callback?next=/dashboard`,
      },
    });

    if (error) {
      return { error: mapAuthErrorMessage(error.message) };
    }

    if (!data.user) {
      return { error: "Kayıt işlemi tamamlanamadı. Lütfen tekrar deneyin." };
    }

    const identities = data.user.identities ?? [];
    if (identities.length === 0) {
      return {
        error: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.",
      };
    }

    if (data.session) {
      await ensureServerBootstrap(data.user.id);
      redirect("/dashboard");
    }

    return {
      success:
        "Kayıt başarılı. E-posta doğrulama bağlantısı gönderildi. Onayladıktan sonra giriş yapabilirsiniz.",
    };
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return { error: mapAuthErrorMessage(message) };
  }
}

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = String(formData.get("redirectTo") ?? "/dashboard").trim() || "/dashboard";

  if (!email || !password) {
    return { error: "Lütfen e-posta ve şifre girin." };
  }

  try {
    const supabase = await createServerSupabaseClient();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return { error: mapAuthErrorMessage(error.message) };
    }

    if (!data.user) {
      return { error: "Giriş işlemi tamamlanamadı. Lütfen tekrar deneyin." };
    }

    await ensureServerBootstrap(data.user.id);
    redirect(redirectTo.startsWith("/") ? redirectTo : "/dashboard");
  } catch (error) {
    if (isNextRedirect(error)) {
      throw error;
    }

    const message = error instanceof Error ? error.message : "Bilinmeyen hata";
    return { error: mapAuthErrorMessage(message) };
  }
}

export async function logoutAction(): Promise<void> {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  redirect("/login");
}
