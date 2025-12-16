export default async function handler(req, res) {
  const { gameId, cursor } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    let universeId = null;

    // 1️⃣ Try as PlaceId
    const placeRes = await fetch(
      `https://games.roblox.com/v1/games?placeIds=${gameId}`
    );
    const placeJson = await placeRes.json();

    if (placeJson.data && placeJson.data[0]) {
      universeId = placeJson.data[0].universeId;
    }

    // 2️⃣ If not a place, try as UniverseId
    if (!universeId) {
      const universeRes = await fetch(
        `https://games.roblox.com/v1/games?universeIds=${gameId}`
      );
      const universeJson = await universeRes.json();

      if (universeJson.data && universeJson.data[0]) {
        universeId = universeJson.data[0].id;
      }
    }

    if (!universeId) {
      return res.status(404).json({ error: "Invalid gameId" });
    }

    // 3️⃣ Fetch game passes
    const url = new URL("https://catalog.roblox.com/v1/search/items");
    url.searchParams.set("category", "All");
    url.searchParams.set("creatorTargetId", universeId);
    url.searchParams.set("creatorType", "Game");
    url.searchParams.set("salesTypeFilter", "1"); // Game Pass
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
