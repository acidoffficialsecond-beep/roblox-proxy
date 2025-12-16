export default async function handler(req, res) {
  const { gameId } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  try {
    let universeId = gameId;

    // Resolve placeId → universeId
    if (gameId.length < 12) {
      const placeRes = await fetch(
        `https://apis.roblox.com/universes/v1/places/${gameId}/universe`
      );

      if (!placeRes.ok) {
        return res.status(400).json({ error: "Invalid placeId" });
      }

      const placeJson = await placeRes.json();
      universeId = placeJson.universeId;
    }

    let allPasses = [];
    let cursor = null;

    do {
      let url = `https://games.roblox.com/v1/games/${universeId}/game-passes?limit=100&sortOrder=Asc`;
      if (cursor) url += `&cursor=${cursor}`;

      const response = await fetch(url);
      if (!response.ok) break;

      const data = await response.json();
      allPasses.push(...data.data);
      cursor = data.nextPageCursor;
    } while (cursor);

    return res.status(200).json({
      universeId,
      count: allPasses.length,
      gamePasses: allPasses,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
