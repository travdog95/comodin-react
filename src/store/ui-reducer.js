import { createSlice } from "@reduxjs/toolkit";

const uiInitialState = {
  modal: null, //{title: "Fancy Title", message: "Fancy message!"}
  auditEvents: [],
  notification: null, //{ type: constants.NOTIFICATION_TYPES, message: ""}
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
      state.auditEvents.push(action.payload);
    },
    showNotification(state, action) {
      state.notification = action.payload;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
