// api/track.js
import { kv } from '@vercel/kv';
import crypto from 'crypto';

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Content-Type", "application/json");

  if (req.method === "GET") {
    const totalPlayers = await kv.scard("takai:players");
    return res.status(200).json({ totalPlayers });
  }

  if (req.method === "POST") {
    const forwarded = req.headers["x-forwarded-for"] || req.headers["x-real-ip"] || req.socket?.remoteAddress || "";
    const ip = String(forwarded).split(",")[0].trim();
    if (!ip) return res.status(400).json({ error: "Could not resolve IP" });

    const salt = process.env.IP_SALT || "mysalt";
    const hash = crypto.createHash("sha256").update(`${salt}|${ip}`).digest("hex");

    await kv.sadd("takai:players", hash);

    const totalPlayers = await kv.scard("takai:players");
    return res.status(200).json({ totalPlayers });
  }

  res.setHeader("Allow", "GET, POST");
  return res.status(405).end("Method Not Allowed");
}
