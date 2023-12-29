import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { ErrorMessage } from "../types/error/error";
import {
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkStableEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkError,
} from "react-plaid-link";
import {
  FinancialUserProfile,
  PocketType,
  UserAccount,
  UserAccountClass,
} from "@solomon-ai/component-library";
import { routes } from "src/constant/routes";

/**
 * Creates a string of CSS classes.
 * @param inputs - Class values to be combined.
 * @returns The string of CSS classes.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Throws an error if one is present.
 * @param error - The error message to process.
 * @throws If an error is present.
 */
export const processErrorIfPresent = (error: ErrorMessage) => {
  if (error !== undefined) {
    const { http_body } = error;
    throw new Error(JSON.stringify(http_body));
  }
};

/**
 * Formats a date string or a timestamp into a string representation.
 * @param input - The date string or the timestamp.
 * @returns The formatted date string.
 */
export function formatDate(input: string | number): string {
  const date = new Date(input);
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Generates a random integer within the provided range.
 * @param min - The lower bound of the range.
 * @param max - The upper bound of the range.
 * @returns A random integer within the provided range.
 */
export const randomIntFromInterval = (min: number, max: number) => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};

/**
 * Formats a number to two decimal points.
 * @param input - The number to format.
 * @returns The formatted number string.
 */
export function formatToTwoDecimalPoints(input: number): string {
  return input.toFixed(2);
}

/**
 * Replaces all underscores in a string with spaces and convert the string to lower case.
 * @param input - The string to format.
 * @returns The formatted string.
 */
export function removeUnderScores(input: string): string {
  // Replace all underscores with spaces
  const formatted = input.replace(/_/g, " ");

  return formatted.toLowerCase();
}

/**
 * Converts a Date object into a "time ago" string.
 * @param date - The date to convert.
 * @returns A string representing how long ago the date was.
 */
export function timeAgo(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) {
    return `${Math.floor(interval)} years ago`;
  }
  interval = seconds / 2592000;
  if (interval > 1) {
    return `${Math.floor(interval)} months ago`;
  }
  interval = seconds / 86400;
  if (interval > 1) {
    return `${Math.floor(interval)} days ago`;
  }
  interval = seconds / 3600;
  if (interval > 1) {
    return `${Math.floor(interval)} hours ago`;
  }
  interval = seconds / 60;
  if (interval > 1) {
    return `${Math.floor(interval)} minutes ago`;
  }
  return `${Math.floor(seconds)} seconds ago`;
}

/**
 * Rounds a number to two decimal places.
 * @param num - The number to round.
 * @returns The rounded number.
 */
export function roundToTwoDecimalPlaces(num: number): number {
  return Math.round((num + Number.EPSILON) * 100) / 100;
}

/**
 * Converts a YYYYMM format string into a Month Year string.
 * @param dateString - The date string to convert.
 * @returns The formatted date string.
 */
export function convertToMonth(dateString: string): string {
  const year = dateString.substr(0, 4);
  const month = dateString.substr(4, 2);

  // Convert the month number to its name
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthNumber = parseInt(month, 10) - 1;
  const monthName = monthNames[monthNumber];

  return `${monthName} ${year}`;
}

/**
 * Logs event details to the console.
 * @param eventName - The name of the event.
 * @param metadata - Metadata related to the event.
 * @param error - Any errors related to the event.
 */
export const logEvent = (
  eventName: PlaidLinkStableEvent | string,
  metadata:
    | PlaidLinkOnEventMetadata
    | PlaidLinkOnSuccessMetadata
    | PlaidLinkOnExitMetadata,
  error?: PlaidLinkError | null,
) => {};

/**
 * Logs successful Plaid Link events.
 * @param params - Metadata related to the success event.
 * @param userId - The ID of the user.
 */
export const logSuccess = async (
  { institution, accounts, link_session_id }: PlaidLinkOnSuccessMetadata,
  userId: number,
) => {
  logEvent("onSuccess", {
    institution,
    accounts,
    link_session_id,
  });
};

/**
 * Logs Plaid Link exit events.
 * @param error - Any errors related to the event.
 * @param params - Metadata related to the exit event.
 * @param userId - The ID of the user.
 */
