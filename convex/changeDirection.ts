import { mutation, internalMutation } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default mutation(
  async (
    { db },
    {
      lobby,
      player,
      direction,
    }: {
      lobby: Id<"lobbies">;
      player: Id<"players">;
      direction: "north" | "south" | "east" | "west";
    }
  ) => {
    const gameState = await db
      .query("gameState")
      .withIndex("by_lobby", (q) => q.eq("lobby", lobby))
      .unique();
    if (!gameState) {
      return;
    }

    const newDirections = new Map();
    for (const [member, currentDirection] of gameState.playerDirection) {
      if (member.toString() !== player.toString()) {
        newDirections.set(member.toString(), currentDirection);
      } else {
        newDirections.set(player.toString(), direction);
      }
    }

    await db.patch(gameState._id, {
      playerDirection: newDirections,
    });
  }
);
