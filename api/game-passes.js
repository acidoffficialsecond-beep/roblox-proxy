const cheerio = require("cheerio");

module.exports = async function handler(req, res) {
  try {
    const { gameId } = req.query;

    if (!gameId) {
      res.statusCode = 400;
      return res.end(JSON.stringify({ error: "Missing gameId" }));
    }

    const response = await fetch(
      `https://www.roblox.com/games/${gameId}`,
      {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120",
          "Accept": "text/html",
        },
      }
    );

    if (!response.ok) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ error: "Failed to fetch Roblox page" })
      );
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    const nextDataRaw = $("#__NEXT_DATA__").html();

    if (!nextDataRaw) {
      res.statusCode = 500;
      return res.end(
        JSON.stringify({ error: "__NEXT_DATA__ not found" })
      );
    }

    const nextData = JSON.parse(nextDataRaw);

    const passes =
      nextData &&
      nextData.props &&
      nextData.props.pageProps &&
      nextData.props.pageProps.gameDetails &&
      nextData.props.pageProps.gameDetails.gamePasses
        ? nextData.props.pageProps.gameDetails.gamePasses
        : [];

    res.setHeader("Content-Type", "application/json");
    res.statusCode = 200;
    return res.end(
      JSON.stringify({
        count: passes.length,
        gamePasses: passes,
      })
    );

  } catch (err) {
    console.error("CRASH:", err);
    res.statusCode = 500;
    return res.end(
