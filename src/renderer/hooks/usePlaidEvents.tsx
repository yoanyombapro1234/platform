import {
  FinancialUserProfileType,
  PlaidExchangeTokenRequestClass,
  UserAccountClass,
} from "@solomon-ai/component-library";
import { useCallback } from "react";
import {
  PlaidLinkError,
  PlaidLinkOnEventMetadata,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastAction } from "src/components/ui/toast";
import { toast } from "src/components/ui/use-toast";
import { routes } from "src/constant/routes";
import { mixPanelClient } from "src/lib/mixpanel";
import { logEvent, logExit, logSuccess } from "src/lib/utils";
import { usePlaidExchangePublicTokenMutation } from "src/redux/mutations/plaid-exchange-public-token";
import { useGetFinancialUserProfileQuery } from "src/redux/queries/profile/get-financial-user-profile";
import { selectAuthenticationState } from "src/redux/slice/authentication/AuthenticationSelector";
import { authenticateUserAction } from "src/redux/slice/authentication/AuthenticationSlice";
import { useAppSelector } from "src/redux/store/hooks";

export const usePlaidEvents = (
  currentUserId: string,
  currentAccount: UserAccountClass,
  profileType: FinancialUserProfileType,
  linkId: number | undefined
) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [plaidExchangeToken] = usePlaidExchangePublicTokenMutation();
  const authenticationState = useAppSelector(selectAuthenticationState);
  let taskId = "";

  const onSuccess = useCallback(
    async (publicToken: string, metadata: PlaidLinkOnSuccessMetadata) => {
      logSuccess(metadata, Number(currentUserId));
      mixPanelClient.trackEventOfType("NEW_ACCOUNT_LINK_ACTION_EVENT", {
        userID: currentUserId,
        time: new Date().toDateString(),
        metaData: {
          userName: `${currentAccount.username}`,
          tags: `${currentAccount.tags}`,
        },
      });

      if (linkId != null) {
        // link token was successfully updated
        // update mode: no need to exchange public token
      } else {
        try {
          const request: PlaidExchangeTokenRequestClass = {
            publicToken: publicToken,
            userId: currentUserId,
            institutionId: metadata.institution?.institution_id ?? "",
            institutionName: metadata.institution?.name ?? "",
            profileType: profileType!,
          };

          // TODO: we need to take the taskId returned from the response and poll the backend
          // for the state of the task
          const response = await plaidExchangeToken(request).unwrap();
          toast({
            title: "Successfully connected bank account",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });

          // TODO: get the task id here
          taskId = response.taskId;

          // TODO: reload the user financial profile
          const queryFinancialUserProfileRequest = {
            userId: currentUserId,
            profileType: profileType!,
          };

          const {
            data: updatedProfileRespons,
            isLoading,
            isSuccess,
            isError,
            error,
          } = await useGetFinancialUserProfileQuery(
            queryFinancialUserProfileRequest
          );

          if (isSuccess && updatedProfileRespons.profile) {
            // update the redux store
            dispatch(authenticateUserAction(authenticationState));
          }
        } catch (error) {
          toast({
            title: `Failed to connect bank account. Please try again later. err: ${error}`,
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
        }
      }

      // from the obtained task id pass
      if (taskId != "") {
        navigate(`${routes.HOME}/${taskId}`);
      } else {
        navigate(`${routes.HOME}`);
      }
    },
    [
      currentUserId,
      currentAccount,
      plaidExchangeToken,
      linkId,
      profileType,
      dispatch,
      navigate,
    ]
  );

  const onExit = useCallback(
    async (error: PlaidLinkError | null, metadata: any) => {
      logExit(error, metadata, Number(currentUserId));
      if (error != null && error.error_code === "INVALID_LINK_TOKEN") {
        if (error.error_code === "INVALID_LINK_TOKEN") {
          toast({
            title: `Failed to connect bank account due to invalid link token. Please email the solomon-ai team! ${
              error.display_message || error.error_message
            }`,
            description: "engineering@solomon-ai.co",
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
        } else {
          toast({
            title: `Failed to connect bank account. Please try again later. err: ${
              error.display_message || error.error_message
            }`,
            action: (
              <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
            ),
          });
          // to handle other error codes, see https://plaid.com/docs/errors/
        }
      }
    },
    [currentUserId]
  );

  const onEvent = useCallback(
    (eventName: string, metadata: PlaidLinkOnEventMetadata) => {
      logEvent(eventName, metadata);
    },
    []
  );

  return { onSuccess, onEvent, onExit };
};
