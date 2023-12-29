import { CheckIfQuotaExceededResponse } from "@solomon-ai/component-library";
import { api } from "src/redux/api/api";

const CheckIfQuestionQuotaIsExceedeed = api.injectEndpoints({
  endpoints: (builder) => ({
    isQuestionQuotaExceeded: builder.query({
      query: (req: { userId: string }) => ({
        url: `/v1/gateway/financials/copilot/quota/exceeded/${req.userId}`,
      }),
      transformResponse: (response: CheckIfQuotaExceededResponse) => {
        // processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { CheckIfQuestionQuotaIsExceedeed };
export const { useIsQuestionQuotaExceededQuery } =
  CheckIfQuestionQuotaIsExceedeed;
