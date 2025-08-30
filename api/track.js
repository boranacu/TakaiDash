// api/track.js
import { kv } from "@vercel/kv";
import crypto from "crypto";

export default async function handler(req, res) {
  // get IP address from request
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] ||
    req.connection?.remoteAddress ||
    "unknown";

  // hash the IP with your secret salt
  const hash = crypto
    .createHash("sha256")
    .update(ip + process.env.IP_SALT)
    .digest("hex");

  // store into Redis as a set (unique list)
  await kv.sadd("unique_ips", hash);

  res.status(200).json({ message: "IP tracked" });
}
