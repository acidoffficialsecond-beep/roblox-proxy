export default async function handler(req, res) {
  const { gameId, cursor } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    let universeId = gameId;

    // If small ID, treat as PlaceId → resolve universeId
    if (gameId.length < 10) {
      const placeRes = await fetch(
        `https://games.roblox.com/v1/games?placeIds=${gameId}`
      );
      const placeJson = await placeRes.json();

      if (!placeJson.data || !placeJson.data[0]) {
        return res.status(404).json({ error: "Invalid gameId" });
      }

      universeId = placeJson.data[0].universeId;
    }

    // 🔥 CORRECT catalog request
    const url = new URL("https://catalog.roblox.com/v1/search/items");
    url.searchParams.set("category", "All");
    url.searchParams.set("creatorTargetId", universeId);
    url.searchParams.set("creatorType", "Game");
    url.searchParams.set("assetTypes", "34"); // ✅ GAME PASS
    url.searchParams.set("limit", "100");

    if (cursor) {
      url.searchParams.set("cursor", cursor);
    }

    const response = await fetch(url);
    const json = await response.json();

    const passes = (json.data || []).map(item => ({
      id: item.id,
      name: item.name,
      price: item.price,
      productId: item.productId,
      assetTypeId: 34,
      sellerId: universeId
    }));

    res.status(200).json({
      data: passes,
      nextPageCursor: json.nextPageCursor || null
    });

  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
