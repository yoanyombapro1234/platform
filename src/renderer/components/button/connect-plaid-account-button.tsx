import { useEffect, useState } from "react";
import { cn, logEvent, logExit, logSuccess } from "src/lib/utils";
import { useAppSelector } from "src/redux/store/hooks";
import React from "react";
import { routes } from "src/constant/routes";
import { useLinkTokenMutation } from "src/redux/mutations/initiate-link-token-exchange";
import {
  selectCurrentUserID,
  selectCurrentUserAccount,
  selectUserFinancialProfile,
  selectAuthenticationState,
  selectUserFinancialProfileType,
} from "src/redux/slice/authentication/AuthenticationSelector";

import { useNavigate } from "react-router";
import {
  PlaidLinkOptions,
  usePlaidLink,
  PlaidLinkError,
  PlaidLinkOnExitMetadata,
  PlaidLinkOnEventMetadata,
  PlaidLinkStableEvent,
  PlaidLinkOnSuccessMetadata,
} from "react-plaid-link";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "../ui/toast";
import { usePlaidExchangePublicTokenMutation } from "src/redux/mutations/plaid-exchange-public-token";
import { Button } from "../ui/button";
import { useUpdateLinkTokenMutation } from "src/redux/mutations/update-link-token";
import {
  PlaidExchangeTokenRequestClass,
  PlaidInitiateTokenUpdateRequestClass,
  PlaidLinkRequestClass,
} from "@solomon-ai/component-library";
import { eventNames } from "src/lib/mixpanel-events";
import { mixPanelClient } from "src/lib/mixpanel";
import { useGetFinancialUserProfileQuery } from "src/redux/queries/profile/get-financial-user-profile";
import { useDispatch } from "react-redux";
import { authenticateUserAction } from "src/redux/slice/authentication/AuthenticationSlice";
import { usePlaidToken } from "src/hooks/usePlaidToken";
import { usePlaidEvents } from "src/hooks/usePlaidEvents";

interface ConnectPlaidAccountButtonProps {
  title?: string;
  className?: string;
  linkId?: number;
  generatedToken?: string;
  children?: React.ReactNode;
}
/**
 *  This component enables us to connect a new bank account through plaid
 *
 * @param props
 * @returns
 */
