import { useState } from "react";
import { useForm } from "react-hook-form";
import { cn } from "src/lib/utils";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { buttonVariants } from "../ui/button";
import { useCheckEmailExistsMutation } from "src/redux/mutations/check-email-exists";
import { useToast } from "../ui/use-toast";
import { useRequestPasswordChangeMutation } from "src/redux/mutations/request-password-change";
import { RequestPasswordResetRequest } from "../../types/request-response/initiate-password-reset";
import HappyToast from "../happy-toast";
import Toast from "../warning-toast";
import { Link, useNavigate } from "react-router-dom";
import { routes } from "src/constant/routes";
import { ArrowBigRightDash, ArrowRightIcon } from "lucide-react";
import { CustomButton } from "../button/custom-button";
import { eventNames } from "src/lib/mixpanel-events";
import { mixPanelClient } from "src/lib/mixpanel";
import { ProfileType } from "@solomon-ai/component-library";

interface RequestPasswordResetFormProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  profileType: ProfileType;
}

export function RequestPasswordResetForm({
  className,
  profileType,
  ...props
}: RequestPasswordResetFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  const history = useNavigate();

  const [checkEmailExists] = useCheckEmailExistsMutation();
  const [requestPasswordReset] = useRequestPasswordChangeMutation();
  const [toast, setToast] = useState<React.ReactElement | null>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function onSubmit(data: { email: string }) {
    // check if the email exists
    // and if it does we send the password reset email
    try {
      const response = await checkEmailExists({
        email: data.email,
        profileType: profileType,
      }).unwrap();
      if (response.exists) {
        const passwordChangeResponse = await requestPasswordReset({
          email: data.email,
        }).unwrap();

        // track the password reset event
        mixPanelClient.trackEvent(eventNames.REQUEST_PASSWORD_RESET_EVENT);

        setToast(
          <HappyToast
            show={true}
            message={`Password reset email sent to ${data.email}`}
            autoHideDuration={3000}
          />,
        );
      } else {
        setToast(
          <Toast
            show={true}
            message={`Email does not exist. Please provide a valid email`}
            autoHideDuration={3000}
            key={Date.now().toString()}
          />,
        );
      }
    } catch (err) {
      setToast(
        <Toast
          show={true}
          message={`Failed to reset password. Please try again later. err: ${err}`}
          autoHideDuration={3000}
          key={Date.now().toString()}
        />,
      );
    }
  }

  const navigateToAuthenticationScreen = () => {
    history(`${routes.AUTHENTICATION}`);
  };

  const navigateToRegistrationScreen = () => {
    history(`${routes.REGISTRATION}`);
  };

  return (
    <>
      {toast}
      <div className={cn("grid gap-6 max-w-lg", className)} {...props}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-2 sm:gap-6 md:gap-8 lg:gap-10">
            <div className="grid gap-3">
              <Label className="font-bold text-md">Email</Label>
              <Input
                id="email"
                placeholder="name@example.com"
                type="email"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect="off"
                disabled={isLoading}
                {...register("email")}
              />
              {errors?.email && (
                <p className="px-1 text-xs text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <button
              className={cn("font-bold", buttonVariants())}
              disabled={isLoading}
            >
              Submit
            </button>
          </div>
        </form>

        <div className="grid grid-cols-2 gap-2">
          <CustomButton
            onClickHandler={() => {
              /* your navigation logic here */
              navigateToAuthenticationScreen();
            }}
            isLoading={isLoading}
            label="Login"
          />

          <CustomButton
            onClickHandler={() => {
              /* your navigation logic here */
              navigateToRegistrationScreen();
            }}
            isLoading={isLoading}
            label="Create An Account"
          />
        </div>
      </div>
    </>
  );
}
