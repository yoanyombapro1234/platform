import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetMonthlySavingsRequestClass,
  GetMonthlySavingsResponseClass,
} from "@solomon-ai/component-library";

const GetMonthlySavings = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlySavings: builder.query({
      query: (req: GetMonthlySavingsRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetMonthlySavingsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "MONTHLY_SAVINGS",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetMonthlySavingsRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/monthly-savings/user/${req.userId}`;
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

export { GetMonthlySavings };
export const { useGetMonthlySavingsQuery } = GetMonthlySavings;
