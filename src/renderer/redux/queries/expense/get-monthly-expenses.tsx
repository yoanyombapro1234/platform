import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetMonthlyExpenditureRequestClass,
  GetMonthlyExpenditureResponseClass,
} from "@solomon-ai/component-library";

const GetMonthlyExpenses = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyExpenses: builder.query({
      query: (req: GetMonthlyExpenditureRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetMonthlyExpenditureResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "MONTHLY_EXPENSES",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetMonthlyExpenditureRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/monthly-expenditure/user/${req.userId}`;
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

export { GetMonthlyExpenses };
export const { useGetMonthlyExpensesQuery } = GetMonthlyExpenses;
