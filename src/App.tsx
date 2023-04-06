import { useState, useEffect } from "react";
import { useMutation, useQuery } from "../convex/_generated/react";
import { css } from "@emotion/react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Stack,
} from "@mui/material";

import { useClientID } from "./id";
import { NameForm } from "./NameForm";
import { GameSelect } from "./GameSelect";
import { GameLobby } from "./GameLobby";
import { GamePlay } from "./GamePlay";

export default function App() {
  const clientID = useClientID();
  const localPlayer = useQuery("getPlayerByClientID", { clientID });
  const setName = useMutation("setPlayerName");

  const currentLobby = useQuery("getCurrentLobby", {
    id: (localPlayer && localPlayer._id) || null,
  });

  console.log("CurrentLobby:", currentLobby);

  return currentLobby && currentLobby.status === "playing" ? (
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
        {!localPlayer ? (
          <NameForm />
        ) : !currentLobby ? (
          <GameSelect />
        ) : (
          <GameLobby lobby={currentLobby} />
        )}
      </Paper>
    </Box>
  );
}
