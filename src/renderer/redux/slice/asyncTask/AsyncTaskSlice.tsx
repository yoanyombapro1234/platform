import { createSlice } from "@reduxjs/toolkit";
import { InitialAsyncTaskState } from "./AsyncTaskState";
import {
  addAsyncTask,
  clearAsyncTasks,
  deleteAsyncTask,
  setAsyncTasks,
  updateAsyncTask,
} from "./AsyncTaskReducer";

const asyncTaskSlice = createSlice({
  name: "asyncTask",
  initialState: InitialAsyncTaskState,
  reducers: {
    setAsyncTasks,
    clearAsyncTasks,
    addAsyncTask,
    updateAsyncTask,
    deleteAsyncTask,
  },
});

export const {
  setAsyncTasks: setAsyncTasksAction,
  clearAsyncTasks: clearAsyncTasksAction,
  addAsyncTask: addAsyncTaskAction,
  updateAsyncTask: updateAsyncTaskAction,
  deleteAsyncTask: deleteAsyncTaskAction,
} = asyncTaskSlice.actions;

export default asyncTaskSlice.reducer;
