// hooks/userSelectors.js
import {
  selectAvatar,
  selectCurrentUserAccount,
  selectCurrentUserID,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

export const useUserAccount = () => {
  return useAppSelector(selectCurrentUserAccount);
};

export const useUserId = () => {
  return useAppSelector(selectCurrentUserID);
};

export const useAvatar = () => {
  return useAppSelector(selectAvatar);
};
