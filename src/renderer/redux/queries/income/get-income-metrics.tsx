import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetIncomeMetricsRequestClass,
  GetIncomeMetricsResponseClass,
} from "@solomon-ai/component-library";

const GetIncomeMetrics = api.injectEndpoints({
  endpoints: (builder) => ({
    getIncomeMetrics: builder.query({
      query: (req: GetIncomeMetricsRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetIncomeMetricsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "INCOME_METRICS",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetIncomeMetricsRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/income/user/${req.userId}`;
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

export { GetIncomeMetrics };
export const { useGetIncomeMetricsQuery } = GetIncomeMetrics;
