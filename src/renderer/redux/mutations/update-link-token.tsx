import {
  PlaidInitiateTokenUpdateRequestClass,
  PlaidInitiateTokenUpdateResponseClass,
} from "@solomon-ai/component-library";
import { api } from "../api/api";
import { processErrorIfPresent } from "src/lib/utils";

/**
 * The `UpdateLinkToken` function is a Redux Toolkit Query API endpoint injector.
 * It extends the API slice defined in the imported 'api' module with a new 'updateLinkToken' mutation endpoint.
 *
 * This endpoint is for initiating a token update with the Plaid API. It takes a `PlaidInitiateTokenUpdateRequestClass`
 * object as an argument which should contain the necessary information for the token update.
 *
 * The 'updateLinkToken' mutation sends a POST request to the '/financials/initiate-token-update' API endpoint,
 * and expects a `PlaidInitiateTokenUpdateResponseClass` object as a response.
 *
 * If there is an error message in the response, it will be processed by the `processErrorIfPresent` utility function.
 *
 * The `UpdateLinkToken` function can be beneficial in larger applications that have many endpoints,
 * by allowing you to inject additional endpoints after setting up the initial service definition, thus keeping your initial
 * bundle size small.
 *
 * The `overrideExisting` option is set to 'false' which means that if an endpoint with the same name already
 * exists, it won't be overridden by this injector.
 *
 * This function also exports a React hook named `useUpdateLinkTokenMutation` that allows components to trigger
 * this mutation.
 */
const UpdateLinkToken = api.injectEndpoints({
  endpoints: (builder) => ({
    updateLinkToken: builder.mutation({
      query: (req: PlaidInitiateTokenUpdateRequestClass) => ({
        url: `/v1/gateway/financials/initiate-token-update`,
        method: "POST",
        body: req,
      }),
      transformResponse: (response: PlaidInitiateTokenUpdateResponseClass) => {
        processErrorIfPresent(response.error_message);
        return response;
      },
    }),
  }),
  overrideExisting: false,
});

export { UpdateLinkToken };
export const { useUpdateLinkTokenMutation } = UpdateLinkToken;
