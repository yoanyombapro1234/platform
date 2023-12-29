import {
  CreateAccountRequestClass,
  CreateAccountV2RequestClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";

const CreateUserAccount = api.injectEndpoints({
  endpoints: (builder) => ({
    createAccount: builder.mutation({
      query: (params: { body: CreateAccountRequestClass }) => ({
        url: `/v1/gateway/user/registration`,
        method: "POST",
        body: JSON.stringify(params.body),
      }),
      transformResponse: (response: { userId: number }) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

const CreateUserAccountV2 = api.injectEndpoints({
  endpoints: (builder) => ({
    createAccountV2: builder.mutation({
      query: (params: { body: CreateAccountV2RequestClass }) => ({
        url: `/v2/gateway/user/registration`,
        method: "POST",
        body: JSON.stringify(params.body),
      }),
      transformResponse: (response: { userId: number }) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { CreateUserAccount, CreateUserAccountV2 };
export const { useCreateAccountV2Mutation } = CreateUserAccountV2;
export const { useCreateAccountMutation } = CreateUserAccount;
