import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetTransactionsForBankAccountRequestClass,
  GetTransactionsForBankAccountResponseClass,
} from "@solomon-ai/component-library";

const GetTransactionsForBankAccount = api.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionsForBankAccount: builder.query({
      query: (req: GetTransactionsForBankAccountRequestClass) => ({
        url: `/v1/gateway/service/financials/analytics/transactions/user/${req.userId}/plaidAccountId/${req.plaidAccountId}/pageNumber/${req.pageNumber}/pageSize/${req.pageSize}`,
      }),
      transformResponse: (
        response: GetTransactionsForBankAccountResponseClass
      ) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "BANK_ACCOUNT_TRANSACTIONS",
          id: `${arg.plaidAccountId}}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export { GetTransactionsForBankAccount };

export const { useGetTransactionsForBankAccountQuery } =
  GetTransactionsForBankAccount;
