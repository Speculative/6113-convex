import { query } from "./_generated/server";

export default query(async ({ db }, { clientID }: { clientID: string }) => {
  return await db
    .query("players")
    .withIndex("by_client_id", (q) => q.eq("clientID", clientID))
    .unique();
});
