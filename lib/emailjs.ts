/**
 * Server-side EmailJS REST send.
 * Set EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_PASSWORD_RESET, EMAILJS_PUBLIC_KEY.
 * If your account uses a private key, set EMAILJS_PRIVATE_KEY (sent as accessToken).
 *
 * Template should include something like: Your code is {{otp}} (expires in 5 minutes).
 * Common params supported here: email, to_email, otp, expiry_time, user_name, app_name.
 */

const EMAILJS_SEND_URL = "https://api.emailjs.com/api/v1.0/email/send";

export type SendPasswordResetOtpParams = {
  toEmail: string;
  otp: string;
  userName?: string | null;
};

export async function sendPasswordResetOtpEmail(
  params: SendPasswordResetOtpParams,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_PASSWORD_RESET;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey) {
    return {
      ok: false,
      message:
        "EmailJS is not configured (EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_PASSWORD_RESET, EMAILJS_PUBLIC_KEY).",
    };
  }

  const body: Record<string, unknown> = {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    template_params: {
      // Keep both keys so different EmailJS templates resolve recipient correctly.
      email: params.toEmail,
      to_email: params.toEmail,
      toEmail: params.toEmail,
      otp: params.otp,
      passcode: params.otp,
      expiry_time: "5 minutes from now",
      user_name: params.userName ?? "",
      name: params.userName ?? "User",
      app_name: process.env.APP_PUBLIC_NAME ?? "SmartOps Ledger",
    },
  };

  if (privateKey) {
    body.accessToken = privateKey;
  }

  try {
    const res = await fetch(EMAILJS_SEND_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      return {
        ok: false,
        message: text || `EmailJS HTTP ${res.status}`,
      };
    }

    return { ok: true };
  } catch (e) {
    const message = e instanceof Error ? e.message : "Network error";
    return { ok: false, message };
  }
}
