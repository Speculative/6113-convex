import { query } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default query(async ({ db }, { id }: { id: Id<"players"> | null }) => {
  if (id === null) {
    return null;
  }

  const inLobby = await db
    .query("inLobby")
    .withIndex("by_player", (q) => q.eq("player", id))
    .unique();
  if (!inLobby) {
    return null;
  }

  return await db.get(inLobby.lobby);
});
