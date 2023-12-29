import { api } from "../api/api";
import { processErrorIfPresent } from "../../lib/utils";
import {
  CheckUsernameExistsResponseClass,
  ProfileType,
} from "@solomon-ai/component-library";

const CheckUsernameExists = api.injectEndpoints({
  endpoints: (builder) => ({
    checkUsernameExists: builder.mutation({
      query: (req: { username: string; profileType: ProfileType }) => ({
        url: `/v2/gateway/user/username/${req.username}/exists/type/${req.profileType}`,
        method: "GET",
      }),
      transformResponse: (response: CheckUsernameExistsResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { CheckUsernameExists };
export const { useCheckUsernameExistsMutation } = CheckUsernameExists;
