import { api } from "../../api/api";
import { GetUpdatedUserAccountResponseClass } from "@solomon-ai/component-library";
import { processErrorIfPresent } from "src/lib/utils";

const GetUpdatedUserProfile = api.injectEndpoints({
  endpoints: (builder) => ({
    getUpdatedUserProfile: builder.query({
      query: (req: { userId: number }) => ({
        url: `/v1/gateway/user/${req.userId}`,
      }),
      transformResponse: (response: GetUpdatedUserAccountResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
      keepUnusedDataFor: 0,
    }),
  }),
  overrideExisting: false,
});

export const { useGetUpdatedUserProfileQuery } = GetUpdatedUserProfile;
