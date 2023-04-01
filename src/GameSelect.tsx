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
  TableFooter,
  TablePagination,
  Divider,
  Paper,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

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

type Game = {
  name: string;
  creator: string;
};

export function GameSelect() {
  const [pageNumber, setPageNumber] = useState(0);

  // Fakes, replace with Convex
  const [games, setGames] = useState<Game[]>([
    {
      name: "A Game",
      creator: "Someone",
    },
    {
      name: "Another Game 0",
      creator: "Someone",
    },
    {
      name: "Another Game 1",
      creator: "Someone",
    },
    {
      name: "Another Game 2",
      creator: "Someone",
    },
    {
      name: "Another Game 3",
      creator: "Someone",
    },
    {
      name: "Another Game 4",
      creator: "Someone",
    },
    {
      name: "Another Game 5",
      creator: "Someone",
    },
    {
      name: "Another Game 6",
      creator: "Someone",
    },
    {
      name: "Another Game 7",
      creator: "Someone",
    },
    {
      name: "Another Game 8",
      creator: "Someone",
    },
    {
      name: "Yet Another Game",
      creator: "Someone",
    },
  ]);

  // Derived
  const emptyRows =
    pageNumber > 0 ? Math.max(0, (1 + pageNumber) * 5 - games.length) : 0;

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
            <Button variant="contained" startIcon={<AddIcon />}>
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
                  {games
                    .slice(pageNumber * 5, pageNumber * 5 + 5)
                    .map((game, i) => (
                      <TableRow
                        key={`${game.name}-${i}`}
                        sx={css`
                          cursor: pointer;
                        `}
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
              count={games.length}
            />
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
