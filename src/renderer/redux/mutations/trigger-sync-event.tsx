import {
  TriggerSyncRequestClass,
  TriggerSyncResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";

const TriggerSyncEvent = api.injectEndpoints({
  endpoints: (builder) => ({
    triggerSyncEvent: builder.mutation({
      query: (req: {
        userId: string;
        linkId: string;
        financialAccountType: string;
        profileType: string;
      }) => ({
        url: `/v1/gateway/financials/sync/trigger`,
        method: "POST",
        body: req,
      }),
      transformResponse: (response: TriggerSyncResponseClass) => {
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { TriggerSyncEvent };
export const { useTriggerSyncEventMutation } = TriggerSyncEvent;
