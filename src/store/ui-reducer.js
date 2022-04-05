import { createSlice } from "@reduxjs/toolkit";

let eventData = [];
for (let i = 0; i < 50; i++) {
  eventData.push("Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sint, eum?");
}
const uiInitialState = {
  modal: null, //{title: "Fancy Title", message: "Fancy message!"}
  auditEvents: [],
};

const uiSlice = createSlice({
  name: "ui",
  initialState: uiInitialState,
  reducers: {
    showModal(state, action) {
      state.modal = action.payload;
    },
    auditEvents(state, action) {
      state.auditEvents = action.payload;
    },
    addAuditEvent(state, action) {
      state.auditEvents.unshift(action.payload);
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
