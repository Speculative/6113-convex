import { mutation } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default mutation(
  async (
    { db },
    { lobby, player }: { lobby: Id<"lobbies">; player: Id<"players"> }
  ) => {
    await db.insert("inLobby", {
      lobby,
      player,
    });
  }
);
