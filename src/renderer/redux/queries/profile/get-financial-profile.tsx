import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetFinancialProfileRequestClass,
  GetFinancialProfileResponseClass,
} from "@solomon-ai/component-library";

const GetFinancialProfile = api.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialProfile: builder.query({
      query: (req: GetFinancialProfileRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (response: GetFinancialProfileResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "FINANCIAL_PROFILE",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (req: GetFinancialProfileRequestClass) => {
  let url = `/v1/gateway/service/financials/analytics/finance-profile/user/${req.userId}`;

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

export { GetFinancialProfile };
export const { useGetFinancialProfileQuery } = GetFinancialProfile;
