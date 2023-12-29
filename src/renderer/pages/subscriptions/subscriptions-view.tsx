import React from "react";
import { SubscriptionSidebar } from "src/components/sidebar/recurring-subscriptions-sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Calendar } from "src/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { Overview } from "../../components/overview";
import {
  SubscriptionsSidebarOption,
  UpcomingRecurringTransactions,
} from "src/types/custom/recurring-transaction-types";

import { replaceUnderscoreWithSpace } from "src/lib/utils";
import { RecurringTransactionDatatable } from "src/components/recurring-transaction-data-table";
import {
  ReOccuringTransaction,
  ReOccuringTransactionClass,
  ReOccuringTransactionsFrequency,
  ReOccuringTransactionsStatus,
} from "@solomon-ai/component-library";
import { mixPanelClient } from "src/lib/mixpanel";
import { RecurringTransactionCard } from "src/components/cards/reocurring-transaction-card";

interface IRecurringTransactionProps {
  recurring_transactions: ReOccuringTransaction[];
}

interface IRecurringTransactionState {
  recurring_transactions: ReOccuringTransaction[];
  total_costs: number;
  total_transactions: number;
  selected_sidebar_tab: SubscriptionsSidebarOption;
}

/**
 * Recurring transaction Overview serves as the overarching summary of all recurring transactions
 * a given user has
 *
 * @class SubscriptionsView
 * @extends {React.Component<IRecurringTransactionProps, IRecurringTransactionState>}
 */
class SubscriptionsView extends React.Component<
  IRecurringTransactionProps,
  IRecurringTransactionState
