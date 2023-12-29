import { cn, decipherNextPage } from "src/lib/utils";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useAuthenticatedUserMutation } from "src/redux/mutations/authenticate-user";
import { persistentStorage } from "src/lib/persistent-storage";
import { routes } from "src/constant/routes";
import { buttonVariants } from "../ui/button";
import { Input } from "../ui/input";
import { mixPanelClient } from "src/lib/mixpanel";
import HappyToast from "../happy-toast";
import Toast from "../warning-toast";
import { CustomButton } from "../button/custom-button";
import {
  AuthenticateRequestClass,
  AuthenticationResponseClass,
  FinancialUserProfile,
  FinancialUserProfileType,
  MelodyFinancialContext,
  ProfileType,
} from "@solomon-ai/component-library";
import { Label } from "../ui/label";
import { useGetFinancialUserProfileQuery } from "src/redux/queries/profile/get-financial-user-profile";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  profileType: ProfileType;
  financialUserProfileType: FinancialUserProfileType;
}

export const cacheFinancialUserData = (
  profile: FinancialUserProfile,
  financialContext: MelodyFinancialContext,
) => {
  // Helper function to set item in storage
  type Constants = {
    JWT_TOKEN_KEY: string;
    DEFAULT_REQUEST_TIMEOUT: number;
    DEFAULT_BASE_URI: string;
    DEFAULT_REACT_APP_MIXPANEL_TOKEN: string;
    USER_ID_KEY: string;
    USER_PROFILE_ID_KEY: string;
    USER_PROFILE_KEY: string;
    USER_ACCOUNT_KEY: string;
    USER_FINANCIAL_PROFILE_KEY: string;
    USER_FINANCIAL_CONTEXT_KEY: string;
    PAYMENT_PORTAL_LINK: string;
  };

  const constants: Constants = {
    JWT_TOKEN_KEY: "jwt_token",
    DEFAULT_REQUEST_TIMEOUT: 30000,
    DEFAULT_BASE_URI: "https://api.solomon.io",
    DEFAULT_REACT_APP_MIXPANEL_TOKEN: "1234567890",
    USER_ID_KEY: "user_id",
    USER_PROFILE_ID_KEY: "user_profile_id",
    USER_PROFILE_KEY: "user_profile",
    USER_ACCOUNT_KEY: "user_account",
    USER_FINANCIAL_PROFILE_KEY: "user_financial_profile",
    USER_FINANCIAL_CONTEXT_KEY: "user_financial_context",
    PAYMENT_PORTAL_LINK: "https://solomon.io/payment",
  };

  const setStorageItem = (key: keyof Constants, value: any) => {
    if (constants[key] !== undefined) {
      persistentStorage.setItem(key, value);
    }
  };

  // Storage keys and corresponding record paths to set
  const storageMappings = {
    USER_FINANCIAL_PROFILE_KEY: profile,
    USER_FINANCIAL_CONTEXT_KEY: financialContext,
  };

  // Set each item in persistent storage
  Object.entries(storageMappings).forEach(([key, value]) => {
    setStorageItem(key as keyof Constants, value);
  });
};

const storeUserData = (
  record: AuthenticationResponseClass,
  profile: FinancialUserProfile,
  financialContext: MelodyFinancialContext,
) => {
  // Helper function to set item in storage
  type Constants = {
    JWT_TOKEN_KEY: string;
    DEFAULT_REQUEST_TIMEOUT: number;
    DEFAULT_BASE_URI: string;
    DEFAULT_REACT_APP_MIXPANEL_TOKEN: string;
    USER_ID_KEY: string;
    USER_PROFILE_ID_KEY: string;
    USER_PROFILE_KEY: string;
    USER_ACCOUNT_KEY: string;
    USER_FINANCIAL_PROFILE_KEY: string;
    USER_FINANCIAL_CONTEXT_KEY: string;
    PAYMENT_PORTAL_LINK: string;
  };

  const constants: Constants = {
    JWT_TOKEN_KEY: "jwt_token",
    DEFAULT_REQUEST_TIMEOUT: 30000,
    DEFAULT_BASE_URI: "https://api.solomon.io",
    DEFAULT_REACT_APP_MIXPANEL_TOKEN: "1234567890",
    USER_ID_KEY: "user_id",
    USER_PROFILE_ID_KEY: "user_profile_id",
    USER_PROFILE_KEY: "user_profile",
    USER_ACCOUNT_KEY: "user_account",
    USER_FINANCIAL_PROFILE_KEY: "user_financial_profile",
    USER_FINANCIAL_CONTEXT_KEY: "user_financial_context",
    PAYMENT_PORTAL_LINK: "https://solomon.io/payment",
  };

  const setStorageItem = (key: keyof Constants, value: any) => {
    if (constants[key] !== undefined) {
      persistentStorage.setItem(key, value);
    }
  };

  // Storage keys and corresponding record paths to set
  const storageMappings = {
    JWT_TOKEN_KEY: record.token,
    // the authn id is what is used to identify the user in the backend (globally unique record)
    USER_ID_KEY: record.user_account.userAuthnAccountID,
    USER_PROFILE_ID_KEY: record.user_profile.id,
    USER_ACCOUNT_KEY: record.user_account,
    USER_PROFILE_KEY: record.user_profile,
    USER_FINANCIAL_PROFILE_KEY: profile,
    USER_FINANCIAL_CONTEXT_KEY: financialContext,
  };

  // Set each item in persistent storage
  Object.entries(storageMappings).forEach(([key, value]) => {
    setStorageItem(key as keyof Constants, value);
  });
};

