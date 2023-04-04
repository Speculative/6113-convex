
import { query } from "./_generated/server";

export default query(async ({ db }, {id}) => {
  return await db.query("games").get(id);
});
