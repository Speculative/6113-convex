
import { query } from "./_generated/server";

export default query(async ({ db }, { id }) => {
  return await db.query("games")
  .filter(q => q.eq(q.field("id"), id))
  .collect()
});