export function UserAuthForm({
  profileType,
  financialUserProfileType,
  className,
  ...props
}: UserAuthFormProps) {
  const [toast, setToast] = useState<React.ReactElement | null>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading] = React.useState<boolean>(false);
  const searchParams = useSearchParams();
  const [authenticateUser] = useAuthenticatedUserMutation();
  const navigate = useNavigate();
  const history = useNavigate();

  const navigateToRegisteration = () => {
    history(`${routes.REGISTRATION}`);
  };

  const navigateToRequestPasswordChange = () => {
    history(`${routes.REQUEST_PASSWORD_CHANGE}`);
  };

  async function onSubmit(data: { email: string; password: string }) {
    setIsLoading(true);

    const formattedRequest = new AuthenticateRequestClass({
      Username: data.email.trim().toLowerCase(),
      Password: data.password.trim(),
    });
    try {
      const record = await authenticateUser({
        Username: formattedRequest.Username,
        Password: formattedRequest.Password,
        ProfileType: profileType,
        FinancialProfileType: financialUserProfileType,
      }).unwrap();
      const { user_account, user_financial_profile } = record;
      const { profile, financialContext } = user_financial_profile;
      // we first set the user identity and metadata that will be associated with this sessions
      mixPanelClient.setIdentity(`${user_account.userAccountID}`, {
        userName: `${user_account.username}`,
        tags: [],
      });

      // emit login mixpanel event
      mixPanelClient.trackLoginEvent({
        userID: `${user_account.userAccountID}`,
        metaData: {
          userName: `${user_account.username}`,
          tags: [],
        },
        time: new Date().toDateString(),
      });

      storeUserData(record, profile, financialContext);

      // if the financial profile has both a subscription and connected accounts, we need to push the user to the home page
      const nextPage = decipherNextPage(user_account, profile);
      navigate(nextPage);

      setIsLoading(false);
      setToast(
        <HappyToast
          show={true}
          message={"Successfully Logged in!"}
          autoHideDuration={3000}
        />,
      );
    } catch (err) {
      setIsLoading(false);
      setToast(
        <Toast
          show={true}
          message={`Wrong email / password combination. Please try again`}
          autoHideDuration={3000}
          key={Date.now().toString()}
        />,
      );
    }
  }

  return (
    <>
      {toast}
      <div className={cn("grid gap-6 max-w-lg", className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 sm:gap-6 md:gap-8 lg:gap-10">
            <div className="grid gap-3">
              <Label className="font-bold text-black">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading || isGitHubLoading}
                {...register("email")}
                className="min-w-fit"
              />
              <p className="text-xs font-bold text-black">
                Kindly enter your email address
              </p>
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div className="grid gap-3">
              <Label className="font-bold text-black">Password</Label>
              <Input
                id="password"
                placeholder="*******"
                type="password"
                autoCapitalize="none"
                autoComplete="password"
                autoCorrect="off"
                disabled={isLoading || isGitHubLoading}
                {...register("password")}
              />
              <p className="text-xs font-bold text-black">
                Enter your password: Your privacy is our priority
              </p>
              {errors?.password && (
                <p className="px-1 text-xs text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>
            <button
              className={cn("font-bold text-xs", buttonVariants())}
              disabled={isLoading}
            >
              Sign In with Email
            </button>
          </div>
        </form>
        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            onClickHandler={() => {
              /* your navigation logic here */
              navigateToRegisteration();
            }}
            isLoading={isLoading}
            label=" Create a new account"
          />
          <CustomButton
            onClickHandler={() => {
              /* your navigation logic here */
              navigateToRequestPasswordChange();
            }}
            isLoading={isLoading}
            label="Forgot password"
          />
        </div>
      </div>
    </>
  );
}
