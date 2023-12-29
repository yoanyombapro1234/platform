import { persistentStorage } from "src/lib/persistent-storage";
import { Button } from "../ui/button";
import { Navigate, useNavigate } from "react-router";
import { routes } from "src/constant/routes";
import { cn } from "src/lib/utils";
import { mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";
import { selectCurrentUserAccount } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import { ExclamationTriangleIcon } from "@heroicons/react/20/solid";

/**
 * This is defining a functional component called `LogoutButton` that takes in a single argument
 * `props` of type `LogoutButtonProps`. The `LogoutButtonProps` type is an interface that defines the
 * expected shape of the props object that will be passed to the component. The function returns JSX
 * that will be rendered as an `IonButton` component with the specified props and an `onClick` event
 * handler that calls the `logoutHandler` function.
 *
 * @param {LogoutButtonProps} props
 * @returns {React.ReactElement}
 *  */
const LogoutButton: React.FC<{
  active: boolean;
}> = ({ active }) => {
  const navigate = useNavigate();
  const currentAccount = useAppSelector(selectCurrentUserAccount);

  const logoutHandler = () => {
    // We need to wipe the local storage when the component initially mounts
    // because we don't want to persist the user's data if they are not logged in
    // and they refresh the page
    persistentStorage.wipeLocalStorage();

    // emit metrics
    mixPanelClient.trackEventOfType(eventNames.LOGOUT_EVENT, {
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
    <Button
      variant={"ghost"}
      onClick={logoutHandler}
      className="items-center justify-center ml-3 font-bold border-1"
    >
      <ExclamationTriangleIcon className="w-5 h-5 mr-2" />

      <a href="#" className={cn(active ? "text-black" : "")}>
        Sign out
      </a>
    </Button>
  );
};

export { LogoutButton };
