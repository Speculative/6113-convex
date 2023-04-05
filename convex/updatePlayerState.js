
import { mutation } from "./_generated/server";

export default mutation(async ({ db }, {gameId, playerId, playerState}) => {
  // console.log("gid inside ", gameId)
  let game = await db.query("games")
  .filter(q => q.eq(q.field("id"), gameId))
  .first();
  ;
  // iterate through game.players and find the index of the player with the matching id
  let playerIndex = game.players.findIndex(player => player.id === playerId);
  // update the playerState of the player at the index
  game.players[playerIndex].direction = playerState.direction;
  game.players[playerIndex].positions = playerState.positions;
  
  let players = game.players
  let res = await db.patch(game._id, {players})
});
