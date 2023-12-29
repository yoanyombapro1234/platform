import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetIncomeExpenseRatioRequestClass,
  GetIncomeExpenseRatioResponseClass,
} from "@solomon-ai/component-library";

const GetIncomeExpenseRatio = api.injectEndpoints({
  endpoints: (builder) => ({
    getIncomeExpenseRatio: builder.query({
      query: (req: GetIncomeExpenseRatioRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetIncomeExpenseRatioResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "INCOME_EXPENSE_RATIO",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetIncomeExpenseRatioRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/income-expense-ratio/user/${req.userId}`;

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

export { GetIncomeExpenseRatio };
export const { useGetIncomeExpenseRatioQuery } = GetIncomeExpenseRatio;
