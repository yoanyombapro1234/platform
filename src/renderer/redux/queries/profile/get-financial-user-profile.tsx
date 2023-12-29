import {
  ErrorResponse,
  FinancialUserProfile,
  FinancialUserProfileType,
  GetUserProfileResponse,
  MelodyFinancialContext,
} from "@solomon-ai/component-library";
import { cacheFinancialUserData } from "src/components/form/login-form";
import { processErrorIfPresent } from "src/lib/utils";
import { api } from "src/redux/api/api";

class GetFinancialUserProfileResponseClass
  extends ErrorResponse
  implements GetUserProfileResponse
{
  profile: FinancialUserProfile = {} as FinancialUserProfile;
  financialContext: MelodyFinancialContext = {} as MelodyFinancialContext;

  constructor(data: Partial<GetUserProfileResponse>) {
    super();
    if (data) {
      Object.assign(this, {
        ...data,
      });
    }
  }
}

const GetFinancialUserProfile = api.injectEndpoints({
  endpoints: (builder) => ({
    getFinancialUserProfile: builder.query({
      query: (req: {
        userId: string;
        profileType: FinancialUserProfileType;
      }) => ({
        url: `/v1/gateway/financials/profile/${req.userId}?profileType=${req.profileType}`,
      }),
      transformResponse: (response: GetFinancialUserProfileResponseClass) => {
        processErrorIfPresent(response.error_message);
        cacheFinancialUserData(response.profile, response.financialContext);
        return response;
      },
      providesTags: (result, error, arg) => [
        {
          type: "FINANCIAL_USER_PROFILE",
          id: arg.userId,
        },
      ],
    }),
  }),
  overrideExisting: false,
});

export { GetFinancialUserProfile };
export const { useGetFinancialUserProfileQuery } = GetFinancialUserProfile;
