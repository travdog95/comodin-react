import { createSlice } from "@reduxjs/toolkit";

const gameInitialState = {
  moveableMarbles: [],
  clickableMarbles: [],
  discardedCard: {},
  currentPlayerId: 1,
  gameBoard: {},
  players: {},
};

const gameSlice = createSlice({
  name: "game",
  initialState: gameInitialState,
  reducers: {
    setMoveableMarbles(state, action) {
      state.moveableMarbles = action.payload;
    },
    setClickableMarbles(state, action) {
      state.clickableMarbles = action.payload;
    },
    setDiscardedCard(state, action) {
      state.discardedCard = action.payload;
    },
    setNextPlayerTurn(state, action) {
      state.currentPlayerId = action.payload;
    },
    updateGameBoard(state, action) {
      state.gameBoard = action.payload;
    },
    updatePlayers(state, action) {
      state.players = action.payload;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;
