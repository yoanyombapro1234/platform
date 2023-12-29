import {
  RequestPasswordResetRequestClass,
  RequestPasswordResetResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";
import { processErrorIfPresent } from "src/lib/utils";

const RequestPasswordChange = api.injectEndpoints({
  endpoints: (builder) => ({
    requestPasswordChange: builder.mutation({
      query: (req: RequestPasswordResetRequestClass) => ({
        url: `/v1/gateway/auth/request-password-change`,
        method: "POST",
        body: req,
      }),
      transformResponse: (response: RequestPasswordResetResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { RequestPasswordChange };
export const { useRequestPasswordChangeMutation } = RequestPasswordChange;
