import fetch from "node-fetch";
import cheerio from "cheerio";

export default async function handler(req, res) {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    // 🔥 FETCH ROBLOX GAME PAGE (THIS IS THE PROXY PART)
    const pageRes = await fetch(
      `https://www.roblox.com/games/${gameId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
        },
      }
    );

    const html = await pageRes.text();
    const $ = cheerio.load(html);

    const nextDataRaw = $("#__NEXT_DATA__").html();
    if (!nextDataRaw) {
      return res.status(500).json({ error: "No embedded Roblox data found" });
    }

    const nextData = JSON.parse(nextDataRaw);

    // 🔥 THIS PATH IS WHAT YOUR FRIENDS ARE USING
    const passes =
      nextData?.props?.pageProps?.gameDetails?.gamePasses ?? [];

    return res.status(200).json({
      count: passes.length,
      gamePasses: passes,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: "Failed to fetch game passes",
      message: err.message,
    });
  }
}
