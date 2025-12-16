import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("*", async (req, res) => {
  try {
    const allowed =
      req.originalUrl.startsWith("/v1/games/") &&
      req.originalUrl.includes("/game-passes");

    if (!allowed) {
      return res.status(403).send("Blocked");
    }

    const targetUrl = "https://games.roblox.com" + req.originalUrl;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Roblox/WinInet"
      }
    });

    const body = await response.text();

    res.status(response.status);
    res.setHeader("Content-Type", "application/json");
    res.send(body);
  } catch {
    res.status(500).send("Proxy error");
  }
});

export default app;
