// hooks/useSSOToken.js
import { UserAccountClass } from "@solomon-ai/component-library";
import { useState, useEffect } from "react";
import { Spinner } from "src/components/spinner";
import { useGetUserAccountByEmailOrUsernameQuery } from "src/redux/queries/user/get-user-by-email-or-username";

export const useSSOToken = (userAccount: UserAccountClass) => {
  const [currentToken, setCurrentToken] = useState("");
  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />
  );

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetUserAccountByEmailOrUsernameQuery({
    profileType: userAccount.accountType!,
    email: userAccount.email!,
  });

  const getSSOToken = () => {
    if (isSuccess && response?.ssoToken) {
      localStorage.setItem("sso_token", response.ssoToken);
      setSpinner(null);
      setCurrentToken(response.ssoToken);
    } else if (isLoading) {
      setSpinner(<Spinner className={"w-8 h-8 mt-3 ml-3"} />);
    } else if (isError) {
      setSpinner(<div>{error.toString()}</div>);
    } else if (
      isSuccess &&
      (!response?.ssoToken || response.ssoToken.length === 0)
    ) {
      setSpinner(null);
    }
  };

  useEffect(() => {
    const cachedSSOToken = localStorage.getItem("sso_token");
    if (
      cachedSSOToken === null ||
      cachedSSOToken === undefined ||
      cachedSSOToken === ""
    ) {
      getSSOToken();
    } else {
      setCurrentToken(cachedSSOToken);
    }
  }, [isLoading, isError, isSuccess, response, error]);

  return { currentToken, spinner };
};
