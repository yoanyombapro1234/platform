import {
  CheckEmailExistsResponseClass,
  ProfileType,
} from "@solomon-ai/component-library";
import { processErrorIfPresent } from "../../lib/utils";
import { api } from "../api/api";

const CheckEmailExists = api.injectEndpoints({
  endpoints: (builder) => ({
    checkEmailExists: builder.mutation({
      query: (req: { email: string; profileType: ProfileType }) => ({
        url: `/v2/gateway/user/email/${req.email}/exists/type/${req.profileType}`,
        method: "GET",
      }),
      transformResponse: (response: CheckEmailExistsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { CheckEmailExists };
export const { useCheckEmailExistsMutation } = CheckEmailExists;
