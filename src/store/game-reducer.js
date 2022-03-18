import { createSlice } from "@reduxjs/toolkit";

const gameInitialState = {
  moveableMarbles: [],
  clickableMarbles: [],
  currentPlayerId: 0,
  gameBoard: {},
  players: [],
  settings: {},
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
    updateGameBoard(state, action) {
      state.gameBoard = action.payload;
    },
    setPlayers(state, action) {
      state.players = action.payload;
    },
    setSettings(state, action) {
      state.settings = action.payload;
    },
    setCurrentPlayerId(state, action) {
      state.currentPlayerId = action.payload;
    },
  },
});

export const gameActions = gameSlice.actions;

export default gameSlice.reducer;
