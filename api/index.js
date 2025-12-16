export default function handler(req, res) {
  res.status(200).send(
    "Roblox Proxy is running. Use /api/game-passes?gameId=PLACE_OR_UNIVERSE_ID"
  );
}
