type AsyncTaskActionType = "ADD_TASK" | "UPDATE_TASK" | "DELETE_TASK";

export type AddAsyncTaskAction = {
  type: "ADD_TASK";
  payload: {
    taskstatus: string;
    taskid: string;
  };
};

export type UpdateAsyncTaskAction = {
  type: "UPDATE_TASK";
  payload: {
    taskstatus: string;
    taskid: string;
  };
};

export type DeleteAsyncTaskAction = {
  type: "DELETE_TASK";
  payload: {
    taskid: string;
  };
};
