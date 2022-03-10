import { configureStore } from "@reduxjs/toolkit";

import gameReducer from "./game-reducer";
import uiReducer from "./ui-reducer";

const store = configureStore({
  reducer: { game: gameReducer, ui: uiReducer },
});

export default store;
