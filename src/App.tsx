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

type Game = {
  name: string;
  creator: string;
};

export default function App() {
  const id = useID();
  const [wipName, setWipName] = useState("");

  // Fakes, replace with Convex
  const [name, setName] = useState<string | null>(null);

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
            <Stack direction="row" spacing={2}>
              <TextField
                variant="outlined"
                label="Player name"
                value={wipName}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  setWipName(event.target.value)
                }
              />
              <Button
                sx={css`
                  margin-left: 1rem;
                `}
                variant="contained"
                onClick={() => setName(wipName)}
              >
                Set name
              </Button>
            </Stack>
          </Box>
        ) : (
          <GameSelect />
        )}
      </Paper>
    </Box>
  );
}
