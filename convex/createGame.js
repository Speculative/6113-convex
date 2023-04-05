
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, {game}) => {
  const id = await db.insert("games", game);
  console.log(id);
});
