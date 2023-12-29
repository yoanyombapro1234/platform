import { CaseReducer, PayloadAction } from "@reduxjs/toolkit";
import { AsyncTaskState, InitialAsyncTaskState } from "./AsyncTaskState";
import { AddAsyncTaskAction } from "./AsyncActions";

export const setAsyncTasks: CaseReducer<
  AsyncTaskState,
  PayloadAction<AsyncTaskState>
> = (state, action) => {
  state.statuses = action.payload.statuses;
  return state;
};

export const clearAsyncTasks: CaseReducer<
  AsyncTaskState,
  PayloadAction<AsyncTaskState>
> = (state, action) => {
  state = InitialAsyncTaskState;
  return state;
};

export const addAsyncTask: CaseReducer<
  AsyncTaskState,
  PayloadAction<{
    taskstatus: string;
    taskid: string;
  }>
> = (state, action) => {
  const { taskid, taskstatus } = action.payload;
  state.statuses[taskid] = taskstatus;
  return state;
};

export const updateAsyncTask: CaseReducer<
  AsyncTaskState,
  PayloadAction<{
    taskstatus: string;
    taskid: string;
  }>
> = (state, action) => {
  const { taskid, taskstatus } = action.payload;
  state.statuses[taskid] = taskstatus;
  return state;
};

export const deleteAsyncTask: CaseReducer<
  AsyncTaskState,
  PayloadAction<{
    taskid: string;
  }>
> = (state, action) => {
  const { taskid } = action.payload;
  delete state.statuses[taskid];
  return state;
};
