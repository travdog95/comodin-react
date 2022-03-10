import { createSlice } from "@reduxjs/toolkit";

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
    addAuditEvent(state, action) {
      state.auditEvents.push(action.payload);
    },
    sendMessage(state, action) {
      state.sendMessage = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
