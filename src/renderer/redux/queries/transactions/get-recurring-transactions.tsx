import {
  GetReCurringTransactionsRequestClass,
  GetReCurringTransactionsResponseClass,
  ReOccuringTransaction,
  ReOccuringTransactionsFrequency,
  ReCurringFlow,
} from "@solomon-ai/component-library";
import { api } from "src/redux/api/api";
import {
  RecurringTransactionAggregate,
  UpcomingRecurringTransactions,
} from "src/types/custom/recurring-transaction-types";

/**
 * `GetRecurringTransactions` is a function defined within the `api` object's `injectEndpoints` method.
 * This function is responsible for making a GET request to fetch all the recurring transactions for a specific user.
 *
 * @param {GetReCurringTransactionsRequest} req - A request object containing the `userId` for which the recurring transactions are fetched.
 *
 * @returns {RecurringTransactionAggregate} A transformed response derived from the raw response `GetReCurringTransactionsResponse`.
 *
 * Detailed Transformations:
 * 1. `inflowTransactions`: An array of transactions where the `flow` property is `"RE_CURRING_FLOW_INFLOW"`.
 * 2. `outflowTransactions`: An array of transactions where the `flow` property is `"RE_CURRING_FLOW_OUTFLOW"`.
 * 3. `statusToRecurringTransactionMap`: An object mapping transaction statuses to the transactions associated with them.
 * 4. `frequencyToRecurringTransactionMap`: An object mapping transaction frequencies to the transactions associated with them.
 * 5. `orderedRecurringTransactions`: An array of transactions sorted in descending order based on the number of `transactionIds`.
 * 6. `totalRecurringTransactions`: The total count of all recurring transactions.
 * 7. `totalRecurringTransactionCosts`: The total cost of all recurring transactions.
 * 8. `upcomingRecurringTransactions`: An array of upcoming transactions computed based on the last transaction date and frequency, sorted by date.
 * 9. `merchantToAveragePaymentMap`: An object mapping each merchant to the average payment made.
 * 10. `merchantToTransactionCountMap`: An object mapping each merchant to their number of transactions.
 * 11. `mostCommonMerchant`: The merchant associated with the most transactions.
 * 12. `mostExpensiveMerchant`: The merchant associated with the highest average payment.
 *
 * The function also provides a list of tags derived from the `orderedRecurringTransactions` for cache invalidation or update purposes
 * with Redux Toolkit Query.
 */
