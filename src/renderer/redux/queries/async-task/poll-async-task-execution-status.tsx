import {
  PollAsyncTaskExecutionRequestClass,
  PollAsyncTaskExecutionResponseClass,
} from "@solomon-ai/component-library";
import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";

const PollAsyncTaskExecutionStatus = api.injectEndpoints({
  endpoints: (builder) => ({
    pollAsyncTaskStatus: builder.query({
      query: (req: PollAsyncTaskExecutionRequestClass) => ({
        url: `/v1/gateway/financials/async-tasks/task/${req.taskId}`,
      }),
      transformResponse: (response: PollAsyncTaskExecutionResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { PollAsyncTaskExecutionStatus };
export const { usePollAsyncTaskStatusQuery } = PollAsyncTaskExecutionStatus;
