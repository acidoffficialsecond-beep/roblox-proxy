export default async function handler(req, res) {
  const { gameId, cursor } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    let universeId = gameId;

    // If it's a placeId, resolve to universeId
    if (gameId.length < 12) {
      const placeRes = await fetch(
        `https://apis.roblox.com/universes/v1/places/${gameId}/universe`
      );

      if (!placeRes.ok) {
        return res.status(400).json({ error: "Invalid gameId" });
      }

      const placeJson = await placeRes.json();
      universeId = placeJson.universeId;
    }

    // 🔥 RoProxy endpoint (THIS IS THE KEY)
    let url = `https://games.roproxy.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`;

    if (cursor) {
      url += `&cursor=${cursor}`;
    }

    const response = await fetch(url);
    const json = await response.json();

    return res.status(200).json(json);
  } catch (err) {
    return res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
