import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetTransactionAggregatesRequestClass,
  GetTransactionAggregatesResponseClass,
} from "@solomon-ai/component-library";

const GetMonthlyAggregatedTransactionCounts = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyAggregatedTransactionCounts: builder.query({
      query: (req: GetTransactionAggregatesRequestClass) => ({
        url: getMonthlyAggregatedTransactionCountsEndpoint(req),
      }),
      transformResponse: (response: GetTransactionAggregatesResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "TRANSACTION_AGGREGATES_BY_MONTH",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const getMonthlyAggregatedTransactionCountsEndpoint = (
  req: GetTransactionAggregatesRequestClass,
) => {
  let url = `/v1/gateway/service/financials/analytics/transaction-aggregates/${req.userId}`;

  if (req.month) {
    if (url.includes("?")) {
      url += `&month=${req.month}`;
    } else {
      url += `?month=${req.month}`;
    }
  }

  if (req.personalFinanceCategoryPrimary) {
    if (url.includes("?")) {
      url += `&personalFinanceCategoryPrimary=${req.personalFinanceCategoryPrimary}`;
    } else {
      url += `?personalFinanceCategoryPrimary=${req.personalFinanceCategoryPrimary}`;
    }
  }

  if (req.locationCity) {
    if (url.includes("?")) {
      url += `&locationCity=${req.locationCity}`;
    } else {
      url += `?locationCity=${req.locationCity}`;
    }
  }

  if (req.paymentChannel) {
    if (url.includes("?")) {
      url += `&paymentChannel=${req.paymentChannel}`;
    } else {
      url += `?paymentChannel=${req.paymentChannel}`;
    }
  }

  if (req.merchantName) {
    if (url.includes("?")) {
      url += `&merchantName=${req.merchantName}`;
    } else {
      url += `?merchantName=${req.merchantName}`;
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

export { GetMonthlyAggregatedTransactionCounts };
export const { useGetMonthlyAggregatedTransactionCountsQuery } =
  GetMonthlyAggregatedTransactionCounts;
