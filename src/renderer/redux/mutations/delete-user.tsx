import { api } from "../api/api";
import { processErrorIfPresent } from "../../lib/utils";
import {
  DeleteUserProfileResponse,
  ProfileType,
} from "@solomon-ai/component-library";

const DeleteUserProfile = api.injectEndpoints({
  endpoints: (builder) => ({
    deleteUser: builder.mutation({
      query: (req: { userId: string; profileType: ProfileType }) => ({
        url: `/v2/gateway/user/${req.userId}/type/${req.profileType}`,
        method: "DELETE",
      }),
      transformResponse: (response: DeleteUserProfileResponse) => {
        // processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { DeleteUserProfile };
export const { useDeleteUserMutation } = DeleteUserProfile;
