export default async function handler(req, res) {
  const { gameId, cursor } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  const url = new URL("https://catalog.roblox.com/v1/search/items");
  url.searchParams.set("category", "All");
  url.searchParams.set("creatorTargetId", gameId);
  url.searchParams.set("creatorType", "Game");
  url.searchParams.set("salesTypeFilter", "1"); // Game Pass
  url.searchParams.set("limit", "100");

  if (cursor) {
    url.searchParams.set("cursor", cursor);
  }

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
