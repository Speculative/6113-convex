import { mutation, internalMutation } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default mutation(
  async ({ db, scheduler }, { lobby }: { lobby: Id<"lobbies"> }) => {
    const existingLobby = await db.get(lobby);
    if (!existingLobby) {
      return;
    }

    await db.patch(lobby, {
      status: "playing",
    });

    const membersInLobby = await db
      .query("inLobby")
      .withIndex("by_lobby", (q) => q.eq("lobby", lobby))
      .collect();
    const members = membersInLobby.map((membership) => membership.player);

    // Initialize game state
    const initialState = {
      lobby,
      playerPosition: new Map(),
      playerDirection: new Map(),
      ticks: 0,
    };
    for (const member of members) {
      const initialDirection = ["north", "south", "east", "west"][
        Math.floor(Math.random() * 4)
      ];
      const initialPosition = {
        row: Math.floor(Math.random() * 30),
        col: Math.floor(Math.random() * 30),
      };
      console.log(initialDirection, initialPosition);
      initialState.playerDirection.set(member.toString(), initialDirection);
      initialState.playerPosition.set(member.toString(), [initialPosition]);
    }

    const gameState = await db.insert("gameState", initialState);

    // Schedule first tick after a delay so that everyone can load in
    await scheduler.runAfter(5000, "startGame:tick", { gameState });
  }
);

export const tick = internalMutation(
  async ({ db, scheduler }, { gameState }: { gameState: Id<"gameState"> }) => {
    const latestState = await db.get(gameState);
    if (!latestState) {
      return;
    }

    const tickPositions = new Map();
    for (const [member, positions] of latestState.playerPosition) {
      const direction = latestState.playerDirection.get(member.toString());
      const { row: lastRow, col: lastCol } = positions[positions.length - 1];
      const newPositions = positions.slice(1);
      const newPosition =
        direction === "north"
          ? { row: (lastRow - 1 + 30) % 30, col: lastCol }
          : direction === "south"
          ? { row: (lastRow + 1) % 30, col: lastCol }
          : direction === "west"
          ? { row: lastRow, col: (lastCol - 1 + 30) % 30 }
          : { row: lastRow, col: (lastCol + 1) % 30 };
      newPositions.push(newPosition);
      tickPositions.set(member.toString(), newPositions);
    }

    await db.patch(gameState, {
      ticks: latestState.ticks + 1,
      playerPosition: tickPositions,
    });

    // Schedule the next tick
    await scheduler.runAfter(300, "startGame:tick", { gameState });
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