const GetRecurringTransactions = api.injectEndpoints({
  endpoints: (builder) => ({
    getRecurringTransactions: builder.query({
      query: (req: GetReCurringTransactionsRequestClass) => ({
        url: `/v1/gateway/service/financials/recurring-transactions/${req.userId}`,
      }),
      transformResponse: (
        response: GetReCurringTransactionsResponseClass
      ): RecurringTransactionAggregate => {
        // filter out all inactive transactions
        response.reCcuringTransactions = response.reCcuringTransactions.filter(
          (transaction) => transaction.isActive === true
        );

        // we need to get the recurring transaction and do some processing to the object
        // get all transaction with flow type "outflow"
        const inflowTransactions = response.reCcuringTransactions.filter(
          (transaction) => transaction.flow === "RE_CURRING_FLOW_INFLOW"
        );

        // get all transaction with flow type "outflow"
        const outflowTransactions = response.reCcuringTransactions.filter(
          (transaction) => transaction.flow === "RE_CURRING_FLOW_OUTFLOW"
        );

        // create a hashmap of recurring transaction status as key and array of transactions as value
        const statusToRecurringTransactionMap =
          response.reCcuringTransactions.reduce(
            (acc, transaction) => {
              if (transaction.status) {
                // Ensure that status is defined and truthy
                if (acc[transaction.status]) {
                  acc[transaction.status].push(transaction);
                } else {
                  acc[transaction.status] = [transaction];
                }
              }
              return acc;
            },
            {} as Record<string, ReOccuringTransaction[]>
          );

        // do the same for frequency
        const frequencyToRecurringTransactionMap =
          response.reCcuringTransactions.reduce(
            (acc, transaction) => {
              if (transaction.frequency) {
                if (acc[transaction.frequency]) {
                  acc[transaction.frequency].push(transaction);
                } else {
                  acc[transaction.frequency] = [transaction];
                }
              }
              return acc;
            },
            {} as Record<string, ReOccuringTransaction[]>
          );

        // order recurring transactions by number of transactionIds
        const orderedRecurringTransactions = response.reCcuringTransactions
          ? [...response.reCcuringTransactions].sort(
              (a, b) =>
                (b.transactionIds ? b.transactionIds.length : 0) -
                (a.transactionIds ? a.transactionIds.length : 0)
            )
          : [];
        // compute total recurring transactions
        const totalRecurringTransactions =
          response.reCcuringTransactions.length;

        // compute total recurring transaction costs
        const totalRecurringTransactionCosts =
          response.reCcuringTransactions.reduce(
            (acc, transaction) => acc + Number(transaction.averageAmount),
            0
          );

        // compute upcoming recurring transactions based off of the last transaction date and frequency
        const upcomingRecurringTransactions: UpcomingRecurringTransactions[] =
          getUpcomingRecurringTransactions(response.reCcuringTransactions);

        // now based off of all the computed next transaction dates, we need to sort them by date
        const sortedUpcomingRecurringTransactions: UpcomingRecurringTransactions[] =
          upcomingRecurringTransactions.sort((a, b) => {
            const aDate = new Date(a.nextTransactionDate);
            const bDate = new Date(b.nextTransactionDate);
            return aDate.getTime() - bDate.getTime();
          });

        const merchantToAvgPaymentHashmap = averagePaymentPerMerchant(
          response.reCcuringTransactions
        );

        const numTransactionsPerMerchant = transactionsPerMerchant(
          response.reCcuringTransactions
        );

        const mostCommonMerchant = mostCommonCategory(
          response.reCcuringTransactions
        );

        const expensivePayment = mostExpensivePayment(
          response.reCcuringTransactions
        );

        const res: RecurringTransactionAggregate = {
          inflowTransactions: inflowTransactions,
          outflowTransactions: outflowTransactions,
          statusToRecurringTransactionMap: statusToRecurringTransactionMap,
          frequencyToRecurringTransactionMap:
            frequencyToRecurringTransactionMap,
          orderedRecurringTransactions: orderedRecurringTransactions,
          totalRecurringTransactions: totalRecurringTransactions,
          totalRecurringTransactionCosts: totalRecurringTransactionCosts,
          upcomingRecurringTransactions: sortedUpcomingRecurringTransactions,
          merchantToAveragePaymentMap: merchantToAvgPaymentHashmap,
          merchantToTransactionCountMap: numTransactionsPerMerchant,
          mostCommonMerchant: mostCommonMerchant,
          mostExpensiveMerchant: expensivePayment.merchantName,
        };

        return res;
      },
      providesTags: (result) =>
        result && result.orderedRecurringTransactions
          ? result.orderedRecurringTransactions.map((transaction) => ({
              type: "RECURRING_TRANSACTION",
              id: transaction.id,
            }))
          : ["RECURRING_TRANSACTION"],
    }),
  }),
  overrideExisting: false,
});

/**
 * `averagePaymentPerMerchant` calculates the average payment made to each merchant across all transactions.
 *
 * @param {ReOccuringTransaction[]} recurringTransactions - Array of recurring transactions to process.
 *
 * @returns {Object} An object with merchant names as keys and average payment amounts as values.
 */
function averagePaymentPerMerchant(
  recurringTransactions: ReOccuringTransaction[]
): {
  [key: string]: number;
} {
  let totals: Record<string, number> = {};
  let counts: Record<string, number> = {};

  recurringTransactions.forEach((transaction) => {
    if (
      transaction.merchantName === undefined ||
      transaction.averageAmount === undefined
    )
      return;

    if (totals[transaction.merchantName]) {
      totals[transaction.merchantName] += parseFloat(transaction.averageAmount);
      counts[transaction.merchantName]++;
    } else {
      totals[transaction.merchantName] = parseFloat(transaction.averageAmount);
      counts[transaction.merchantName] = 1;
    }
  });

  let averages: Record<string, number> = {};
  for (let merchant in totals) {
    averages[merchant] = totals[merchant] / counts[merchant];
  }

  return averages;
}

/**
 * `transactionsPerMerchant` calculates the total number of transactions made to each merchant.
 *
 * @param {ReOccuringTransaction[]} recurringTransactions - Array of recurring transactions to process.
 *
 * @returns {Object} An object with merchant names as keys and the count of transactions as values.
 */
function transactionsPerMerchant(
  recurringTransactions: ReOccuringTransaction[]
): {
  [key: string]: number;
} {
  let counts: Record<string, number> = {};

  recurringTransactions.forEach((transaction) => {
    if (
      transaction.merchantName === undefined ||
      transaction.transactionIds === undefined
    )
      return;

    if (counts[transaction.merchantName]) {
      counts[transaction.merchantName] += transaction.transactionIds.length;
    } else {
      counts[transaction.merchantName] = transaction.transactionIds.length;
    }
  });

  return counts;
}

