export default async function handler(req, res) {
  const { userId, cursor } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "Missing userId" });
  }

  let url = `https://games.roblox.com/v2/users/${userId}/games?accessFilter=Public&sortOrder=Asc&limit=10`;
  if (cursor) url += `&cursor=${cursor}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user games" });
  }
}
