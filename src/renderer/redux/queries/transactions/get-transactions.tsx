import {
  GetTransactionsRequestClass,
  GetTransactionsResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../../api/api";
import { processErrorIfPresent } from "src/lib/utils";

const GetTransactions = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: (req: GetTransactionsRequestClass) => ({
        url: `/v1/gateway/service/financials/transactions/${req.userId}/pageNumber/${req.pageNumber}/pageSize/${req.pageSize}`,
      }),
      transformResponse: (response: GetTransactionsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "TRANSACTIONS",
          id: `${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export { GetTransactions };
export const { useGetTransactionsQuery } = GetTransactions;
