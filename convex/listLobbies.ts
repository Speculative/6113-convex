import { query } from "./_generated/server";

export default query(async ({ db }) => {
  const lobbies = await db.query("lobbies").collect();
  console.log("Lobbies:", lobbies);
  const augmented = await Promise.all(
    lobbies.map(async (lobby) => ({
      ...lobby,
      creatorName: (await db.get(lobby.creator))!.name,
      playerCount: (
        await db
          .query("inLobby")
          .withIndex("by_lobby", (q) => q.eq("lobby", lobby._id))
          .collect()
      ).length,
    }))
  );
  console.log("Augmented", augmented);
  return augmented;
});
