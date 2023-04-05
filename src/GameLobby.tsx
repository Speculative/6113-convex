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
import { Player } from "./GameSelect";

type GameLobbyProps = {
  lobbyName: string;
  players: Player[];
  onLeaveGame: () => void;
  onStartGame: () => void;
};

export function GameLobby(props: GameLobbyProps) {
  // Fakes, replace with Convex
  const [players, setPlayers] = useState<Player[]>(props.players);
  const playerColors = useMemo(() => {
    const colors = generateColors(players.length, props.lobbyName);
    return Object.fromEntries(
      players.map((player, i) => [player.id, colors[i]])
    );
  }, [players, props.lobbyName]);

  return (
    <Box
      css={css`
        width: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
      `}
    >
      <Box>
        <Tooltip title="Leave game">
          <IconButton
            css={css`
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
        css={css`
          padding: 2rem;
          display: flex;
          flex-grow: 1;
          flex-direction: column;
          overflow: hidden;
        `}
      >
        <Typography variant="h2">{props.lobbyName}</Typography>
        <List
          css={css`
            flex-grow: 1;
            overflow-y: auto;
          `}
        >
          {players.map((player) => (
            <ListItem key={player.id}>
              <ListItemText
                css={css`
                  color: ${playerColors[player.id]};
                `}
              >
                {player.name}
              </ListItemText>
            </ListItem>
          ))}
        </List>
        <Button
          css={css`
            margin-top: 1rem;
          `}
          variant="contained"
          startIcon={<VideogameAssetIcon />}
          onClick={() => {
            console.log("clicked")
            props.onStartGame()}}
        >
          Play game
        </Button>
      </Box>
    </Box>
  );
}
