import { api } from "src/redux/api/api";
import { UserAccount } from "@solomon-ai/component-library";

const GetUserAccountByEmailOrUsername = api.injectEndpoints({
  endpoints: (builder) => ({
    GetUserAccountByEmailOrUsername: builder.query({
      query: (req: { profileType: string; email: string }) => ({
        // {{baseUrl}}
        url: `/v2/gateway/user/account?profileType=${req.profileType}&email=${req.email}`,
      }),
      transformResponse: (response: {
        userAccount: UserAccount;
        ssoToken: string;
      }) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { GetUserAccountByEmailOrUsername };
export const { useGetUserAccountByEmailOrUsernameQuery } =
  GetUserAccountByEmailOrUsername;