const ConnectPlaidAccountButton: React.FC<{
  title?: string;
  className?: string;
  linkId?: number | null;
  generatedToken?: string;
  children?: React.ReactNode;
}> = (props) => {
  const { title, className, linkId, generatedToken } = props;
  const isOAuthRedirect = window.location.href.includes("?oauth_state_id=");
  const [currentToken, setCurrentToken] = useState<string>("");
  const currentUserId = useAppSelector(selectCurrentUserID);
  const [plaidExchangeToken] = usePlaidExchangePublicTokenMutation();
  const { toast } = useToast();

  const [error, setError] = React.useState<string>("");
  const currentAccount = useAppSelector(selectCurrentUserAccount);
  const authenticationState = useAppSelector(selectAuthenticationState);
  const financialUserProfile = useAppSelector(selectUserFinancialProfile);
  const [getLinkToken] = useLinkTokenMutation();
  const [updateLinkToken] = useUpdateLinkTokenMutation();
  const { profileType } = financialUserProfile;
  const email = currentAccount.email;
  const username = currentAccount.username;
  const dispatch = useDispatch();

  const history = useNavigate();

  const createLinkToken = async () => {
    if (linkId === null || linkId === undefined) {
      const req: PlaidLinkRequestClass = {
        userId: currentUserId,
        fullName: username ? username : "",
        email: email ? email : "",
        phoneNumber: "",
        profileType: profileType!,
      };

      const response = await getLinkToken(req).unwrap();
      setCurrentToken(response.linkToken);
      // store link_token temporarily in case of OAuth redirect
      localStorage.setItem("link_token", response.linkToken);
    } else {
      // here we are to update the link hence no need to go through token exchange
      const request: PlaidInitiateTokenUpdateRequestClass = {
        userId: currentUserId!,
        linkId: linkId.toString(),
        profileType: profileType!,
      };

      const response = await updateLinkToken(request).unwrap();
      setCurrentToken(response.linkToken);
      // store link_token temporarily in case of OAuth redirect
      localStorage.setItem("link_token", response.linkToken);
    }
  };

  // generate a link_token when component mounts
  React.useEffect(() => {
    // do not generate a new token if page is handling an OAuth redirect.
    // instead setLinkToken to previously generated token from localStorage
    // https://plaid.com/docs/link/oauth/#reinitializing-link
    if (isOAuthRedirect) {
      const cachedToken = localStorage.getItem("link_token");
      setCurrentToken(cachedToken !== null ? cachedToken : "");
      return;
    }

    // check for cached linked okent
    const cachedToken = localStorage.getItem("link_token");
    if (
      cachedToken === null ||
      cachedToken === undefined ||
      cachedToken === ""
    ) {
      createLinkToken();
    } else {
      setCurrentToken(cachedToken);
    }
  }, []);

  const onSuccess = async (
    publicToken: string,
    metadata: PlaidLinkOnSuccessMetadata
  ) => {
    // send public_token to your server
    // https://plaid.com/docs/api/tokens/#token-exchange-flow
    logSuccess(metadata, Number(currentUserId));

    // emit a mixpanel metric
    mixPanelClient.trackEventOfType(eventNames.NEW_ACCOUNT_LINK_ACTION_EVENT, {
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
      // call to Plaid api endpoint: /item/public_token/exchange in order to obtain access_token which is then stored with the created item
      try {
        const request: PlaidExchangeTokenRequestClass = {
          publicToken: publicToken,
          userId: currentUserId,
          institutionId: metadata.institution?.institution_id ?? "",
          institutionName: metadata.institution?.name ?? "",
          profileType: profileType!,
        };

        // call mutation to exchange public token for access token
        // This should invalidate the redux store a force a query for the account records
        const response = await plaidExchangeToken(request).unwrap();
        toast({
          title: "Successfully connected bank account",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });

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

        // wipe link token from cache on success
        localStorage.removeItem("link_token");
      } catch (error) {
        toast({
          title: `Failed to connect bank account. Please try again later. err: ${error}`,
          description: "Friday, February 10, 2023 at 5:57 PM",
          action: (
            <ToastAction altText="Goto schedule to undo">Undo</ToastAction>
          ),
        });
      }
    }
    history(`${routes.HOME}`);
  };

  const onExit = async (
    error: PlaidLinkError | null,
    metadata: PlaidLinkOnExitMetadata
  ) => {
    // log and save error and metatdata
    logExit(error, metadata, Number(currentUserId));

    if (error != null && error.error_code === "INVALID_LINK_TOKEN") {
      // regenerate the link token
      await createLinkToken();
    }
    if (error != null) {
      setError(error.display_message || error.error_message);
    }
    // to handle other error codes, see https://plaid.com/docs/errors/
  };

  const onEvent = async (
    eventName: PlaidLinkStableEvent | string,
    metadata: PlaidLinkOnEventMetadata
  ) => {
    // handle errors in the event end-user does not exit with onExit function error enabled.
    if (eventName === "ERROR" && metadata.error_code != null) {
      setError(metadata.error_code);
    }

    logEvent(eventName, metadata);
  };

  const config: PlaidLinkOptions = {
    // token must be the same token used for the first initialization of Link
    token: currentToken,
    onSuccess,
    onEvent,
    onExit,
  };
  if (isOAuthRedirect) {
    // receivedRedirectUri must include the query params
    config.receivedRedirectUri = window.location.href;
  }

  const {
    open,
    ready,
    // error,
    // exit
  } = usePlaidLink(config);

  React.useEffect(() => {
    // If OAuth redirect, instantly open link when it is ready instead of
    // making user click the button
    if (isOAuthRedirect && ready) {
      open();
    }
  }, [ready, open, isOAuthRedirect, currentToken]);

  return isOAuthRedirect ? (
    <></>
  ) : (
    <Button
      variant={"outline"}
      className={cn("text-md rounded-2xl flex flex-1 gap-1", className)}
      onClick={() => open()}
    >
      {props.children}
      {title && <p className="text-md">{title}</p>}
    </Button>
  );
};

export { ConnectPlaidAccountButton };
