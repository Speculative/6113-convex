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

import { GameSelect, Game, Player } from "./GameSelect";
import { GameLobby } from "./GameLobby";
import { GamePlay } from "./GamePlay";

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

function convert(data: string | any[] | undefined): Game[] {
  if (data === undefined || data.length == 0) {
    return [];
  } else {
    var games = []
    for (var i = 0; i < data.length; i++) {
      var game = {
        id: data[i].id,
        name: data[i].name,
        creator: data[i].creator,
        status: data[i].status,
        players : data[i].players? data[i].players.map((p: any) => {return {id: p.id, name: p.name, direction: p.direction, positions: p.positions}}) : []
      }
      games.push(game)
    }
    return games;
  }
}


export default function App() {
  
  const id = useID();
  const [name, setName] = useState<string | null>(null);
  const [currentGameId, setCurrentGameId] = useState<string | null>(null);
  let temp = useQuery("listGames");
  let data = convert(temp);
  const [games, setGames] = useState<Game[]>(data);
  useEffect(() => {
    // console.log('Games data updated:', temp);
    setGames(convert(temp));
  }, [temp]);

  const addPlayer = useMutation("addPlayer");
  const createGame = useMutation("createGame");
  const updateGameStatus = useMutation("updateGameStatus");
  if (temp === undefined) {
    return <div>Loading...</div>;
  }
  
  const currentGame = games.find((g) => g.id === currentGameId);

  return currentGame && currentGame.players.findIndex((p) => p.id === id) !== -1 
    && currentGame.status === "playing" ? (
    <GamePlay 
      lobbyName={games.find((g) => g.id === currentGameId)!.name}
      gameId = {currentGame.id}
      player = {currentGame.players.find((p) => p.id === id)!}
     />
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
        {name === null ? (
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
        ) : currentGameId === null ? (
          <GameSelect
            gameList={games}
            onSelectGame={(gameId) => setCurrentGameId(gameId)}
            onAddGame={(game) => {
              createGame({game});
              // immediately adding the game to the list to avoid waiting. 
              // It's going to be refreshed with the same value anyway
              setGames([...games, game]);
            }}
          />
        ) : (
          <GameLobby
            lobbyName={games.find((g) => g.id === currentGameId)!.name}
            onStartGame={() => {
              const gameIndex = games.findIndex((g) => g.id === currentGameId);
              const gameToStart = games[gameIndex];
              let newPlayer: Player = {
                id: id? id : "unknown",
                name: name,
                direction: "east",
                positions: [[0, 0]],
              }

              if (gameToStart.players.find((p) => p.id === newPlayer.id) === undefined) {
                addPlayer({
                  gameId: gameToStart.id,
                  player: newPlayer,
                });
                gameToStart.players.push(newPlayer);
              }
              
              updateGameStatus({
                gameId: gameToStart.id,
                gameStatus: "playing",
              });
              setGames([
                ...games.slice(0, gameIndex),
                {
                  ...gameToStart,
                  status: "playing",
                },
                ...games.slice(gameIndex + 1),
              ]);
            }}
            players = {games.find((g) => g.id === currentGameId)!.players}
            onLeaveGame={() => setCurrentGameId(null)}
          />
        )}
      </Paper>
    </Box>
  );
}
