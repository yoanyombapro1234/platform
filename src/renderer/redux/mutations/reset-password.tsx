import {
  ResetPasswordRequestClass,
  ResetPasswordResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";

const ResetPassword = api.injectEndpoints({
  endpoints: (builder) => ({
    resetPassword: builder.mutation({
      query: (req: ResetPasswordRequestClass) => ({
        url: `/v1/gateway/auth/reset-password`,
        method: "POST",
        body: req,
      }),
      transformResponse: (response: ResetPasswordResponseClass) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { ResetPassword };
export const { useResetPasswordMutation } = ResetPassword;
