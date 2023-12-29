// /v1/gateway/service/financials/analytics/debt-to-income-ratio/user/{{userID}}?pageNumber={{pageNumber}}&pageSize={{pageSize}}&month={{month}}

import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetDebtToIncomeRatioRequestClass,
  GetDebtToIncomeRatioResponseClass,
} from "@solomon-ai/component-library";

const GetDebtToIncomeRatio = api.injectEndpoints({
  endpoints: (builder) => ({
    getDebtToIncomeRatio: builder.query({
      query: (req: GetDebtToIncomeRatioRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetDebtToIncomeRatioResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "DEBT_TO_INCOME_RATIO",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetDebtToIncomeRatioRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/debt-to-income-ratio/user/${req.userId}`;

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

export { GetDebtToIncomeRatio };
export const { useGetDebtToIncomeRatioQuery } = GetDebtToIncomeRatio;
