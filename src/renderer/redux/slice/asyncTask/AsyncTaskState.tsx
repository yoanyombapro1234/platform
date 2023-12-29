export interface AsyncTaskState {
  statuses: Record<string, string>; // Mapping of task IDs to their statuses
}

export const InitialAsyncTaskState: AsyncTaskState = {
  statuses: {},
};
