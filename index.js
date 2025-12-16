import express from "express";
import fetch from "node-fetch";

const app = express();

app.get("*", async (req, res) => {
  try {
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
  } catch (err) {
    res.status(500).send("Proxy error");
  }
});

export default app;
