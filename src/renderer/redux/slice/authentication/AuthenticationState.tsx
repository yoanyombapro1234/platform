import { UserProfile as SocialProfile } from "@solomon-ai/component-library";
import { UserAccountClass } from "@solomon-ai/component-library";
import {
  FinancialUserProfile as FinancialProfile,
  MelodyFinancialContext,
} from "@solomon-ai/component-library";

export interface AuthenticationState {
  authenticated: boolean;
  userID: string;
  userAccount: UserAccountClass;
  userProfile: SocialProfile;
  userFinancialProfile: FinancialProfile;
  userFinancialContext: MelodyFinancialContext;
}

export const InitialAuthenticationState: AuthenticationState = {
  authenticated: false,
  userID: "",
  userAccount: {} as UserAccountClass,
  userProfile: {} as SocialProfile,
  userFinancialProfile: {} as FinancialProfile,
  userFinancialContext: {} as MelodyFinancialContext,
};
