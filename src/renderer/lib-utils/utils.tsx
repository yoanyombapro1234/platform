import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  PlaidLinkOnSuccessMetadata,
  PlaidLinkOnExitMetadata,
  PlaidLinkStableEvent,
  PlaidLinkOnEventMetadata,
  PlaidLinkError,
} from "react-plaid-link";
import {
  ErrorMessage,
  PersonalActionableInsightName,
  PlaidAccountTransaction,
  PocketType,
} from "@solomon-ai/component-library";

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
export function formatDate(input: string | number | undefined): string {
  if (input === undefined) {
    return "";
  }
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
 * Formats a number to a defined number of decimal points.
 * @param input - The number to format.
 * @returns The formatted number string.
 */
export function formatNumber(
  input: number | undefined,
  numberOfDecimalPoint: number
): string {
  if (input === undefined) {
    return "";
  }

  return input.toFixed(numberOfDecimalPoint);
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
 *
 * @param inputString
 * @returns  A string array of the parts of the input string split by comma.
 * @example
 * const inputString = "a, b, c";
 * const parts = splitStringByComma(inputString);
 * console.log(parts); // Output: ["a", "b", "c"]
 */
export function splitStringByComma(inputString: string): string[] {
  // Split the input string by comma and trim whitespace from each part
  const parts = inputString.split(",").map((part) => part.trim());
  return parts;
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
export function convertMonth(monthInput: string | number): string {
  // Convert input to a number if it's a string
  const monthNumber =
    typeof monthInput === "string" ? parseInt(monthInput, 10) : monthInput;

  if (isNaN(monthNumber) || monthNumber < 101 || monthNumber > 999912) {
    throw new Error("Invalid month input");
  }

  const year = Math.floor(monthNumber / 100);
  const month = monthNumber % 100;

  // Define an array of month names
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the month name based on the month number
  const monthName = monthNames[month - 1];

  // Convert the year to a 2-digit format

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
  userId?: number
) => {};

/**
 * Logs successful Plaid Link events.
 * @param params - Metadata related to the success event.
 * @param userId - The ID of the user.
 */
export const logSuccess = async (
  { institution, accounts, link_session_id }: PlaidLinkOnSuccessMetadata,
  userId: number
) => {
  logEvent(
    "onSuccess",
    {
      institution,
      accounts,
      link_session_id,
    },
    null,
    userId
  );
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
  userId: number
) => {
  logEvent(
    "onExit",
    {
      institution,
      status,
      link_session_id,
      request_id,
    },
    error
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

/**
 * Helper function to format the pocket name string.
 *
 * @param input - The pocket name string to format.
 * @returns The formatted pocket name string.
 */
export function formatPocketName(input: string): string {
  const prefix = "POCKET_TYPE_";

  // Remove the prefix
  let formatted = input.startsWith(prefix) ? input.slice(prefix.length) : input;

  // Replace all underscores with spaces
  formatted = formatted.replace(/_/g, " ");

  return formatted.toLowerCase();
}

export function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function getRandomString(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export function getRandomArrayItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function getRandomDate(start: Date, end: Date): string {
  const randomDate = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return randomDate.toISOString().split("T")[0];
}

export function getRandomBoolean(): boolean {
  return Math.random() > 0.5;
}

export function getRandomSubcategories(): string[] {
  const count = getRandomNumber(1, 5); // for instance, each category can have 1 to 5 subcategories
  const subcategories: string[] = [];
  for (let i = 0; i < count; i++) {
    subcategories.push(getRandomString(5));
  }
  return subcategories;
}

export function getRandomAmount(): string {
  return (Math.random() * 10000).toFixed(2);
}

export function getRandomBalance(): number {
  return +(Math.random() * 10000).toFixed(2);
}

export function getRandomStringWithPrefix(length: number, prefix = ""): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return prefix + result;
}

export function getRandomDateInRange(startYear: number, endYear: number): Date {
  const year = getRandomNumber(startYear, endYear);
  const month = getRandomNumber(0, 11);
  const day = getRandomNumber(1, 28); // Simple method to ensure valid day for all months
  return new Date(year, month, day);
}

export const formatFrequency = (frequency: string): string => {
  switch (frequency) {
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_ANNUALLY":
      return "Annually";
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_MONTHLY":
      return "Monthly";
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_BIWEEKLY":
      return "BiWeekly";
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_SEMI_MONTHLY":
      return "Semi-Monthly";
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_WEEKLY":
      return "Weekly";
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_UNSPECIFIED":
      return "Unspecified";
    case "UNRECOGNIZED":
      return "Unrecognized";
    default:
      return "Unknown";
  }
};

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

export const convertToReadablePersonalInsightName = (
  insightName: PersonalActionableInsightName
): string => {
  // Splitting based on underscore
  const words = insightName.split("_");

  // Removing redundant prefix and returning the cleaned, joined string
  return words
    .slice(3)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
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
/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
export function isEmptyObject(obj: Record<string, any>): boolean {
  return Object.keys(obj).length === 0;
}

export function filterTransactionsByDate(
  transactions: PlaidAccountTransaction[],
  dateRange: "week" | "past3days" | "today"
): PlaidAccountTransaction[] {
  const currentDate = new Date();

  // Calculate the start date based on the selected date range.
  let startDate = new Date();
  if (dateRange === "week") {
    startDate.setDate(currentDate.getDate() - 7);
  } else if (dateRange === "past3days") {
    startDate.setDate(currentDate.getDate() - 3);
  } else if (dateRange === "today") {
    startDate = currentDate;
  }

  // Filter transactions within the specified date range.
  const filteredTransactions = transactions.filter((transaction) => {
    if (transaction.authorizedDate) {
      const transactionDate = new Date(transaction.authorizedDate);
      return transactionDate >= startDate && transactionDate <= currentDate;
    }
    return false;
  });

  return filteredTransactions;
}
