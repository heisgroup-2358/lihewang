import { createHash, createHmac } from "crypto";

export function generateSignature(params: Record<string, string>, secret: string): string {
  const sorted = Object.keys(params)
    .filter((k) => k !== "sign")
    .sort()
    .reduce<Record<string, string>>((acc, k) => {
      acc[k] = params[k];
      return acc;
    }, {});

  const queryString = Object.entries(sorted)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&")
    .replace(/%20/g, "+");

  return createHash("sha512").update(queryString + secret).digest("hex");
}

export async function createPayment(params: {
  merchant_reference: string;
  currency: string;
  amount: string;
  return_url: string;
  notify_url: string;
  customer_ip: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_phone: string;
  customer_email: string;
  network: string;
  subject: string;
  merchant_token: string;
  secret_code: string;
  api_key: string;
  gateway_url: string;
}): Promise<string> {
  const {
    merchant_token, secret_code, api_key, gateway_url,
    ...bodyParams
  } = params;

  const sign = generateSignature(bodyParams, secret_code);

  const body = { ...bodyParams, sign };

  const res = await fetch(`${gateway_url}/payment/v3/request`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": api_key,
      "Merchant-Token": merchant_token,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();

  if (data.response?.code !== "200") {
    throw new Error(data.response?.message || "Payment creation failed");
  }

  return data.payload.payment_url;
}

export function verifyCallbackSignature(
  body: Record<string, string>,
  signature: string,
  secret: string
): boolean {
  const expected = generateSignature(body, secret);
  return expected === signature;
}
