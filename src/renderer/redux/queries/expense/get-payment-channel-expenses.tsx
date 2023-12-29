import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetPaymentChannelMonthlyExpenditureRequestClass,
  GetPaymentChannelMonthlyExpenditureResponseClass,
} from "@solomon-ai/component-library";

const GetPaymentChannelExpenses = api.injectEndpoints({
  endpoints: (builder) => ({
    getPaymentChannelMonthlyExpenses: builder.query({
      query: (req: GetPaymentChannelMonthlyExpenditureRequestClass) => ({
        url: buildEndpoint(req),
      }),
      transformResponse: (
        response: GetPaymentChannelMonthlyExpenditureResponseClass,
      ) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "PAYMENT_CHANNEL_EXPENSES",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const buildEndpoint = (
  req: GetPaymentChannelMonthlyExpenditureRequestClass,
) => {
  let url = `/v1/gateway/service/financials/analytics/payment-channel-monthly-expenditure/user/${req.userId}`;
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

export { GetPaymentChannelExpenses };
export const { useGetPaymentChannelMonthlyExpensesQuery } =
  GetPaymentChannelExpenses;
