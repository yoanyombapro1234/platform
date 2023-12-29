import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";
import {
  GetUserCategoryMonthlyExpenditureRequestClass,
  GetUserCategoryMonthlyExpenditureResponseClass,
} from "@solomon-ai/component-library";

/**
 * Get monthly category expenditure
 *
 * url: {{baseUrl}}/v1/gateway/service/financials/analytics/category-monthly-expenditure/user/{{userID}}?personalFinanceCategoryPrimary={{personalFinanceCategoryPrimary}}&month={{month}}&pageNumber={{pageNumber}}&pageSize={{pageSize}}
 */
const GetMonthlyCategoryExpenditure = api.injectEndpoints({
  endpoints: (builder) => ({
    getMonthlyCategoryExpenditure: builder.query({
      query: (req: GetUserCategoryMonthlyExpenditureRequestClass) => ({
        url: getMonthlyCategoryExpenditureEndpoint(req),
      }),
      transformResponse: (
        response: GetUserCategoryMonthlyExpenditureResponseClass,
      ) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "MONTHLY_CATEGORY_EXPENDITURES",
          id: `user:${arg.userId}`,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

const getMonthlyCategoryExpenditureEndpoint = (
  req: GetUserCategoryMonthlyExpenditureRequestClass,
): string => {
  let url = `/v1/gateway/service/financials/analytics/category-monthly-expenditure/user/${req.userId}`;
  if (req.personalFinanceCategoryPrimary) {
    url += `?personalFinanceCategoryPrimary=${req.personalFinanceCategoryPrimary}`;
  }

  if (req.month) {
    // check if the url contains a query param already
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

export { GetMonthlyCategoryExpenditure };
export const { useGetMonthlyCategoryExpenditureQuery } =
  GetMonthlyCategoryExpenditure;
