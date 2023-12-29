import {
  GetMelodyFinancialContextRequestClass,
  GetMelodyFinancialContextResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";
import { processErrorIfPresent } from "src/lib/utils";

const GetFinancialContext = api.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialContext: builder.query({
      query: (req: GetMelodyFinancialContextRequestClass) => ({
        url: `/v1/gateway/service/financials/analytics/melody-financial-context/user/${req.userId}`,
      }),
      transformResponse: (response: GetMelodyFinancialContextResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => {
        if (!result || !result.melodyFinancialContext) {
          return [];
        }

        return [
          {
            type: "FINANCIAL_CONTEXT",
            id: arg.userId,
          },
        ];
      },
    }),
  }),
  overrideExisting: false,
});

export { GetFinancialContext };
export const { useGetFinancialContextQuery } = GetFinancialContext;
