type Email = {
  to: string;
  subject: string;
  text: string;
  idempotencyKey: string;
};

export async function sendTransactionalEmail(message: Email): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!key || !from) return false;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      "Idempotency-Key": message.idempotencyKey,
    },
    body: JSON.stringify({
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
    }),
    signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error(`EMAIL_SEND_${response.status}`);
  return true;
}
