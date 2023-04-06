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

import { useClientID } from "./id";

export function GameSelect() {
  const clientID = useClientID();
  const localPlayer = useQuery("getPlayerByClientID", { clientID });
  const lobbyList = useQuery("listLobbies");
  const onCreateLobby = useMutation("createLobby");
  const onSelectLobby = useMutation("joinLobby");
  const [pageNumber, setPageNumber] = useState(0);
  const [createGameShown, setCreateGameShown] = useState(false);

  // Derived
  const emptyRows =
    (lobbyList && Math.max(0, (1 + pageNumber) * 5 - lobbyList.length)) || 5;

  if (!lobbyList) {
    return <div>Loading...</div>;
  }

  return (
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
        <Box
          css={css`
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
            css={css`
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
              css={css`
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
                  {lobbyList
                    .slice(pageNumber * 5, pageNumber * 5 + 5)
                    .map((lobby, i) => (
                      <TableRow
                        key={lobby._id}
                        css={css`
                          cursor: pointer;
                        `}
                        onClick={() =>
                          onSelectLobby({
                            lobby: lobby._id,
                            player: localPlayer._id,
                          })
                        }
                        hover
                      >
                        <TableCell align="left">{lobby.lobbyName}</TableCell>
                        <TableCell align="center">
                          {lobby.creatorName}
                        </TableCell>
                        <TableCell align="right">{lobby.playerCount}</TableCell>
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
              count={lobbyList.length}
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

            setPageNumber(Math.floor(lobbyList.length / 5));
            setCreateGameShown(false);
            // Add game, set user in game
            onCreateLobby({
              lobbyName: form.get("lobby"),
              creator: localPlayer._id,
            });
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
