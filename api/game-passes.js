export default async function handler(req, res) {
  const { gameId, cursor } = req.query;

  if (!gameId) {
    return res.status(400).json({ error: "Missing gameId" });
  }

  let url = `https://games.roblox.com/v1/games/${gameId}/game-passes?limit=100&sortOrder=Asc`;
  if (cursor) url += `&cursor=${cursor}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch game passes" });
  }
}
