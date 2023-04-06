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
  gameState: defineTable({
    lobby: s.id("lobbies"),
    playerPosition: s.map(
      s.string(),
      s.array(
        s.object({
          row: s.number(),
          col: s.number(),
        })
      )
    ),
    playerDirection: s.map(
      s.string(),
      s.union(
        s.literal("north"),
        s.literal("south"),
        s.literal("east"),
        s.literal("west")
      )
    ),
    food: s.array(
      s.object({
        row: s.number(),
        col: s.number(),
      })
    ),
    ticks: s.number(),
  }).index("by_lobby", ["lobby"]),
});
