import { useState, useEffect } from "react";
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
import { Player } from "./GameSelect";
import { useMutation } from "../convex/_generated/react";

type GamePlayProps = {
  lobbyName: string;
  gameId: string;
  player: Player;
};

type PlayerState = {
  direction: "north" | "south" | "east" | "west";
  // row, col
  positions: [number, number][];
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

export function GamePlay(props: GamePlayProps) {
  const [playerState, setPlayerState] = useState<PlayerState>({
    direction: props.player.direction,
    positions: props.player.positions,
  });
  const updatePlayerMutation = useMutation("updatePlayerState");
  let pid = props.player.id;
  let gid = props.gameId;

  useEffect(() => {
    const interval = setInterval(() => {
      setPlayerState((playerState) => {
        const newPositions = playerState.positions.slice(1);
        const [lastRow, lastCol] =
          playerState.positions[playerState.positions.length - 1];
        const newPosition =
          playerState.direction === "north"
            ? [lastRow - 1, lastCol]
            : playerState.direction === "south"
              ? [lastRow + 1, lastCol]
              : playerState.direction === "west"
                ? [lastRow, lastCol - 1]
                : [lastRow, lastCol + 1];

        // looping logic at the grid borders. TODO: make constants for dimensions
        if (newPosition[0] > 29) {
          newPosition[0] = 0;
        }
        if (newPosition[1] > 29) {
          newPosition[1] = 0;
        }
        if (newPosition[0] < 0) {
          newPosition[0] = 29;
        }
        if (newPosition[1] < 0) {
          newPosition[1] = 29;
        }
        newPositions.push(newPosition as [number, number]);

        let finalPlayerState = {
          ...playerState,
          positions: newPositions,
        };
        updatePlayerMutation({ gameId: gid, playerId: pid, playerState: finalPlayerState });
        return finalPlayerState;
      });
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const { width, height } = useWindowDimensions();
  const windowSize = Math.min(width, height);

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
      onKeyDown={(e) => {
        // console.log(e);
        switch (e.code) {
          case "ArrowUp":
            setPlayerState({
              ...playerState,
              direction: "north",
            });
            break;
          case "ArrowDown":
            setPlayerState({
              ...playerState,
              direction: "south",
            });
            break;
          case "ArrowRight":
            setPlayerState({
              ...playerState,
              direction: "east",
            });
            break;
          case "ArrowLeft":
            setPlayerState({
              ...playerState,
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
        {JSON.stringify(playerState)}
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
        {playerState.positions.map(([row, col]) => (
          <div
            key={`${row}-${col}`}
            css={css`
              grid-area: ${row + 1} / ${col + 1} / ${row + 2} / ${col + 2};
              background: red;
              width: 100%;
              height: 100%;
            `}
          ></div>
        ))}
      </div>
    </div>
  );
}
