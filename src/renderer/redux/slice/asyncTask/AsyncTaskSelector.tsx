import { RootState } from "src/redux/store/store";

// selectTaskStatus selects the status of a given task
export const selectTaskStatus = (state: RootState, taskId: string): string =>
  state.asyncTaskState.statuses[taskId];
