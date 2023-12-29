import { api } from "src/redux/api/api";
import {
  FinancialAccountType,
  FinancialUserProfileType,
  PlaidAccountTransaction,
} from "@solomon-ai/component-library";

const GetPlaidAccountTransactionsForBankAccount = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlaidAccountTransactionsForBankAccount: builder.query({
      query: (req: {
        userId: number;
        accountId: number;
        pageNumber: number;
        pageSize: number;
        financialAccountType: FinancialAccountType;
        profileType: FinancialUserProfileType;
      }) => ({
        url: `/v1/gateway/financials/list-transactions?accountId=${req.accountId}&userId=${req.userId}&pageNumber=${req.pageNumber}&pageSize=${req.pageSize}&financialAccountType=${req.financialAccountType}&profileType=${req.profileType}`,
      }),
      transformResponse: (response: {
        nextPage: string;
        transactions: PlaidAccountTransaction[];
      }) => {
        // TODO: associate a type to this please
        // processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "BANK_ACCOUNT_TRANSACTIONS",
          id: `${arg.accountId}}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export { GetPlaidAccountTransactionsForBankAccount };

export const { useGetPlaidAccountTransactionsForBankAccountQuery } =
  GetPlaidAccountTransactionsForBankAccount;
