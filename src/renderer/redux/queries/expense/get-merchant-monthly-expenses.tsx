import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetMerchantMonthlyExpenditureRequestClass,
  GetMerchantMonthlyExpenditureResponseClass,
} from "@solomon-ai/component-library";

const GetMerchantMonthlyExpenses = api.injectEndpoints({
  endpoints: (builder) => ({
    getMerchantMonthlyExpenses: builder.query({
      query: (req: GetMerchantMonthlyExpenditureRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (
        response: GetMerchantMonthlyExpenditureResponseClass,
      ) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "MERCHANT_MONTHLY_EXPENSES",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetMerchantMonthlyExpenditureRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/merchant-monthly-expenditure/user/${req.userId}`;
  if (req.month) {
    if (url.includes("?")) {
      url += `&month=${req.month}`;
    } else {
      url += `?month=${req.month}`;
    }
  }

  if (req.pageNumber) {
    if (url.includes("?")) {
      url += `&pageNumber=${req.pageNumber}`;
    } else {
      url += `?pageNumber=${req.pageNumber}`;
    }
  }

  if (req.pageSize) {
    if (url.includes("?")) {
      url += `&pageSize=${req.pageSize}`;
    } else {
      url += `?pageSize=${req.pageSize}`;
    }
  }

  return url;
};

export { GetMerchantMonthlyExpenses };
export const { useGetMerchantMonthlyExpensesQuery } =
  GetMerchantMonthlyExpenses;
