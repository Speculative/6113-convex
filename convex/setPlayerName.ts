import { mutation } from "./_generated/server";

export default mutation(
  async (
    { db },
    { player }: { player: { clientID: string; name: string } }
  ) => {
    const existing = await db
      .query("players")
      .withIndex("by_client_id", (q) => q.eq("clientID", player.clientID))
      .unique();
    if (existing) {
      return;
    }

    await db.insert("players", player);
  }
);