export const logExit = async (
  error: PlaidLinkError | null,
  { institution, status, link_session_id, request_id }: PlaidLinkOnExitMetadata,
  userId: number,
) => {
  logEvent(
    "onExit",
    {
      institution,
      status,
      link_session_id,
      request_id,
    },
    error,
  );

  const eventError = error || {};
};

/**
 * Replaces all underscores in a string with spaces.
 * @param str - The string to format.
 * @returns The formatted string.
 */
export function replaceUnderscoreWithSpace(str: string): string {
  return str.replace(/_/g, " ");
}

export const formatPocketType = (type: PocketType): string => {
  switch (type) {
    case "POCKET_TYPE_UNSPECIFIED":
      return "Unspecified";
    case "POCKET_TYPE_DISCRETIONARY_SPENDING":
      return "Discretionary Spending";
    case "POCKET_TYPE_FUN_MONEY":
      return "Fun Money";
    case "POCKET_TYPE_DEBT_REDUCTION":
      return "Debt Reduction";
    case "POCKET_TYPE_EMERGENCY_FUND":
      return "Emergency Fund";
    case "POCKET_TYPE_INVESTMENT":
      return "Investment";
    case "POCKET_TYPE_SHORT_TERM_SAVINGS":
      return "Short Term Savings";
    case "POCKET_TYPE_LONG_TERM_SAVINGS":
      return "Long Term Savings";
    default:
      return "Unknown Type";
  }
};

/**
 * Converts a string with underscores to title case.
 *
 * @param {string} input - The input string to convert.
 * @returns {string} The title-cased string.
 * @example
 * const inputString = "FOOD_AND_DRINK";
 * const convertedString = convertToTitleCase(inputString);
 * console.log(convertedString); // Output: "Food and Drink"
 */
export function convertToTitleCase(input: string) {
  /**
   * Split the input string by underscores and convert to title case.
   *
   * @param {string} word - The individual word to convert.
   * @param {number} index - The index of the current word in the array.
   * @returns {string} The title-cased word.
   */
  const titleCaseWords = input.split("_").map((word, index) => {
    if (index === 0) {
      return word.toLowerCase(); // Lowercase the first word
    } else {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }
  });

  // Join the title-cased words back together with spaces
  return titleCaseWords.join(" ").toLowerCase();
}

/**
 * Converts a date from the format "YYYYMM" to "Month Year" format.
 *
 * @param {string} input - The input date in "YYYYMM" format.
 * @returns {string} The formatted date in "Month Year" format.
 * @example
 * const inputDate = "202307";
 * const formattedDate = convertToMonthYear(inputDate);
 * console.log(formattedDate); // Output: "July 2023"
 */
export function convertToMonthYear(input: string) {
  // Parse the input string
  const year = input.substr(0, 4);
  const month = input.substr(4, 2);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name based on the month number
  const monthName = monthNames[parseInt(month, 10) - 1];

  // Create the formatted string
  return `${monthName} ${year}`;
}

export const monthNumberToString = (monthNumber: number): string => {
  // Convert the input number to a string
  const inputString = monthNumber.toString();

  // Ensure the input string has at least 6 characters (YYYYMM)
  if (inputString.length !== 6) {
    throw new Error("Input should be in the format YYYYMM");
  }

  // Parse the input string
  const year = inputString.substr(0, 4);
  const month = inputString.substr(4, 2);

  // Define an array of month names
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  // Get the month name based on the month number
  const monthName = monthNames[parseInt(month, 10) - 1];

  return monthName;
};

/**
 * Capitalizes the first letter of each word in a sentence while keeping the rest of the words in lowercase.
 *
 * @param {string} sentence - The input sentence to be capitalized.
 * @returns {string} A new string with the first letter of each word capitalized.
 *
 * @example
 * const sentence = "this is a sample sentence";
 * const capitalizedSentence = capitalizeFirstLetterOfWords(sentence);
 * console.log(capitalizedSentence); // Output: "This Is A Sample Sentence"
 */
export function capitalizeFirstLetterOfWords(sentence: string): string {
  const words = sentence.split(" ");
  const capitalizedWords = words.map((word) => {
    if (word.length === 0) {
      return word; // Return an empty word as is
    }
    const firstLetter = word.charAt(0).toUpperCase();
    const restOfString = word.slice(1).toLowerCase();
    return firstLetter + restOfString;
  });
  return capitalizedWords.join(" ");
}

