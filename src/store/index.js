import { createStore } from "redux";
import { createSlice, createSllice } from "@reduxjs/toolkit";

const initialState = {
  moveableMarbles: [],
  clickableMarbles: [],
};

createSlice({ name: })
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case "set-moveable-marbles":
      return {
        moveableMarbles: action.marbles,
        clickableMarbles: state.clickableMarbles,
      };
    case "set-clickable-marbles":
      return {
        clickableMarbles: action.marbles,
        moveableMarbles: state.moveableMarbles,
      };
  }

  return state;
};

const store = createStore(gameReducer);

export default store;
