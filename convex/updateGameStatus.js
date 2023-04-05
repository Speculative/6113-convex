
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, {gameId, gameStatus}) => {
  let game = await db.query("games")
  .filter(q => q.eq(q.field("id"), gameId))
  .first();
  let res = await db.patch(game._id, {status: gameStatus})
});