/**
 * Checks if the provided object has no own properties.
 *
 * @param obj - The object to check.
 * @returns True if the object is empty; otherwise, false.
 */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export enum AccountViolationType {
  ACCOUNT_VIOLATION_TYPE_UNAUTHENTICATED = "ACCOUNT_VIOLATION_TYPE_UNAUTHENTICATED",
  ACCOUNT_VIOLATION_TYPE_UNVERIFIED_EMAIL = "ACCOUNT_VIOLATION_TYPE_UNVERIFIED_EMAIL",
  ACCOUNT_VIOLATION_TYPE_NO_SUBSCRIPTION = "ACCOUNT_VIOLATION_TYPE_NO_SUBSCRIPTION",
  ACCOUNT_VIOLATION_TYPE_NO_CONNECTED_ACCOUNTS = "ACCOUNT_VIOLATION_TYPE_NO_CONNECTED_ACCOUNTS",
  ACCOUNT_VIOLATION_UNSPECIFIED = "ACCOUNT_VIOLATION_UNSPECIFIED",
}

/**
 * Determines the type of account violation based on the user's account and financial profile.
 * @param user_account - The user's account information.
 * @param profile - The user's financial profile.
 * @returns The type of account violation.
 */
export const determineAccountViolationType = (
  user_account: UserAccountClass,
  profile: FinancialUserProfile,
): AccountViolationType => {
  // Check if the user is authenticated
  if (!user_account.isEmailVerified) {
    return AccountViolationType.ACCOUNT_VIOLATION_TYPE_UNVERIFIED_EMAIL;
  }

  // Check subscription status and navigate accordingly
  const hasSubscriptions =
    profile.stripeSubscriptions != null &&
    profile.stripeSubscriptions != undefined;
  const hasConnectedAccounts =
    Array.isArray(profile.link) && profile.link.length > 0;

  if (!hasSubscriptions) {
    // Business account routing logic could go here if needed
    return AccountViolationType.ACCOUNT_VIOLATION_TYPE_NO_SUBSCRIPTION;
  } else if (!hasConnectedAccounts) {
    return AccountViolationType.ACCOUNT_VIOLATION_TYPE_NO_CONNECTED_ACCOUNTS;
  }

  return AccountViolationType.ACCOUNT_VIOLATION_UNSPECIFIED;
};

/**
 * Determines the next page to navigate to based on the user's account and financial profile.
 * @param user_account - The user's account information.
 * @param profile - The user's financial profile.
 * @returns The route to navigate to.
 */
export const decipherNextPage = (
  user_account: UserAccount,
  profile: FinancialUserProfile,
): string => {
  const violationType = determineAccountViolationType(
    new UserAccountClass(user_account),
    profile,
  );
  switch (violationType) {
    case AccountViolationType.ACCOUNT_VIOLATION_TYPE_UNVERIFIED_EMAIL:
      return routes.EMAILVERIFICATION;
    case AccountViolationType.ACCOUNT_VIOLATION_TYPE_NO_SUBSCRIPTION:
      if (user_account.accountType === "PROFILE_TYPE_BUSINESS") {
        return routes.BUSINESS_PAYMENT;
      } else {
        return routes.CONSUMER_PAYMENT;
      }
    case AccountViolationType.ACCOUNT_VIOLATION_TYPE_NO_CONNECTED_ACCOUNTS:
      return routes.CONNECT_BANK_ACCOUNT;
    default:
      return routes.HOME;
  }
};

/**
 * isAccountInViolation determines if the user's account is in violation of any rules.
 * @param user_account
 * @param profile
 * @returns
 */
export const isAccountInViolation = (
  user_account: UserAccountClass,
  profile: FinancialUserProfile,
): boolean => {
  return (
    determineAccountViolationType(user_account, profile) !==
    AccountViolationType.ACCOUNT_VIOLATION_UNSPECIFIED
  );
};

export const enrichPaymentLink = (
  paymentLinkPrefix: string,
  stripeCustomerId?: string,
  email?: string,
): string => {
  let targetUrl = "";
  if (stripeCustomerId && email) {
    targetUrl = `${paymentLinkPrefix}?prefilled_email=${email}&client_reference_id=${stripeCustomerId}`;
  } else if (email) {
    targetUrl = `${paymentLinkPrefix}?prefilled_email=${email}`;
  } else {
    targetUrl = `${paymentLinkPrefix}`;
  }

  return targetUrl;
};
