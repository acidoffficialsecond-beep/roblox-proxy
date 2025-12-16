import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    const url = req.url;

    // Allow ONLY game passes
    if (!url.startsWith("/api/v1/games/") || !url.includes("/game-passes")) {
      res.status(403).send("Goon");
      return;
    }

    // Remove /api before forwarding
    const robloxPath = url.replace("/api", "");
    const targetUrl = "https://games.roblox.com" + robloxPath;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Roblox/WinInet"
      }
    });

    const body = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", "application/json");
    res.send(body);
  } catch (err) {
    res.status(500).send("Proxy error");
  }
}
