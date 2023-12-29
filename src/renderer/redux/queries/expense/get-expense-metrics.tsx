import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetExpenseMetricsRequestClass,
  GetExpenseMetricsResponseClass,
} from "@solomon-ai/component-library";

const GetExpenseMetrics = api.injectEndpoints({
  endpoints: (builder) => ({
    getExpenseMetrics: builder.query({
      query: (req: GetExpenseMetricsRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetExpenseMetricsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "EXPENSE_METRICS",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetExpenseMetricsRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/expenses/user/${req.userId}`;

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

export { GetExpenseMetrics };
export const { useGetExpenseMetricsQuery } = GetExpenseMetrics;
