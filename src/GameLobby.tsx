import { useMemo } from "react";
import { useMutation, useQuery } from "../convex/_generated/react";
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
import { Doc } from "../convex/_generated/dataModel";

import { useClientID } from "./id";
import { generateColors } from "./color";

type GameLobbyProps = {
  lobby: Doc<"lobbies">;
};

export function GameLobby({ lobby }: GameLobbyProps) {
  const clientID = useClientID();
  const localPlayer = useQuery("getPlayerByClientID", { clientID });

  const lobbyMembers = useQuery("listLobbyMembers", { lobby: lobby._id });
  const onLeaveLobby = useMutation("leaveLobby");
  const onStartGame = useMutation("startGame");

  const playerColors = useMemo(() => {
    if (!lobbyMembers) {
      return {};
    }

    const colors = generateColors(lobbyMembers.length, lobby._id.toString());
    return Object.fromEntries(
      lobbyMembers.map((player, i) => [player._id, colors[i]])
    );
  }, [lobbyMembers, lobby]);

  if (!lobbyMembers) {
    return <div>Loading...</div>;
  }

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
            onClick={() =>
              onLeaveLobby({
                player: localPlayer._id,
              })
            }
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
        <Typography variant="h2">{lobby.lobbyName}</Typography>
        <List
          css={css`
            flex-grow: 1;
            overflow-y: auto;
          `}
        >
          {lobbyMembers.map((player) => (
            <ListItem key={player._id.toString()}>
              <ListItemText
                css={css`
                  color: ${playerColors[player._id]};
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
          disabled={lobby.creator.toString() !== localPlayer._id.toString()}
          onClick={() => {
            onStartGame({
              lobby: lobby._id,
            });
          }}
        >
          Play game
        </Button>
      </Box>
    </Box>
  );
}
