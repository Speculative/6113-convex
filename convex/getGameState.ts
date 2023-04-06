import { query } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default query(async ({ db }, { lobby }: { lobby: Id<"lobbies"> }) => {
  return await db
    .query("gameState")
    .withIndex("by_lobby", (q) => q.eq("lobby", lobby))
    .unique();
});
