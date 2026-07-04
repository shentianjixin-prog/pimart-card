import "server-only";
import { SUPPORT_EMAIL } from "@/lib/site";

const RESEND_API_KEY = process.env.RESEND_API_KEY?.trim();
const EMAIL_FROM =
  process.env.EMAIL_FROM?.trim() || `PIMART CARD <noreply@${SUPPORT_EMAIL.split("@")[1] || "pimart-card.com"}>`;

export function isEmailConfigured() {
  return Boolean(RESEND_API_KEY);
}

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
  text?: string;
};

export async function sendEmail(input: SendEmailInput) {
  if (!RESEND_API_KEY) {
    return { ok: false as const, error: "email_not_configured" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: EMAIL_FROM,
      to: [input.to],
      subject: input.subject,
      html: input.html,
      text: input.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    console.error("[email] Resend error:", res.status, body);
    return { ok: false as const, error: "email_send_failed" };
  }

  return { ok: true as const };
}

export async function sendPasswordResetEmail(to: string, resetUrl: string, lang: "zh" | "ja" | "en") {
  const copy = {
    zh: {
      subject: "PIMART CARD 密码重置",
      html: `<p>您好，</p><p>请点击以下链接重置密码（1 小时内有效）：</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>如非本人操作请忽略此邮件。</p>`,
      text: `请打开以下链接重置密码（1 小时内有效）：\n${resetUrl}`,
    },
    ja: {
      subject: "PIMART CARD パスワード再設定",
      html: `<p>お客様</p><p>以下のリンクからパスワードを再設定してください（1時間有効）：</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>心当たりがない場合はこのメールを破棄してください。</p>`,
      text: `以下のリンクからパスワードを再設定してください（1時間有効）：\n${resetUrl}`,
    },
    en: {
      subject: "PIMART CARD password reset",
      html: `<p>Hello,</p><p>Click the link below to reset your password (valid for 1 hour):</p><p><a href="${resetUrl}">${resetUrl}</a></p><p>If you did not request this, you can ignore this email.</p>`,
      text: `Reset your password using this link (valid for 1 hour):\n${resetUrl}`,
    },
  }[lang];

  return sendEmail({
    to,
    subject: copy.subject,
    html: copy.html,
    text: copy.text,
  });
}
