import { useState, useEffect } from "react";
import { css } from "@emotion/react";
import {
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VideogameAssetIcon from "@mui/icons-material/VideogameAsset";

type Player = {
  id: string;
  name: string;
};

type GameLobbyProps = {
  lobbyName: string;
  onLeaveGame: () => void;
  onStartGame: () => void;
};

export function GameLobby(props: GameLobbyProps) {
  // Fakes, replace with Convex
  const [players, setPlayers] = useState<Player[]>([
    {
      id: "1",
      name: "Jeff",
    },
    {
      id: "2",
      name: "Pavan",
    },
  ]);

  return (
    <Box
      sx={css`
        width: 100%;
      `}
    >
      <Tooltip title="Leave game">
        <IconButton
          sx={css`
            margin-left: 1rem;
            margin-top: 1rem;
          `}
          onClick={() => props.onLeaveGame()}
        >
          <ArrowBackIcon />
        </IconButton>
      </Tooltip>
      <Box
        sx={css`
          padding: 2rem;
        `}
      >
        <Typography variant="h2">{props.lobbyName}</Typography>
        <List>
          {players.map((player) => (
            <ListItem>
              <ListItemText>{player.name}</ListItemText>
            </ListItem>
          ))}
        </List>
        <Button
          sx={css`
            margin-top: 1rem;
          `}
          variant="contained"
          startIcon={<VideogameAssetIcon />}
          onClick={() => props.onStartGame()}
        >
          Play game
        </Button>
      </Box>
    </Box>
  );
}
