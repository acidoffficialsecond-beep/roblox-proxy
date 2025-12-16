export const config = {
  runtime: "nodejs",
};

import * as cheerio from "cheerio";

export default async function handler(req, res) {
  try {
    const { gameId } = req.query;

    if (!gameId) {
      return res.status(400).json({ error: "Missing gameId" });
    }

    // 🔥 Use BUILT-IN fetch (NO node-fetch)
    const pageRes = await fetch(
      `https://www.roblox.com/games/${gameId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          "Accept": "text/html",
        },
      }
    );

    if (!pageRes.ok) {
      return res.status(500).json({
        error: "Failed to fetch Roblox page",
        status: pageRes.status,
      });
    }

    const html = await pageRes.text();

    const $ = cheerio.load(html);
    const nextDataRaw = $("#__NEXT_DATA__").html();

    if (!nextDataRaw) {
      return res.status(500).json({
        error: "Roblox page structure changed (no __NEXT_DATA__)",
      });
    }

    const nextData = JSON.parse(nextDataRaw);

    const passes =
      nextData?.props?.pageProps?.gameDetails?.gamePasses ?? [];

    return res.status(200).json({
      count: passes.length,
      gamePasses: passes,
    });

  } catch (err) {
    console.error("CRASH:", err);
    return res.status(500).json({
      error: "Function crashed",
      message: err.message,
      stack: err.stack,
    });
  }
}
