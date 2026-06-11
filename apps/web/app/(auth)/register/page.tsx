import { AuthShell } from "@/components/auth/auth-shell";
import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Hesap oluşturun"
      subtitle="NexLead ile müşteri bulma ve web denetim süreçlerinizi profesyonel şekilde yönetmeye başlayın."
      footer={
        <p>
          Kayıt olarak{" "}
          <span className="text-text-primary">Kullanım Koşulları</span> ve{" "}
          <span className="text-text-primary">Gizlilik Politikası</span>
          &apos;nı kabul etmiş olursunuz.
        </p>
      }
    >
      <RegisterForm />
    </AuthShell>
  );
}
