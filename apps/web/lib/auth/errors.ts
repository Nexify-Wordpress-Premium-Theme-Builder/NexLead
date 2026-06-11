const ERROR_MESSAGES: Record<string, string> = {
  over_email_send_rate_limit:
    "Çok fazla deneme yapıldı. Lütfen birkaç saniye bekleyip tekrar deneyin.",
  email_address_invalid: "Geçerli bir e-posta adresi girin.",
  user_already_registered: "Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.",
  invalid_credentials: "E-posta veya şifre hatalı.",
  email_not_confirmed: "E-posta adresiniz henüz doğrulanmadı. Gelen kutunuzu kontrol edin.",
};

export function mapAuthErrorMessage(message: string): string {
  const normalized = message.toLowerCase();

  if (normalized.includes("rate limit") || normalized.includes("only request this after")) {
    return ERROR_MESSAGES.over_email_send_rate_limit;
  }

  if (normalized.includes("already registered") || normalized.includes("already been registered")) {
    return ERROR_MESSAGES.user_already_registered;
  }

  if (normalized.includes("invalid login credentials")) {
    return ERROR_MESSAGES.invalid_credentials;
  }

  if (normalized.includes("email not confirmed")) {
    return ERROR_MESSAGES.email_not_confirmed;
  }

  if (normalized.includes("invalid email")) {
    return ERROR_MESSAGES.email_address_invalid;
  }

  return message;
}
