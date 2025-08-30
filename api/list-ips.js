// api/list-ips.js
import { kv } from "@vercel/kv";

export default async function handler(req, res) {
  const ips = await kv.smembers("unique_ips"); // read all stored IPs
  res.status(200).json({
    total: ips.length,
    ips,
  });
}
