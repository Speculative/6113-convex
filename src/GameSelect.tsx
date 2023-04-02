import { useState, useEffect } from "react";
import { useMutation, useQuery } from "../convex/_generated/react";
import { v4 as uuidv4 } from "uuid";
import { css } from "@emotion/react";
import {
  Box,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  Divider,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Game = {
  id: string;
  name: string;
  creator: string;
};

type GameSelectProps = {
  gameList: Game[];
  onAddGame: (game: Game) => void;
  onSelectGame: (gameId: string) => void;
};

export function GameSelect(props: GameSelectProps) {
  const [pageNumber, setPageNumber] = useState(0);
  const [createGameShown, setCreateGameShown] = useState(false);

  // Derived
  const emptyRows =
    pageNumber > 0
      ? Math.max(0, (1 + pageNumber) * 5 - props.gameList.length)
      : 0;

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
        <Box
          sx={css`
            display: flex;
            flex-direction: column;
            width: 100%;
            padding-left: 1rem;
            padding-right: 1rem;
            padding-bottom: 1rem;
          `}
        >
          <h1
            css={css`
              padding-top: 1rem;
              padding-bottom: 1rem;
            `}
          >
            Game Lobbies
          </h1>
          <Box
            sx={css`
              display: flex;
              flex-direction: column;
              width: 100%;
              flex-grow: 1;
              overflow: hidden;
            `}
          >
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setCreateGameShown(true)}
            >
              Create game
            </Button>
            <Box
              sx={css`
                margin-top: 1rem;
                margin-bottom: 1rem;
              `}
            >
              <Divider>or Join a Game</Divider>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Lobby name</TableCell>
                    <TableCell align="center">Owner</TableCell>
                    <TableCell align="right">Slots</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.gameList
                    .slice(pageNumber * 5, pageNumber * 5 + 5)
                    .map((game, i) => (
                      <TableRow
                        key={`${game.name}-${i}`}
                        sx={css`
                          cursor: pointer;
                        `}
                        onClick={() => props.onSelectGame(game.id)}
                        hover
                      >
                        <TableCell align="left">{game.name}</TableCell>
                        <TableCell align="center">{game.creator}</TableCell>
                        <TableCell align="right">4/5</TableCell>
                      </TableRow>
                    ))}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={3} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              component="div"
              page={pageNumber}
              onPageChange={(_, newPage) => setPageNumber(newPage)}
              rowsPerPage={5}
              rowsPerPageOptions={[5]}
              count={props.gameList.length}
            />
          </Box>
        </Box>
      </Paper>
      <Dialog open={createGameShown} onClose={() => setCreateGameShown(false)}>
        <form
          css={css`
            display: contents;
          `}
          onSubmit={(e) => {
            e.preventDefault();
            const form = new FormData(e.target as HTMLFormElement);

            const newGameId = uuidv4();
            setPageNumber(Math.floor(props.gameList.length / 5));
            setCreateGameShown(false);
            props.onAddGame({
              name: form.get("lobby") as string,
              creator: "Someone",
              id: newGameId,
            });
            props.onSelectGame(newGameId);
          }}
        >
          <DialogTitle>Create a lobby</DialogTitle>
          <DialogContent>
            <TextField
              label="Lobby name"
              name="lobby"
              margin="dense"
              fullWidth
              autoFocus
            />
          </DialogContent>
          <DialogActions>
            <Button type="submit">Create game</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
}
