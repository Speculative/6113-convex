import { css } from "@emotion/react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import { useMutation, useQuery } from "../convex/_generated/react";

import { useClientID } from "./id";

export function NameForm() {
  const clientID = useClientID();
  const localPlayer = useQuery("getPlayerByClientID", { clientID });
  const setName = useMutation("setPlayerName");

  return (
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
          setName({
            player: { clientID, name: form.get("name") as string },
          });
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
  );
}
