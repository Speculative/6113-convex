import { useState, useEffect, useMemo } from "react";
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
import { Doc } from "../convex/_generated/dataModel";

import { useClientID } from "./id";
import { generateColors } from "./color";
import changeDirection from "../convex/changeDirection";

type GamePlayProps = {
  lobby: Doc<"lobbies">;
};

// https://stackoverflow.com/questions/36862334/get-viewport-window-height-in-reactjs
function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function useWindowDimensions() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowDimensions;
}

export function GamePlay({ lobby }: GamePlayProps) {
  const clientID = useClientID();
  const localPlayer = useQuery("getPlayerByClientID", { clientID });

  const { width, height } = useWindowDimensions();
  const windowSize = Math.min(width, height);

  const lobbyMembers = useQuery("listLobbyMembers", { lobby: lobby._id });

  const playerColors = useMemo(() => {
    if (!lobbyMembers) {
      return {};
    }

    const colors = generateColors(lobbyMembers.length, lobby._id.toString());
    return Object.fromEntries(
      lobbyMembers.map((player, i) => [player._id, colors[i]])
    );
  }, [lobbyMembers, lobby]);

  const gameState = useQuery("getGameState", { lobby: lobby._id });
  const onChangeDirection = useMutation("changeDirection");
  if (!gameState) {
    return <div>Loading...</div>;
  }

  console.log(gameState.playerDirection);

  return (
    <div
      css={css`
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
      `}
      tabIndex={0}
      autoFocus
      onKeyDown={(e) => {
        switch (e.code) {
          case "ArrowUp":
            onChangeDirection({
              lobby: lobby._id,
              player: localPlayer._id,
              direction: "north",
            });
            break;
          case "ArrowDown":
            onChangeDirection({
              lobby: lobby._id,
              player: localPlayer._id,
              direction: "south",
            });
            break;
          case "ArrowRight":
            onChangeDirection({
              lobby: lobby._id,
              player: localPlayer._id,
              direction: "east",
            });
            break;
          case "ArrowLeft":
            onChangeDirection({
              lobby: lobby._id,
              player: localPlayer._id,
              direction: "west",
            });
            break;
        }
      }}
    >
      <div
        css={css`
          position: absolute;
          top: 0;
          right: 0;
        `}
      >
        {gameState.ticks}
      </div>
      <div
        css={css`
          height: ${windowSize}px;
          width: ${windowSize}px;
          margin-left: auto;
          margin-right: auto;

          display: grid;
          grid-gap: 2px;
          grid-template-rows: repeat(30, auto);
          grid-template-columns: repeat(30, auto);

          background: black;
          border: 2px solid black;
        `}
      >
        {[...Array(30).keys()].flatMap((row) =>
          [...Array(30).keys()].map((col) => (
            <div
              key={`${row}-${col}`}
              css={css`
                grid-area: ${row + 1} / ${col + 1} / ${row + 2} / ${col + 2};
                background: white;
                width: 100%;
                height: 100%;
              `}
            ></div>
          ))
        )}
        {Array.from(gameState.playerPosition.entries()).flatMap(
          ([playerID, positions]) =>
            positions.map(({ row, col }) => (
              <div
                key={`${playerID}-${row}-${col}`}
                css={css`
                  grid-area: ${row + 1} / ${col + 1} / ${row + 2} / ${col + 2};
                  background: ${playerColors[playerID]};
                  width: 100%;
                  height: 100%;
                `}
              ></div>
            ))
        )}
      </div>
    </div>
  );
}
