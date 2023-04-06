import { Id } from "./_generated/dataModel";
import { mutation, internalMutation } from "./_generated/server";

export default mutation(
  async ({ db, scheduler }, { lobby }: { lobby: Id<"lobbies"> }) => {
    // Initialize game state
    const initialState = {
      lobby,
      playerPosition: new Map(),
      playerDirection: new Map(),
      ticks: 0,
    };

    const gameState = await db.insert("gameState", initialState);

    // Schedule first tick after a delay so that everyone can load in
    await scheduler.runAfter(5000, "tickGame:tick", { gameState });
  }
);

export const tick = internalMutation(
  async ({ db, scheduler }, { gameState }: { gameState: Id<"gameState"> }) => {
    const latestState = (await db.get(gameState))!;
    console.log("tick");

    await db.patch(gameState, { ticks: latestState.ticks + 1 });

    // Schedule the next tick
    await scheduler.runAfter(300, "tickGame:tick", { gameState });
  }
);

/*
        const newPositions = playerState.positions.slice(1);
        const [lastRow, lastCol] =
          playerState.positions[playerState.positions.length - 1];
        const newPosition =
          playerState.direction === "north"
            ? [lastRow - 1, lastCol]
            : playerState.direction === "south"
              ? [lastRow + 1, lastCol]
              : playerState.direction === "west"
                ? [lastRow, lastCol - 1]
                : [lastRow, lastCol + 1];

        // looping logic at the grid borders. TODO: make constants for dimensions
        if (newPosition[0] > 29) {
          newPosition[0] = 0;
        }
        if (newPosition[1] > 29) {
          newPosition[1] = 0;
        }
        if (newPosition[0] < 0) {
          newPosition[0] = 29;
        }
        if (newPosition[1] < 0) {
          newPosition[1] = 29;
        }
        newPositions.push(newPosition as [number, number]);

        let finalPlayerState = {
          ...playerState,
          positions: newPositions,
        };
        updatePlayerMutation({ gameId: gid, playerId: pid, playerState: finalPlayerState });
        return finalPlayerState;
      });
      */
