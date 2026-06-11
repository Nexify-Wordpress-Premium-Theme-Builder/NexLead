import { Suspense } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm } from "@/components/auth/login-form";

function LoginFormFallback() {
  return <div className="h-40 animate-pulse rounded-lg bg-surface-soft" />;
}

export default function LoginPage() {
  return (
    <AuthShell
      title="Tekrar hoş geldiniz"
      subtitle="Hesabınıza giriş yaparak çalışma alanınıza devam edin."
    >
      <Suspense fallback={<LoginFormFallback />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}
