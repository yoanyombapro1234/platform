import { api } from "../api/api";

// TODO: fix this implementation
const RecordQuestionAgainstQuota = api.injectEndpoints({
  endpoints: (builder) => ({
    recordQuestionAgainstQuota: builder.mutation({
      query: (req: { userId: string }) => ({
        url: `/v1/gateway/financials/copilot/quota/question/{user_id}`,
        method: "POST",
        body: req,
      }),
      transformResponse: (response: any) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { RecordQuestionAgainstQuota };
export const { useRecordQuestionAgainstQuotaMutation } =
  RecordQuestionAgainstQuota;
