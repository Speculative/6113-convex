import { mutation } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default mutation(
  async ({ db }, { player }: { player: Id<"players"> }) => {
    const currentLobby = await db
      .query("inLobby")
      .withIndex("by_player", (q) => q.eq("player", player))
      .unique();
    if (!currentLobby) {
      return;
    }

    await db.delete(currentLobby._id);
  }
);
