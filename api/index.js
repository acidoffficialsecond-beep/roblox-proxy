export default function handler(req, res) {
  res.status(200).json({
    message: "Pro Sigma Pro, USE THESE NOOB: ",
    usage: {
      gamePasses: "/api/game-passes?gameId=GAME_ID",
      userGames: "/api/user-games?userId=USER_ID"
    }
  });
}
