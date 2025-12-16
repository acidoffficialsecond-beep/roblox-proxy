import express from "express";
import fetch from "node-fetch";

const app = express();

const MODE = process.env.MODE; // "GAMES" or "PASSES"

app.get("*", async (req, res) => {
  try {
    if (MODE === "GAMES" && !req.path.startsWith("/v2/users/")) {
      return res.status(403).send("Blocked");
    }

    if (MODE === "PASSES" && !req.path.includes("/game-passes")) {
      return res.status(403).send("Blocked");
    }

    const targetUrl = "https://games.roblox.com" + req.originalUrl;

    const response = await fetch(targetUrl, {
      headers: {
        "User-Agent": "Roblox/WinInet",
      },
    });

    const body = await response.text();
    res.status(response.status).send(body);
  } catch (err) {
    res.status(500).send("Proxy error");
  }
});

// ✅ EXPORT for Vercel
export default app;
