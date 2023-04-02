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

import { GameSelect } from "./GameSelect";
import { GameLobby, Game } from "./GameLobby";

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
  const [currentGame, setCurrentGame] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([
    {
      id: "1",
      name: "A Game",
      creator: "Someone",
    },
    {
      id: "2",
      name: "Another Game 0",
      creator: "Someone",
    },
    {
      id: "3",
      name: "Another Game 1",
      creator: "Someone",
    },
    {
      id: "4",
      name: "Another Game 2",
      creator: "Someone",
    },
    {
      id: "5",
      name: "Another Game 3",
      creator: "Someone",
    },
    {
      id: "6",
      name: "Another Game 4",
      creator: "Someone",
    },
  ]);

  return (
    <Box
      sx={css`
        width: 100%;
        height: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background: white;
      `}
    >
      <Paper
        sx={css`
          display: flex;
          justify-content: center;
          width: 800px;
          height: 600px;
        `}
      >
        {name === null ? (
          <Box
            sx={css`
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
                  sx={css`
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
        ) : currentGame === null ? (
          <GameSelect
            gameList={games}
            onSelectGame={(gameId) => setCurrentGame(gameId)}
            onAddGame={(game) => setGames([...games, game])}
          />
        ) : (
          <GameLobby
            lobbyName={games.find((g) => g.id === currentGame).name}
            onStartGame={() => {}}
            onLeaveGame={() => setCurrentGame(null)}
          />
        )}
      </Paper>
    </Box>
  );
}
