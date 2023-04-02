import { useState, useMemo } from "react";
import { css } from "@emotion/react";
import { v4 as uuidv4 } from "uuid";
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

import { generateColors } from "./color";

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
      id: uuidv4(),
      name: "Jeff",
    },
    {
      id: uuidv4(),
      name: "Pavan",
    },
    {
      id: uuidv4(),
      name: "PJ",
    },
    {
      id: uuidv4(),
      name: "Sean",
    },
    {
      id: uuidv4(),
      name: "Dan",
    },
    {
      id: uuidv4(),
      name: "Tiff",
    },
    {
      id: uuidv4(),
      name: "Ian",
    },
    {
      id: uuidv4(),
      name: "Lavina",
    },
    {
      id: uuidv4(),
      name: "Nolm",
    },
    {
      id: uuidv4(),
      name: "Mick",
    },
  ]);
  const playerColors = useMemo(() => {
    const colors = generateColors(players.length, props.lobbyName);
    return Object.fromEntries(
      players.map((player, i) => [player.id, colors[i]])
    );
  }, [players, props.lobbyName]);
  console.log(playerColors);

  return (
    <Box
      sx={css`
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `}
    >
      <Box>
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
      </Box>
      <Box
        sx={css`
          padding: 2rem;
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <Typography variant="h2">{props.lobbyName}</Typography>
        <List
          sx={css`
            flex-grow: 1;
            overflow-y: auto;
          `}
        >
          {players.map((player) => (
            <ListItem>
              <ListItemText
                sx={css`
                  color: ${playerColors[player.id]};
                `}
              >
                {player.name}
              </ListItemText>
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
