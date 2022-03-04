import { createSlice, configureStore } from "@reduxjs/toolkit";

const gameInitialState = {
  moveableMarbles: [],
  clickableMarbles: [],
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
  },
});

const uiInitialState = {
  showModal: null, //{title: "Fancy Title", message: "Fancy message!"}
  auditEvents: [],
  sendMessage: null, //{ type: "Error", className: "error", message: ""}
};

const uiSlice = createSlice({
  name: "ui",
  initialState: uiInitialState,
  reducers: {
    showModal(state, action) {
      state.showModal = action.payload;
    },
    auditEvents(state, action) {
      state.auditEvents = action.payload;
    },
    sendMessage(state, action) {
      state.sendMessage = action.payload;
    },
  },
});

const store = configureStore({
  reducer: { game: gameSlice.reducer, ui: uiSlice.reducer },
});

export const gameActions = gameSlice.actions;
export const uiActions = uiSlice.actions;

export default store;