/**
 * `mostCommonCategory` identifies the most common category among the transactions.
 *
 * @param {ReOccuringTransaction[]} recurringTransactions - Array of recurring transactions to process.
 *
 * @returns {string} The most common category among the transactions.
 */
function mostCommonCategory(
  recurringTransactions: ReOccuringTransaction[]
): string {
  let categories: Record<string, number> = {};

  recurringTransactions.forEach((transaction) => {
    if (transaction.personalFinanceCategoryPrimary === undefined) return;

    if (categories[transaction.personalFinanceCategoryPrimary]) {
      categories[transaction.personalFinanceCategoryPrimary]++;
    } else {
      categories[transaction.personalFinanceCategoryPrimary] = 1;
    }
  });

  let maxCount = 0;
  let mostCommon = "";

  for (let category in categories) {
    if (categories[category] > maxCount) {
      maxCount = categories[category];
      mostCommon = category;
    }
  }

  return mostCommon;
}

/**
 * `mostExpensivePayment` identifies the most expensive transaction from the list.
 *
 * @param {ReOccuringTransaction[]} recurringTransactions - Array of recurring transactions to process.
 *
 * @returns {any} The most expensive transaction from the list.
 */
function mostExpensivePayment(
  recurringTransactions: ReOccuringTransaction[]
): any {
  if (recurringTransactions.length === 0) return;

  let mostExpensive = recurringTransactions[0];

  recurringTransactions.forEach((transaction) => {
    if (
      transaction.averageAmount === undefined ||
      mostExpensive.averageAmount === undefined
    )
      return;

    if (
      parseFloat(transaction.averageAmount) >
      parseFloat(mostExpensive.averageAmount)
    ) {
      mostExpensive = transaction;
    }
  });

  return mostExpensive;
}

/**
 * computes the next transaction date based on the last transaction date and the
 * frequency of the transaction. This encapsulates the logic for calculating the
 * next transaction date in a separate function, making it reusable and easier to understand.
 * @param lastTransactionDate
 * @param frequency
 * @returns
 */
function calculateNextTransactionDate(
  lastTransactionDate: Date,
  frequency: ReOccuringTransactionsFrequency
): Date {
  let nextTransactionDate = new Date(lastTransactionDate);
  switch (frequency) {
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_WEEKLY":
      nextTransactionDate.setDate(lastTransactionDate.getDate() + 7);
      break;
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_BIWEEKLY":
      nextTransactionDate.setDate(lastTransactionDate.getDate() + 14);
      break;
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_MONTHLY":
      nextTransactionDate.setMonth(lastTransactionDate.getMonth() + 1);
      break;
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_SEMI_MONTHLY":
      nextTransactionDate.setDate(lastTransactionDate.getDate() + 15); // Assuming two transactions per month
      break;
    case "RE_OCCURING_TRANSACTIONS_FREQUENCY_ANNUALLY":
      nextTransactionDate.setFullYear(lastTransactionDate.getFullYear() + 1);
      break;
  }
  return nextTransactionDate;
}

/*
 * takes a response object that includes a list of recurring transactions, and it uses
 * calculateNextTransactionDate to calculate the next transaction date for each transaction,
 * and then return an array of upcoming transactions.
 *
 * @param {{
 *   reCcuringTransactions: ReOccuringTransaction[];
 * }} response
 * @returns {UpcomingRecurringTransactions[]}
 * */
function getUpcomingRecurringTransactions(
  reCcuringTransactions: ReOccuringTransaction[]
): UpcomingRecurringTransactions[] {
  const lastDayOfCurrentYear = new Date(new Date().getFullYear(), 12, 31);
  return reCcuringTransactions
    .map((transaction) => {
      if (
        transaction.frequency === undefined ||
        transaction.lastDate === undefined
      ) {
        return null;
      }

      const lastTransactionDate = new Date(transaction.lastDate);
      const nextTransactionDate = calculateNextTransactionDate(
        lastTransactionDate,
        transaction.frequency
      );

      if (nextTransactionDate > lastDayOfCurrentYear) {
        return null;
      }

      return {
        nextTransactionDate: nextTransactionDate.toISOString(),
        transaction: transaction,
      };
    })
    .filter(
      (transaction): transaction is UpcomingRecurringTransactions =>
        transaction !== null
    );
}

export { GetRecurringTransactions };
export const { useGetRecurringTransactionsQuery } = GetRecurringTransactions;
