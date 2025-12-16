export const runtime = "nodejs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const gameId = searchParams.get("gameId");

    if (!gameId) {
      return new Response(JSON.stringify({ error: "Missing gameId" }), { status: 400 });
    }

    let universeId = gameId;

    // Resolve placeId → universeId
    if (Number(gameId) < 1_000_000_000_000) {
      const placeRes = await fetch(
        `https://apis.roblox.com/universes/v1/places/${gameId}/universe`
      );

      if (!placeRes.ok) {
        return new Response(JSON.stringify({ error: "Invalid placeId" }), { status: 400 });
      }

      const placeJson = await placeRes.json();
      universeId = placeJson.universeId;
    }

    let gamePasses = [];
    let cursor = "";

    do {
      const url =
        `https://develop.roblox.com/v1/universes/${universeId}/game-passes` +
        `?limit=100&cursor=${cursor}`;

      const res = await fetch(url);
      const json = await res.json();

      if (!json.data) break;

      gamePasses.push(...json.data);
      cursor = json.nextPageCursor ?? "";

    } while (cursor);

    return new Response(JSON.stringify({
      universeId,
      count: gamePasses.length,
      gamePasses
    }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({
      error: "Server error",
      message: err.message
    }), { status: 500 });
  }
}
