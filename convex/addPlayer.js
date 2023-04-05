
import { mutation } from "./_generated/server";

// this function needs to be idempotent due to some react behaviour
export default mutation(async ({ db }, { gameId, player }) => {
  let game = await db.query("games")
    .filter(q => q.eq(q.field("id"), gameId))
    .first();
  let players = game.players
  let playerIndex = players.findIndex(p => p.id === player.id)
  if (playerIndex !== -1) {
    // do nothing
  } else {
    // if it doesn't, add the player
    players.push(player)
    let res = await db.patch(game._id, { players })
  }
});
