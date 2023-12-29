import { useEffect } from "react";
import { useAppSelector } from "src/redux/store/hooks";
import React from "react";
import {
  selectCurrentUserID,
  selectCurrentUserAccount,
  selectUserFinancialProfileType,
} from "src/redux/slice/authentication/AuthenticationSelector";

import { PlaidLinkOptions, usePlaidLink } from "react-plaid-link";
import { Button } from "../ui/button";
import { usePlaidToken } from "src/hooks/usePlaidToken";
import { usePlaidEvents } from "src/hooks/usePlaidEvents";

interface ConnectPlaidAccountButtonProps {
  title?: string;
  className?: string;
  linkId?: number;
  children?: React.ReactNode;
}

export const ConnectPlaidAccountButtonMemoized: React.FC<ConnectPlaidAccountButtonProps> =
  React.memo(({ title, className, linkId, children }) => {
    const isOAuthRedirect = window.location.href.includes("?oauth_state_id=");
    const currentUserId = useAppSelector(selectCurrentUserID);
    const currentAccount = useAppSelector(selectCurrentUserAccount);
    const { username, email } = currentAccount;
    const financialUserProfileType = useAppSelector(
      selectUserFinancialProfileType
    );

    const currentToken = usePlaidToken(
      linkId,
      currentUserId,
      username!,
      email!,
      financialUserProfileType
    );

    const { onSuccess, onEvent, onExit } = usePlaidEvents(
      currentUserId,
      currentAccount,
      financialUserProfileType,
      linkId
    );

    const { open, ready } = usePlaidLink({
      token: currentToken,
      onSuccess,
      onEvent,
      onExit,
    });

    useEffect(() => {
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

      if (isOAuthRedirect && ready) {
        open();
      }
    }, [ready, open]);

    return (
      <Button
        variant={"outline"}
        className={`text-md rounded-2xl flex flex-1 gap-1 ${className}`}
        onClick={() => open()}
      >
        {children}
        {title && <p className="text-md">{title}</p>}
      </Button>
    );
  });