> {
  constructor(props: IRecurringTransactionProps) {
    super(props);
    this.state = {
      recurring_transactions: props.recurring_transactions,
      total_costs: props.recurring_transactions.reduce(
        (acc, transaction) => acc + Number(transaction.averageAmount),
        0
      ),
      total_transactions: props.recurring_transactions.length,
      selected_sidebar_tab: "OVERVIEW",
    };

    // bind the inflow computations
    this.computeInflowTransactions = this.computeInflowTransactions.bind(this);
    // bind the outflow computation
    this.computeOutflowTransactions =
      this.computeOutflowTransactions.bind(this);
    // bind the upcoming transaction computation
    this.computeUpcomingTransactions =
      this.computeUpcomingTransactions.bind(this);
    // bind the transaction status to recurring transaction set
    this.computeStatusToRecurringTransactions =
      this.computeStatusToRecurringTransactions.bind(this);

    this.computeCategoriesToRecurringTransactionMap =
      this.computeCategoriesToRecurringTransactionMap.bind(this);

    // calculate the next transaction date
    this._calculateNextTransactionDate =
      this._calculateNextTransactionDate.bind(this);

    this._selectSidebarOption = this._selectSidebarOption.bind(this);
    this._computeContext = this._computeContext.bind(this);

    mixPanelClient.trackViewSubscriptionsFeatureEvent({
      time: new Date().toDateString(),
    });
  }

  /*
   * computeInflowTransactions computes the transactions that are currently inflowing
   * meaning re-curring income sources
   *
   * @memberOf SubscriptionsView
   * */
  computeInflowTransactions = (): ReOccuringTransaction[] => {
    const { recurring_transactions } = this.state;
    const currentYear = new Date().getFullYear();

    // obtain all transactions that are inflows and that occured this year
    const inflow_transactions = recurring_transactions.filter((transaction) => {
      if (transaction.lastDate) {
        // Check if lastDate is defined
        const transactionYear = new Date(transaction.lastDate).getFullYear();
        return (
          // plaid transaction amounts are marked as inflow if negative and outflow
          // if positive
          Number(transaction.averageAmount) < 0 &&
          Number(transaction.lastAmount) < 0 &&
          transactionYear === currentYear
        );
      }
      return false; // Exclude the transaction if lastDate is not defined
    });

    return inflow_transactions;
  };

  /**
   * Computes all outflow transactions that occured this year
   * @param transactions the transactions that occured
   * @returns
   */
  computeOutflowTransactions = (): ReOccuringTransaction[] => {
    const { recurring_transactions } = this.state;
    const currentYear = new Date().getFullYear();

    // obtain all transactions that are outflows and that occured this year
    const outflow_transactions = recurring_transactions.filter(
      (transaction) => {
        if (transaction.lastDate) {
          // Check if lastDate is defined
          const transactionYear = new Date(transaction.lastDate).getFullYear();
          return (
            // plaid transaction amounts are marked as inflow if negative and outflow
            // if positive
            Number(transaction.averageAmount) > 0 &&
            Number(transaction.lastAmount) > 0 &&
            transactionYear === currentYear
          );
        }
        return false; // Exclude the transaction if lastDate is not defined
      }
    );

    return outflow_transactions;
  };

  /**
   * computes the upcoming transactions based on all the transactions that occured this year
   *
   * @memberOf SubscriptionsView
   */
  computeUpcomingTransactions =
    (): ReadonlyArray<UpcomingRecurringTransactions> => {
      const { recurring_transactions } = this.state;
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();

      // we get all transactions that occured this year
      const transactionsThisYear = recurring_transactions.filter(
        (transaction) => {
          // Ensure that transaction.lastDate is defined before creating a Date object
          if (!transaction.lastDate || !transaction.isActive) return false;

          const transactionYear = new Date(transaction.lastDate).getFullYear();

          return (
            transactionYear === currentYear &&
            // Ensure that transaction.frequency is defined and then check its value
            transaction.frequency &&
            transaction.frequency !==
              "RE_OCCURING_TRANSACTIONS_FREQUENCY_UNSPECIFIED"
          );
        }
      );

      // from the transactions that occured this year, we use the frequency field
      // to calculate the next date the transaction will be scheduled
      const lastDayOfCurrentYear = new Date(new Date().getFullYear(), 11, 31);
      const upcomingTransactions: readonly UpcomingRecurringTransactions[] =
        transactionsThisYear
          .map((transaction) => {
            // Check if transaction.lastDate is defined
            if (!transaction.lastDate || !transaction.frequency) {
              return null;
            }

            // Check if transaction.frequency is set to "RE_OCCURING_TRANSACTIONS_FREQUENCY_UNSPECIFIED"
            if (
              transaction.frequency ===
              "RE_OCCURING_TRANSACTIONS_FREQUENCY_UNSPECIFIED"
            ) {
              return null;
            }

            const lastTransactionDate = new Date(transaction.lastDate);
            const nextTransactionDate = this._calculateNextTransactionDate(
              lastTransactionDate,
              transaction.frequency
            );

            // Check if nextTransactionDate is null
            if (nextTransactionDate == null) {
              return null;
            }

            // Check if nextTransactionDate is after the last day of the current year
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

      return upcomingTransactions;
    };

  /*
   * computes a hash map comprised of status to recurring transaction mapping
   *
   * @param {ReOccuringTransaction[]} recurringTransactions
   * @returns {Map<ReOccuringTransactionsStatus, ReOccuringTransaction[]>}
   *
   * @memberOf SubscriptionsView
   * */
  computeStatusToRecurringTransactions(
    recurringTransactions: ReOccuringTransaction[]
  ): Map<ReOccuringTransactionsStatus, ReOccuringTransaction[]> {
    const statusToRecurringTransactions = new Map<
      ReOccuringTransactionsStatus,
      ReOccuringTransaction[]
    >();

    recurringTransactions.forEach((recurringTransaction) => {
      const status = recurringTransaction.status;

      if (status !== undefined) {
        // Ensure that status is defined
        const existingTransactions =
          statusToRecurringTransactions.get(status) || [];

        // Append the recurringTransaction to the existingTransactions array
        existingTransactions.push(recurringTransaction);

        // Set the updated array back to the Map
        statusToRecurringTransactions.set(status, existingTransactions);
      }
    });

    return statusToRecurringTransactions;
  }

  /*
   * computes a hashmap comprised of categories to recurring transactions
   *
   * @param {ReOccuringTransaction[]} recurringTransactions
   * @returns {Map<string, ReOccuringTransaction[]>}
   *
   * @memberOf SubscriptionsView
   * */
  computeCategoriesToRecurringTransactionMap(): Map<
    string,
    ReOccuringTransaction[]
  > {
    const categoriesToRecurringTransactions = new Map<
      string,
      ReOccuringTransaction[]
    >();

    this.state.recurring_transactions.forEach((recurringTransaction) => {
      const category = recurringTransaction.personalFinanceCategoryPrimary;

      if (category) {
        // Check if category is defined
        const existingTransactions =
          categoriesToRecurringTransactions.get(category) || [];

        // Append the recurringTransaction to the existingTransactions array
        existingTransactions.push(recurringTransaction);

        // Set the updated array back to the Map
        categoriesToRecurringTransactions.set(category, existingTransactions);
      }
    });

    return categoriesToRecurringTransactions;
  }
  private _calculateNextTransactionDate = (
    lastTransactionDate: Date | undefined,
    frequency: ReOccuringTransactionsFrequency
  ): Date | null => {
    if (!lastTransactionDate) {
      return null; // if the lastTransactionDate is undefined or null, return null
    }

    let nextTransactionDate = new Date(lastTransactionDate);
    switch (frequency.toString()) {
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
      default:
        break;
    }
    return nextTransactionDate;
  };

  private _selectSidebarOption = (option: SubscriptionsSidebarOption) => {
    this.setState({ selected_sidebar_tab: option });
  };

  private _computeContext = (): any => {
    const outflow = this.computeOutflowTransactions();
    // sort the outflow transactions
    const sortedOutflow = outflow.sort((a, b) => {
      return Number(b.lastAmount) - Number(a.lastAmount);
    });

    // return only the top 8 transactions
    const topOutflow = sortedOutflow.slice(0, 8);
    // make sure the transaction id list is empty
    const result = topOutflow.map((transaction) => {
      // we dont copy everything over in order to keep the context small
      const updatedTransaction = new ReOccuringTransactionClass({
        merchantName: transaction.merchantName,
        personalFinanceCategoryPrimary:
          transaction.personalFinanceCategoryPrimary,
        personalFinanceCategoryDetailed:
          transaction.personalFinanceCategoryDetailed,
        lastAmount: transaction.lastAmount,
        lastDate: transaction.lastDate,
        frequency: transaction.frequency,
        status: transaction.status,
        isActive: transaction.isActive,
      });
      return updatedTransaction;
    });

    return result;
  };

  render() {
    const sampleQuestions: string[] = [
      "What subscriptions am I currently paying for?",
      "How much does each subscription cost me monthly/annually?",
      "Which subscriptions are non-essential?",
      "Do any of my subscriptions have overlapping services?",
    ];
    return (
      <>
        <div className="md:hidden">
          <Avatar className="block dark:hidden" />
          <Avatar className="hidden dark:block" />
        </div>
        <div className="hidden md:block">
          <div className="border-t">
            <div className="bg-background">
              <div className="grid lg:grid-cols-5">
                {/** Sidebar is used to control the various types of subscriptions being shown to an end-user */}
                <SubscriptionSidebar
                  className="hidden lg:block"
                  setSelectedOption={this._selectSidebarOption}
                />
                <div className="col-span-3 lg:col-span-4 lg:border-l">
                  {this.state.selected_sidebar_tab === "OVERVIEW" && (
                    <AskMelodiyAILayout
                      context={this._computeContext()}
                      className="m-2 shadow-none border-0"
                      sampleQuestions={sampleQuestions}
                    >
                      <OverviewComponent
                        inflowTransactions={this.computeInflowTransactions()}
                        outflowTransactions={this.computeOutflowTransactions()}
                        allRecursiveTransactions={
                          this.state.recurring_transactions
                        }
                        totalRecurringTransactions={
                          this.state.total_transactions
                        }
                        totalRecurringTransactionCosts={this.state.total_costs}
                        categoriesToRecurringTransactions={this.computeCategoriesToRecurringTransactionMap()}
                      />
                    </AskMelodiyAILayout>
                  )}
                  {this.state.selected_sidebar_tab === "INFLOW" && (
                    <RecurringTransactionsFlowComponent
                      recurringTransactions={this.computeInflowTransactions()}
                      title="Inflow"
                      description={`
                        An inflow refers to the amount of money that is coming into a person's or a company's account.
                        This typically includes income such as salaries, wages, bonuses, interest earned, dividends, 
                        capital gains, proceeds from a sale, loan proceeds, and any other form of income or receipt of money.
                        
                        In essence, it represents money that is being earned or received, as opposed to an outflow, which represents 
                        money that is being spent or paid out. Monitoring inflows and outflows is critical for budgeting and financial
                         planning, as it provides a clear picture of where money is coming from and where it is being spent.
                      `}
                    />
                  )}
                  {this.state.selected_sidebar_tab === "OUTFLOW" && (
                    <RecurringTransactionsFlowComponent
                      recurringTransactions={this.computeOutflowTransactions()}
                      title="Outflow"
                      description={`
                        An outflow refers to the money
                        that is going out of a person's or a company's account. This typically includes expenses 
                        such as bill payments, purchases, salaries, taxes, loan repayments, and any other form of spending or investment.
                        In essence, it represents money that is being spent, as opposed to an inflow, which represents money that is being 
                        earned or received. Monitoring inflows and outflows is crucial for budgeting and financial planning, 
                        as it provides a clear picture of where money is coming from and where it's being spent.
                      `}
                    />
                  )}
                  {/** If sidebar tab upcoming show the upcoming recurring transactions */}
                  {this.state.selected_sidebar_tab === "UPCOMING" && (
                    <UpcomingRecurringTransactionsComponent
                      upcomingTransactions={this.computeUpcomingTransactions()}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}

interface IOverviewProps {
  inflowTransactions: ReOccuringTransaction[];
  outflowTransactions: ReOccuringTransaction[];
  allRecursiveTransactions: ReOccuringTransaction[];
  totalRecurringTransactions: number;
  totalRecurringTransactionCosts: number;
  categoriesToRecurringTransactions: Map<string, ReOccuringTransaction[]>;
}

const OverviewComponent: React.FC<IOverviewProps> = (props) => {
  const {
    inflowTransactions,
    outflowTransactions,
    totalRecurringTransactions,
    totalRecurringTransactionCosts,
    categoriesToRecurringTransactions,
    allRecursiveTransactions,
  } = props;

  const categories = Array.from(categoriesToRecurringTransactions.keys());

  // sort and get top 5 most expensive transactions
  const sortedSubscriptions = allRecursiveTransactions
    .map((transaction) => {
      return {
        transaction: transaction,
        amount: Math.abs(Number(transaction.lastAmount)),
      };
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 10)
    .map((transaction) => transaction.transaction);
  return (
    <div className="m-2 grid grid-cols-1 gap-y-2">
      <Card className="m-3 bg-white shadow-md border-gray-100">
        <CardHeader>
          <div className="p-4 leading-5">
            <p className="m-2 text-3xl font-bold">Overview</p>
            <p className="m-6 text-xs font-bold">
              A recurring transaction refers to a financial transaction that
              happens repeatedly over a certain period. It is a transaction that
              is scheduled to occur on a regular basis, such as daily, weekly,
              monthly, quarterly, or annually.
            </p>
          </div>
        </CardHeader>
      </Card>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscriptions</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{totalRecurringTransactions}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              +{categoriesToRecurringTransactions.size}
            </div>
            <div className="flex flex-1 flex-wrap">
              {categories
                .map((category, idx) => (
                  <p
                    key={idx}
                    className="px-2 text-muted-foreground underline"
                    style={{
                      fontSize: "10px",
                    }}
                  >
                    {replaceUnderscoreWithSpace(category).toLowerCase()}
                  </p>
                ))
                .slice(0, 10)}
            </div>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Expenses</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <path d="M2 10h20" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {outflowTransactions
                .reduce((acc, transaction) => {
                  return acc + Number(transaction.lastAmount);
                }, 0)
                .toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {outflowTransactions.length} total subscriptions marked as
              expenses
            </p>
          </CardContent>
        </Card>
        <Card className="border-2 border-gray-100 shadow-md bg-white">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Income</CardTitle>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              className="h-4 w-4 text-muted-foreground"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {Math.abs(
                inflowTransactions.reduce((acc, transaction) => {
                  return acc + Number(transaction.lastAmount);
                }, 0)
              ).toFixed(2)}
            </div>
            <p className="text-xs text-muted-foreground">
              {inflowTransactions.length} total subscriptions marked as income
            </p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col">
        {/* <Card className="col-span-4">
          <AskMelodiyAILayout
            context={allRecursiveTransactions
              .map((transaction) => {
                return {
                  merchantName: transaction.merchantName,
                  lastAmount: transaction.lastAmount,
                  lastDate: transaction.lastDate,
                };
              })
              .splice(0, 5)}
            className="m-3 bg-white"
            sampleQuestions={[`Tell me everything l need to know about this?`]}
          >
            <CardHeader>
              <CardTitle>Subscription Details</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview
                data={allRecursiveTransactions}
                dateKey={"lastAmount"}
              />
            </CardContent>
          </AskMelodiyAILayout>
        </Card> */}
        <Card className="border-0 shadow-none">
          <AskMelodiyAILayout
            context={sortedSubscriptions.splice(0, 3)}
            className="m-3 bg-white shadow-md border-gray-100"
            sampleQuestions={[`Tell me everything l need to know about this?`]}
          >
            <CardHeader>
              <CardTitle>Top Subscriptions</CardTitle>
              <CardDescription>
                You have {allRecursiveTransactions.length} active subscriptions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TopSubscriptionsCard
                recurringTransactions={sortedSubscriptions}
              />
            </CardContent>
          </AskMelodiyAILayout>
        </Card>
      </div>
      <div>
        <RecurringTransactionDatatable data={allRecursiveTransactions} />
      </div>
    </div>
  );
};

interface ITopSubscriptionsCard {
  recurringTransactions: ReOccuringTransaction[];
}

const TopSubscriptionsCard: React.FC<ITopSubscriptionsCard> = ({
  recurringTransactions,
}) => {
  return (
    <div className="space-y-8">
      {recurringTransactions.map((recurringTransaction, index) => {
        const merchantName = recurringTransaction.merchantName || "Unknown"; // default value for merchantName
        const personalFinanceCategory =
          recurringTransaction.personalFinanceCategoryPrimary || "N/A"; // default value for personalFinanceCategoryPrimary

        return (
          <div className="flex items-center" key={index}>
            <Avatar className="h-9 w-9 bg-gray-400">
              <AvatarImage alt="Avatar" />
              <AvatarFallback>
                {merchantName.length > 2
                  ? merchantName.substring(0, 2).toUpperCase()
                  : merchantName.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-4 space-y-1">
              <p className="text-sm font-medium leading-none">{merchantName}</p>
              <p className="text-sm text-muted-foreground">
                {replaceUnderscoreWithSpace(
                  personalFinanceCategory
                ).toLocaleLowerCase()}
              </p>
            </div>
            <div className="ml-auto font-medium">
              ${Math.abs(Number(recurringTransaction.lastAmount)).toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
};
/*
 * IRecurringTransactionsFlowComponent component that
 * displays inflow/outflow transactions
 *
 * @interface IInflowRecurringTransactionsComponeent
 * */
interface IRecurringTransactionsFlowComponent {
  recurringTransactions: ReOccuringTransaction[];
  title: string;
  description: string;
}

/**
 * RecurringTransactionsFlowComponent component that displays inflow transactions
 * @param recurringTransactions {ReOccuringTransaction[]}
 * @returns
 */
const RecurringTransactionsFlowComponent: React.FC<
  IRecurringTransactionsFlowComponent
> = ({ recurringTransactions, title, description }) => {
  // compute the top 5 inflow transactions as context
  const context = recurringTransactions
    .map((transaction) => {
      return {
        transaction: transaction,
        amount: Math.abs(Number(transaction.lastAmount)),
        flow:
          transaction.flow === "RE_CURRING_FLOW_INFLOW" ? "inflow" : "outflow",
      };
    }, [])
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const sampleQuestions: string[] = [
    "What subscriptions am I currently paying for?",
    "How much does each subscription cost me monthly/annually?",
    "Which subscriptions are non-essential?",
    "Do any of my subscriptions have overlapping services?",
  ];

  return (
    <AskMelodiyAILayout
      context={context}
      sampleQuestions={sampleQuestions}
      className="border-0 shadow-none"
    >
      <div className="p-4 leading-5 rounded-2xl bg-white shadow-md border-4 border-gray-100">
        <p className="m-2 text-3xl font-bold">{title}</p>
        <p className="m-6 text-xs font-bold">{description}</p>
      </div>
      <Card className="grid grid-cols-2 flex-wrap gap-2 border-none shadow-none">
        {recurringTransactions.map(
          (transaction, index) =>
            transaction.isActive && (
              <RecurringTransactionCard
                recurringTransaction={transaction}
                enableDetailedDisplay={true}
                className="bg-white border-2 border-gray-100 w-fit h-fit overflow-hidden m-4 shadow-md"
                key={index}
              />
            )
        )}
      </Card>
    </AskMelodiyAILayout>
  );
};

/*
 * IUpcomingRecurringTransactionsProps represents the properties of the
 * upcoming recurring transactions component
 *
 * @interface IUpcomingRecurringTransactionsProps
 * */
interface IUpcomingRecurringTransactionsProps {
  upcomingTransactions: readonly UpcomingRecurringTransactions[];
}

/**
 * UpcomingRecurringTransactions renders the upcoming recurring transactions
 * @param upcomingTransactions
 * @returns
 */
const UpcomingRecurringTransactionsComponent: React.FC<
  IUpcomingRecurringTransactionsProps
> = ({ upcomingTransactions }) => {
  enum UpcomingTransactionOptions {
    CALENDAR_VIEW = "CALENDAR_VIEW",
    OVERVIEW = "OVERVIEW",
  }

  // get all the reoccuring transactions from the upcoming transaction
  // and compute the total expense
  const allRecurringTransactions = upcomingTransactions.map(
    (upcomingTransaction) => upcomingTransaction.transaction
  );

  // compute the total expense of monthly recurring transactions
  const transactionFlowCount = convertToFlowCount(allRecurringTransactions);

  const totalMonthlyExpense = upcomingTransactions.reduce(
    (acc, transaction) => {
      const { transaction: recurringTransaction } = transaction;
      const { lastAmount } = recurringTransaction;
      if (
        Number(recurringTransaction.lastAmount) > 0 &&
        recurringTransaction.flow === "RE_CURRING_FLOW_OUTFLOW"
      ) {
        return acc + Number(lastAmount);
      }

      return acc;
    },
    0
  );

  const upcomingTransactionNextPaymentDates = upcomingTransactions.map(
    (recurringTransaction, index) => {
      return new Date(recurringTransaction.nextTransactionDate);
    }
  );

  // compute the upcoming subscription context
  // NOTE: this cannot be too large hence, we can only opt to selected the top 5 upcoming transactions
  // - we only select the ones that are expenses and are the largest
  const context = upcomingTransactions
    .map((upcomingTransaction, index) => {
      const { transaction: recurringTransaction } = upcomingTransaction;
      const { lastAmount } = recurringTransaction;
      if (
        Number(recurringTransaction.lastAmount) > 0 &&
        recurringTransaction.flow === "RE_CURRING_FLOW_OUTFLOW"
      ) {
        return {
          name: recurringTransaction.merchantName,
          value: Number(lastAmount),
        };
      }

      return null;
    })
    .filter(
      (transaction): transaction is { name: string; value: number } =>
        transaction !== null
    );

  const sampleQuestions: string[] = [
    "which subscriptions do l owe in the next week?",
    "Which subscription do l owe in the next month?",
    "Which subscriptions are non-essential?",
    "Do any of my subscriptions have overlapping services?",
  ];

  return (
    <AskMelodiyAILayout
      context={context}
      className="m-2"
      sampleQuestions={sampleQuestions}
    >
      <Tabs
        className="h-full px-4 py-6 lg:px-8"
        defaultValue={UpcomingTransactionOptions.OVERVIEW}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value={UpcomingTransactionOptions.OVERVIEW}>
            Overview
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value={UpcomingTransactionOptions.OVERVIEW}
          className="flex flex-col gap-2"
        >
          <Card>
            <CardHeader>
              <div className="flex flex-row justify-between">
                <div>
                  <p className="text-xl font-bold">Subscription Insights</p>
                </div>
                <div>
                  <Calendar
                    mode="multiple"
                    selected={upcomingTransactionNextPaymentDates}
                    className="rounded-md border shadow w-full"
                    footer={
                      <p className="pt-4 text-xs font-bold">
                        Upcoming recurring transactions
                      </p>
                    }
                  />
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className="flex flex-1 flex-wrap gap-2 border-none shadow-none">
            {/** Here we display the various bills that are upcoming */}
            {upcomingTransactions.map((upcomingTransaction, index) => (
              <RecurringTransactionCard
                recurringTransaction={upcomingTransaction.transaction}
                nextTransactionDate={upcomingTransaction.nextTransactionDate}
                key={index}
                className="bg-white border w-full h-fit overflow-hidden m-4 shadow-md"
                enableDetailedDisplay={true}
              />
            ))}
          </Card>
        </TabsContent>
        <TabsContent
          value={UpcomingTransactionOptions.CALENDAR_VIEW}
        ></TabsContent>
      </Tabs>
    </AskMelodiyAILayout>
  );
};

interface FlowCount {
  name: string;
  count: number;
}

function convertToFlowCount(
  transactions: ReOccuringTransaction[]
): FlowCount[] {
  let inflowCount = 0;
  let outflowCount = 0;

  transactions.forEach((transaction) => {
    if (transaction.flow === "RE_CURRING_FLOW_INFLOW") {
      inflowCount++;
    } else if (transaction.flow === "RE_CURRING_FLOW_OUTFLOW") {
      outflowCount++;
    }
  });

  return [
    { name: "inflow", count: inflowCount },
    { name: "outflow", count: outflowCount },
  ];
}

export { SubscriptionsView };
