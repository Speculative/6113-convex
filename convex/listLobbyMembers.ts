import { query } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default query(async ({ db }, { lobby }: { lobby: Id<"lobbies"> }) => {
  const membersInLobby = await db
    .query("inLobby")
    .withIndex("by_lobby", (q) => q.eq("lobby", lobby))
    .collect();

  const augmented = await Promise.all(
    membersInLobby.map(async (membership) => await db.get(membership.player))
  );
  return augmented;
});
