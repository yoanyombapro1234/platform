import { persistentStorage } from "src/lib/persistent-storage";
import { Button } from "../ui/button";
import { Navigate, useNavigate } from "react-router";
import { routes } from "src/constant/routes";
import { cn } from "src/lib/utils";
import { mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";
import { selectCurrentUserAccount } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import React, { useState } from "react";
import { useDeleteUserMutation } from "src/redux/mutations/delete-user";
import { selectCurrentUserID } from "../../redux/slice/authentication/AuthenticationSelector";
import Toast from "../warning-toast";
import { TrashIcon } from "@heroicons/react/24/outline";

/**
 * This is defining a functional component called `DeleteUserButton` that takes in a single argument
 * `props` of type `DeleteUserButtonProps`. The `DeleteUserButtonProps` type is an interface that defines the
 * expected shape of the props object that will be passed to the component. The function returns JSX
 * that will be rendered as an `IonButton` component with the specified props and an `onClick` event
 * handler that calls the `DeleteUserHandler` function.
 *
 * @param {DeleteUserButtonProps} props
 * @returns {React.ReactElement}
 *  */
const DeleteUserButton: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const navigate = useNavigate();
  const currentAccount = useAppSelector(selectCurrentUserAccount);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [toast, setToast] = useState<React.ReactElement | null>();
  const [deleteUser] = useDeleteUserMutation();
  const userProfile = useAppSelector(selectCurrentUserAccount);
  const currentUserId = useAppSelector(selectCurrentUserID);

  const DeleteUserHandler = async () => {
    try {
      const record = await deleteUser({
        userId: currentUserId,
        profileType: userProfile.accountType!,
      }).unwrap();

      // We need to wipe the local storage when the component initially mounts
      // because we don't want to persist the user's data if they are not logged in
      // and they refresh the page
      persistentStorage.wipeLocalStorage();
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

    // emit metrics
    mixPanelClient.trackEventOfType(eventNames.DELETE_USER_EVENT, {
      userID: currentAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${currentAccount.username}`,
        tags: `${currentAccount.tags}`,
      },
    });

    // redirect to login page
    navigate(routes.AUTHENTICATION);
    navigate(0);
  };

  return (
    <>
      {toast}
      <Button
        variant={"ghost"}
        onClick={DeleteUserHandler}
        className="ml-3 border-1 text-black font-bold items-center justify-center"
      >
        <TrashIcon className="w-5 h-5 mr-2" />
        <a href="#" className={cn(active ? "text-black" : "")}>
          Delete Profile
        </a>
      </Button>
    </>
  );
};

export { DeleteUserButton };
