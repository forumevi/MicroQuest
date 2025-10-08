export default async function handler(req, res) {
  const secret = process.env.REWARD_SECRET;

  if (!secret) {
    return res.status(500).json({ error: "Missing REWARD_SECRET env variable" });
  }

  const { authorization } = req.headers;
  if (authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  // Example response (placeholder)
  return res.status(200).json({
    message: "Quest reward successfully verified!",
    reward: "MicroQuest Badge #001",
  });
}
