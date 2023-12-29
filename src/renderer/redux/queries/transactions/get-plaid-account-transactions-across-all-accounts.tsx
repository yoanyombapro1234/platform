import { api } from "src/redux/api/api";
import {
  FinancialUserProfileType,
  PlaidAccountTransaction,
} from "@solomon-ai/component-library";

const GetPlaidAccountTransactionsAcrossAllAccounts = api.injectEndpoints({
  endpoints: (builder) => ({
    getPlaidAccountTransactionsAcrossAllAccounts: builder.query({
      query: (req: {
        userId: number;
        pageNumber: number;
        pageSize: number;
        profileType: FinancialUserProfileType;
      }) => ({
        url: `/v1/gateway/financials/list-transactions/all-accounts?userId=${req.userId}&pageNumber=${req.pageNumber}&pageSize=${req.pageSize}&profileType=${req.profileType}`,
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
          type: "ALL_ACCOUNT_TRANSACTIONS",
          id: `${arg.userId}}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export { GetPlaidAccountTransactionsAcrossAllAccounts };

export const { useGetPlaidAccountTransactionsAcrossAllAccountsQuery } =
  GetPlaidAccountTransactionsAcrossAllAccounts;
