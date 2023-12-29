import {
  CreateSmartGoalRequest,
  CreateSmartGoalResponse,
} from "@solomon-ai/component-library";
import { api } from "../api/api";

const CreateSmartGoal = api.injectEndpoints({
  endpoints: (builder) => ({
    createSmartGoal: builder.mutation({
      query: (params: { body: CreateSmartGoalRequest }) => ({
        url: `/v1/gateway/financials/smart-goal`,
        method: "POST",
        body: JSON.stringify(params.body),
      }),
      transformResponse: (response: CreateSmartGoalResponse) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { CreateSmartGoal };
export const { useCreateSmartGoalMutation } = CreateSmartGoal;
