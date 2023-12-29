import { AuthenticationState } from "src/redux/slice/authentication/AuthenticationState";
import { RootState } from "src/redux/store/store";
import {
  FinancialUserProfile,
  UserProfile as SocialProfile,
  MelodyFinancialContext,
  UserAccount,
  UserAccountClass,
  BankAccount,
  FinancialUserProfileType,
  CreditAccount,
  MortgageAccount,
  InvestmentAccount,
  StudentLoanAccount,
} from "@solomon-ai/component-library";

/**
 * selectAuthenticationState obtains authentication state object
 * @param state - root state object
 * @returns
 */
export const selectAuthenticationState = (
  state: RootState
): AuthenticationState => state.authentication;

/**
 * selectCurrentUserAccount selects the current user account from authentication state object
 * @param state - root state object
 * @returns
 */
export const selectCurrentUserAccount = (state: RootState): UserAccountClass =>
  state.authentication.userAccount;

export const selectEmail = (state: RootState): string => {
  const { userAccount } = state.authentication;
  return userAccount.email!;
};

export const selectUsername = (state: RootState): string => {
  const { userAccount } = state.authentication;
  return userAccount.username!;
};

export const selectUserProfileType = (state: RootState): string => {
  const { userAccount } = state.authentication;
  return userAccount.accountType!;
};

/**
 * selectAvater selects the current user profile avatar
 * @param state - root state object
 * @returns
 */
export const selectAvatar = (state: RootState): string =>
  state.authentication.userProfile.profileImageUrl;

/**
 * selectCurrentSocialProfile selects the current user profile from authentication state object
 * @param state - root state object
 * @returns
 */
export const selectCurrentSocialProfile = (state: RootState): SocialProfile =>
  state.authentication.userProfile;

/**
 * selectCurrentUserID selects the current user profile ID from the authentication state object
 * @param state
 * @returns
 */
export const selectCurrentUserID = (state: RootState): string =>
  state.authentication.userID;

/**
 * selectAuthenticated selects the authentication state of a user
 * @param state
 * @returns
 */
export const selectAuthenticated = (state: RootState): boolean =>
  state.authentication.authenticated;

/**
 * selectUserFinancialProfile selects the current user financial profile from the authentication state object
 * @param state
 * @returns
 */
export const selectUserFinancialProfile = (
  state: RootState
): FinancialUserProfile => state.authentication.userFinancialProfile;

/**
 * selectUserFinancialProfielType selects the current user financial profile type from the authentication state object
 * @param state
 * @returns
 */
export const selectUserFinancialProfileType = (
  state: RootState
): FinancialUserProfileType => {
  const { userFinancialProfile } = state.authentication;
  return userFinancialProfile.profileType!;
};

export const selectUserFinancialContext = (
  state: RootState
): MelodyFinancialContext => {
  const ctx = state.authentication.userFinancialContext;
  return ctx;
};

/**
 * selectBankAccounts selects a set of bank accounts from the financial profile
 * @param state
 * @returns
 */
export const selectBankAccounts = (state: RootState): BankAccount[] => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const bankAccounts: BankAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (link.bankAccounts !== undefined && link.bankAccounts.length > 0) {
        bankAccounts.push(...link.bankAccounts);
      }
    });
    return bankAccounts;
  } else {
    return [];
  }
};

export const selectOnboardingStatus = (state: RootState): boolean => {
  const { userFinancialProfile, userAccount } = state.authentication;
  if (userAccount.isEmailVerified) {
    return true;
  } else {
    return false;
  }
};

export const selectBankTotalsAcrossAllAcounts = (state: RootState): number => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const bankAccounts: BankAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (link.bankAccounts !== undefined && link.bankAccounts.length > 0) {
        bankAccounts.push(...link.bankAccounts);
      }
    });

    return (
      bankAccounts.reduce((acc, account) => acc + (account.balance ?? 0), 0) ??
      0
    );
  } else {
    return 0;
  }
};

export const selectCreditAccountTotalsAcrossAllAccounts = (
  state: RootState
): number => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const creditAccounts: CreditAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (link.creditAccounts !== undefined && link.creditAccounts.length > 0) {
        creditAccounts.push(...link.creditAccounts);
      }
    });

    return (
      creditAccounts.reduce(
        (acc, account) => acc + (account.balance ?? 0),
        0
      ) ?? 0
    );
  } else {
    return 0;
  }
};

export const selectStudentLoanAccountTotalsAcrossAllAccounts = (
  state: RootState
): number => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const studentLoanAccounts: StudentLoanAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (
        link.studentLoanAccounts !== undefined &&
        link.studentLoanAccounts.length > 0
      ) {
        studentLoanAccounts.push(...link.studentLoanAccounts);
      }
    });
    return (
      studentLoanAccounts.reduce(
        (acc, account) =>
          acc +
          (account.outstandingInterestAmount ?? 0) +
          (account.originationPrincipalAmount ?? 0),
        0
      ) ?? 0
    );
  } else {
    return 0;
  }
};

export const selectInvestmentAccountTotalsAcrossAllAccounts = (
  state: RootState
): number => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const investmentAccounts: InvestmentAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (
        link.investmentAccounts !== undefined &&
        link.investmentAccounts.length > 0
      ) {
        investmentAccounts.push(...link.investmentAccounts);
      }
    });

    return (
      investmentAccounts.reduce(
        (acc, account) => acc + (account.balance ?? 0),
        0
      ) ?? 0
    );
  } else {
    return 0;
  }
};

export const selectMortgageAccountTotalsAcrossAllAccounts = (
  state: RootState
): number => {
  const { userFinancialProfile } = state.authentication;
  if (userFinancialProfile.link !== undefined) {
    // iterate over link and extract bank accoints
    const assetAccounts: MortgageAccount[] = [];
    userFinancialProfile.link.map((link) => {
      if (
        link.mortgageAccounts !== undefined &&
        link.mortgageAccounts.length > 0
      ) {
        assetAccounts.push(...link.mortgageAccounts);
      }
    });

    return (
      assetAccounts.reduce(
        (acc, account) => acc + (account.outstandingPrincipalBalance ?? 0),
        0
      ) ?? 0
    );
  } else {
    return 0;
  }
};

/*
    && userFinancialProfile.stripeSubscriptions !== null 
    && userFinancialProfile.stripeSubscriptions !== undefined

    call financial profile upon visiting home screen , be sure to set the updated profile in storage

    call updated user account , be sure to stash everything in storage
*/
