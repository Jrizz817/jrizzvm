import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const key = "keepalive:last";
  await kv.set(key, String(Date.now()));
  return res.status(200).json({ ok: true, ts: Date.now() });
}
