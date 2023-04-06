import { mutation } from "./_generated/server";
import { Id } from "../convex/_generated/dataModel";

export default mutation(
  async (
    { db },
    { lobbyName, creator }: { lobbyName: string; creator: Id<"players"> }
  ) => {
    const lobby = await db.insert("lobbies", {
      creator,
      lobbyName,
      status: "lobby",
    });
    await db.insert("inLobby", {
      lobby,
      player: creator,
    });
  }
);
