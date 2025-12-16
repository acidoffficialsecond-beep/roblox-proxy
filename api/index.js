export default function handler(req, res) {
  res.status(200).json({
    message: "Roblox Proxy API is running",
    usage: {
      gamePasses: "/api/game-passes?gameId=GAME_ID",
      userGames: "/api/user-games?userId=USER_ID"
    }
  });
}
