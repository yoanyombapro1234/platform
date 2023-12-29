import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetMonthlyBalanceRequestClass,
  GetMonthlyBalanceResponseClass,
} from "@solomon-ai/component-library";
const GetMonthlyBalance = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyBalance: builder.query({
      query: (req: GetMonthlyBalanceRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetMonthlyBalanceResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => {
        if (!result?.monthlyBalances || !result.monthlyBalances) {
          return ["MONTHLY_ACCOUNT_BALANCE"];
        }

        return [
          {
            type: "MONTHLY_ACCOUNT_BALANCE",
            id: `page:${arg.userId}`,
          },
        ];
      },
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetMonthlyBalanceRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/monthly-balance/user/${req.userId}`;
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

export { GetMonthlyBalance };
export const { useGetMonthlyBalanceQuery } = GetMonthlyBalance;
