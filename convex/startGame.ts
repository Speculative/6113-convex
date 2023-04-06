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
      food: [],
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

    for (let i = 0; i < members.length; i++) {
      // TODO: Bad, should check to make sure they're in different positions
      // and not on players
      initialState.food.push({
        row: Math.floor(Math.random() * 30),
        col: Math.floor(Math.random() * 30),
      });
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

    let newFood = latestState.food;
    const tickPositions = new Map();
    for (const [member, positions] of latestState.playerPosition) {
      const direction = latestState.playerDirection.get(member.toString());
      const { row: lastRow, col: lastCol } = positions[positions.length - 1];
      const nextPosition =
        direction === "north"
          ? { row: (lastRow - 1 + 30) % 30, col: lastCol }
          : direction === "south"
          ? { row: (lastRow + 1) % 30, col: lastCol }
          : direction === "west"
          ? { row: lastRow, col: (lastCol - 1 + 30) % 30 }
          : { row: lastRow, col: (lastCol + 1) % 30 };

      const foodIndex = latestState.food.findIndex(
        ({ row, col }) => row === nextPosition.row && col === nextPosition.col
      );
      let newPositions = positions.slice(1);
      if (foodIndex !== -1) {
        // Eat food, don't retract tail
        newPositions = positions;

        // Remove old food, create new food
        newFood = [
          ...newFood.slice(0, foodIndex),
          ...newFood.slice(foodIndex + 1),
        ];
        newFood.push({
          row: Math.floor(Math.random() * 30),
          col: Math.floor(Math.random() * 30),
        });
      }

      newPositions.push(nextPosition);
      tickPositions.set(member.toString(), newPositions);
    }

    await db.patch(gameState, {
      ticks: latestState.ticks + 1,
      playerPosition: tickPositions,
      food: newFood,
    });

    // Schedule the next tick
    await scheduler.runAfter(300, "startGame:tick", { gameState });
  }
);
