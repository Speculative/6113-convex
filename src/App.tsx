import { useState, useEffect } from "react";
import { useMutation, useQuery } from "../convex/_generated/react";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import { GameSelect, Game } from "./GameSelect";
import { GameLobby } from "./GameLobby";
import { GamePlay } from "./GamePlay";

function useID() {
  const [id, setID] = useState(localStorage.getItem("snake-id"));

  useEffect(() => {
    if (id === null) {
      const newID = uuidv4();
      localStorage.setItem("snake-id", newID);
      setID(newID);
    }
  }, [id]);

  return id;
}

export default function App() {
  const id = useID();

  // Fakes, replace with Convex
  const [name, setName] = useState<string | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      name: "A Game",
      creator: "Someone",
      status: "lobby",
    },
    {
      id: "2",
      name: "Another Game 0",
      creator: "Someone",
      status: "lobby",
    },
    {
      id: "3",
      name: "Another Game 1",
      creator: "Someone",
      status: "lobby",
    },
    {
      id: "4",
      name: "Another Game 2",
      creator: "Someone",
      status: "lobby",
    },
    {
      id: "5",
      name: "Another Game 3",
      creator: "Someone",
      status: "lobby",
    },
    {
      id: "6",
      name: "Another Game 4",
      creator: "Someone",
      status: "lobby",
    },
  ]);

  const currentGame = games.find((g) => g.id === currentGameId);

  return currentGame && currentGame.status === "playing" ? (
    <GamePlay />
  ) : (
    <Box
      css={css`
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background: white;
      `}
    >
      <Paper
        css={css`
          display: flex;
          justify-content: center;
          width: 800px;
          height: 600px;
        `}
      >
        {name === null ? (
          <Box
            css={css`
              display: flex;
              flex-direction: column;
              align-items: center;
              align-self: center;
            `}
          >
            <h1
              css={css`
                font-size: 4rem;
                margin-bottom: 2rem;
              `}
            >
              Competitive Snake
            </h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.target as HTMLFormElement);
                setName(form.get("name") as string);
              }}
            >
              <Stack direction="row" spacing={2}>
                <TextField
                  variant="outlined"
                  name="name"
                  label="Player name"
                  autoFocus
                />
                <Button
                  css={css`
                    margin-left: 1rem;
                  `}
                  variant="contained"
                  type="submit"
                >
                  Set name
                </Button>
              </Stack>
            </form>
          </Box>
        ) : currentGameId === null ? (
          <GameSelect
            gameList={games}
            onSelectGame={(gameId) => setCurrentGameId(gameId)}
            onAddGame={(game) => setGames([...games, game])}
          />
        ) : (
          <GameLobby
            lobbyName={games.find((g) => g.id === currentGameId)!.name}
            onStartGame={() => {
              const gameIndex = games.findIndex((g) => g.id === currentGameId);
              const gameToStart = games[gameIndex];
              setGames([
                ...games.slice(0, gameIndex),
                {
                  ...gameToStart,
                  status: "playing",
                },
                ...games.slice(gameIndex + 1),
              ]);
            }}
            onLeaveGame={() => setCurrentGameId(null)}
          />
        )}
      </Paper>
    </Box>
  );
}
