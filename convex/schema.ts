import { defineSchema, defineTable, s } from "convex/schema";

export default defineSchema({
  players: defineTable({
    clientID: s.string(),
    name: s.string(),
  }).index("by_client_id", ["clientID"]),
  lobbies: defineTable({
    creator: s.id("players"),
    lobbyName: s.string(),
    status: s.union(
      s.literal("lobby"),
      s.literal("playing"),
      s.literal("ended")
    ),
  }),
  inLobby: defineTable({
    player: s.id("players"),
    lobby: s.id("lobbies"),
  })
    .index("by_player", ["player"])
    .index("by_lobby", ["lobby"]),
});
