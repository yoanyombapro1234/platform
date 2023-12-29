import {
  BankAccount,
  BankAccountClass,
  CreditAccount,
  CreditAccountClass,
  GetTransactionsRequestClass,
  SimpleStatsCard,
  Transaction,
  TransactionDataTable,
} from "@solomon-ai/component-library";
import { useState } from "react";
import { TableNav } from "src/components/data-table/data-table-nav";
import { CreditCard } from "src/components/cards/financial-card";
import { Spinner } from "src/components/spinner";
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
import { useGetTransactionsQuery } from "src/redux/queries/transactions/get-transactions";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import { selectUserFinancialContext } from "../../../redux/slice/authentication/AuthenticationSelector";
import { Search } from "src/components/search";
import { CreateGoalButton } from "src/components/button/create-goal-button";
import { eventNames } from "src/lib/mixpanel-events";
import { mixPanelClient } from "src/lib/mixpanel";
import { useGetPlaidAccountTransactionsAcrossAllAccountsQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-across-all-accounts";
import { DataTable } from "src/components/data-table/data-table";
import { columns } from "src/components/data-table/data-column";
import { SingleAccountView } from "src/pages/account/single-account-view";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "src/components/ui/dialog";
import { Button } from "src/components/ui/button";
import { ChevronDoubleRightIcon } from "@heroicons/react/24/outline";
import { MonthlyCategorizedExpenditureMetricsView } from "../analytics-and-insights-portal/monthly-categorized-expenditure";
import { MonthlyIncomeMetricsCard } from "../income/income-metrics-page";
import { IncomeMetricsPane } from "src/components/income-pane/income-metrics-pane";
import { ConnectPlaidAccountButtonMemoized } from "src/components/button/connect-plaid-account-button-v2";

const HomePortal: React.FC<{
  showTransactions?: boolean;
}> = ({ showTransactions }) => {
  return (
    <div className="flex flex-col gap-2">
      <HomePortalHeader />
      <div className="flex flex-col gap-3">
        {/** Accounts + Recent Txn Tablist */}
        {/** My Cards */}
        {/** Recent Transactions */}
        {showTransactions && (
          <TransactionsPopulatedDataTableComponent
            numTransactionsToQuery={150}
          />
        )}
      </div>
    </div>
  );
};

const HomePortalHeader: React.FC = () => {
  const currentAccount = useAppSelector(selectCurrentUserAccount);
  const currentFinancialContext = useAppSelector(selectUserFinancialContext);
  if (currentFinancialContext === undefined) {
    return <div></div>;
  }
  // get the current financial profile
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  // get the cash balance across all accounts
  const cashBalanceAcrossBankAccts =
    financialProfile.link !== undefined
      ? financialProfile.link.reduce<number>((acc, link) => {
          if (link.bankAccounts) {
            return (
              acc +
              link.bankAccounts.reduce<number>((acc, account) => {
                return acc + (account.balance || 0);
              }, 0)
            );
          }
          return acc;
        }, 0)
      : 0;

  // get the cash balance across all investment accounts
  const cashBalanceAcrossInvestmentAccts =
    financialProfile.link !== undefined
      ? financialProfile.link.reduce<number>((acc, link) => {
          if (link.investmentAccounts) {
            return (
              acc +
              link.investmentAccounts.reduce<number>((acc, account) => {
                return acc + (account.balance || 0);
              }, 0)
            );
          }
          return acc;
        }, 0)
      : 0;

  // get the cash balance across all mortgage accounts
  const outstandingBalanceAcrossMortgageAccts =
    financialProfile.link !== undefined
      ? financialProfile.link.reduce<number>((acc, link) => {
          if (link.mortgageAccounts) {
            return (
              acc +
              link.mortgageAccounts.reduce<number>((acc, account) => {
                return acc + (account.originationPrincipalAmount || 0);
              }, 0)
            );
          }
          return acc;
        }, 0)
      : 0;

  // get the cash balance across all student loan accounts
  const outstandingBalanceAcrossStudentLoanAccts =
    financialProfile.link !== undefined
      ? financialProfile.link.reduce<number>((acc, link) => {
          if (link.studentLoanAccounts) {
            return (
              acc +
              link.studentLoanAccounts.reduce<number>((acc, account) => {
                return (
                  acc +
                  (account.originationPrincipalAmount || 0) +
                  (account.outstandingInterestAmount || 0)
                );
              }, 0)
            );
          }
          return acc;
        }, 0)
      : 0;

  // get the cash balance across all credit accounts
  const outstandingBalanceAcrossCreditAccts =
    financialProfile.link !== undefined
      ? financialProfile.link.reduce<number>((acc, link) => {
          if (link.creditAccounts) {
            return (
              acc +
              link.creditAccounts.reduce<number>((acc, account) => {
                return acc + (account.balance || 0);
              }, 0)
            );
          }
          return acc;
        }, 0)
      : 0;

  const debts = outstandingBalanceAcrossStudentLoanAccts;
  +outstandingBalanceAcrossMortgageAccts + outstandingBalanceAcrossCreditAccts;
  const assets = cashBalanceAcrossBankAccts + cashBalanceAcrossInvestmentAccts;

  const expense = currentFinancialContext.expenses;
  const income = currentFinancialContext.income;
  const paymentChannel = currentFinancialContext.paymentChannels;

  const expenseValue =
    expense !== undefined && expense.length > 0
      ? Math.abs(expense[0].averageMonthlyDiscretionarySpending ?? 0)
      : 0;
  const incomeValue =
    income !== undefined && income.length > 0
      ? Math.abs(income[0].incomeLastMonth ?? 0)
      : 0;

  const topPaymentChannel =
    paymentChannel !== undefined && paymentChannel.length > 0
      ? paymentChannel[0].paymentChannel
      : "None";

  const numConnectedAccounts =
    (currentFinancialContext.bankAccounts?.length ?? 0) +
    (currentFinancialContext.creditAccounts?.length ?? 0) +
    (currentFinancialContext.investmentAccounts?.length ?? 0) +
    (currentFinancialContext.mortgageLoanAccounts?.length ?? 0) +
    (currentFinancialContext.studentLoanAccounts?.length ?? 0);
  const stats = [
    {
      id: 1,
      name: "Connected Accounts",
      value: numConnectedAccounts,
    },
    {
      id: 2,
      name: "Money Out This Month",
      value: `$${expenseValue.toFixed(2)}`,
    },
    {
      id: 3,
      name: "Money In This Month",
      value: `$${incomeValue.toFixed(2)}`,
    },
    { id: 4, name: "Top Payment Channel", value: `${topPaymentChannel}` },
    { id: 5, name: "Total Debts", value: `$${debts.toFixed(2)}` },
    { id: 5, name: "Total Assets", value: `$${assets.toFixed(2)}` },
  ];

  mixPanelClient.trackEventOfType(
    eventNames.FEATURE_VIEW_FINANCIAL_HOME_PORTAL_EVENT,
    {
      userID: currentAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${currentAccount.username}`,
        tags: `${currentAccount.tags}`,
      },
    }
  );

  return (
    <div className="bg-white border-4 shadow-lg rounded-2xl border-gray-50">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto max-w-7xl lg:mx-0">
          <div className="flex flex-row justify-between">
            <p className="text-base font-bold leading-7 text-blue-800 md:pt-[10%]">
              Solomon AI
            </p>
            <div className="flex items-center ml-auto space-x-4">
              <CreateGoalButton className="px-2 text-xs text-white bg-black border" />
              <Search
                placeholder="Search Transactions ..."
                className="border shadow-sm"
              />
            </div>
          </div>

          <h2 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-6xl">
            Your financial command center, {currentAccount?.username}
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            Your Personalized Command Center for Wealth Management and Financial
            Freedom
          </p>
        </div>
        <div className="pt-[2%]">
          <Tabs defaultValue="income" className="w-full">
            <TabsList className="w-fit bg-black">
              <TabsTrigger value="accounts">Accounts</TabsTrigger>
              <TabsTrigger value="income">Net Income Over Time</TabsTrigger>
              <TabsTrigger value="expense">Net Expenses Over Time</TabsTrigger>
            </TabsList>
            <TabsContent value="accounts">
              <Card className="border-4 shadow-sm">
                <ConnectedAcounts />
              </Card>
            </TabsContent>
            <TabsContent value="expense">
              <Card className="border-4 border-gray-100 shadow-md">
                <CardHeader>
                  <CardTitle>Expenses</CardTitle>
                  <CardDescription>
                    Effective expense management in an evolving business venture
                    is crucial as it directly impacts profitability and
                    financial stability. By carefully monitoring and adjusting
                    expenses in response to market and operational changes,
                    businesses can optimize resource allocation, ensuring
                    long-term growth and competitive advantage.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <MonthlyCategorizedExpenditureMetricsView
                    enableTitle={false}
                    enableAskSolomon={true}
                    className="border-none shadow-none"
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="income">
              <Card className="border-4 border-gray-100 shadow-md">
                <CardHeader>
                  <CardTitle>Income</CardTitle>
                  <CardDescription>
                    Efficient income management is vital in an evolving
                    business, as it determines the venture`&rsquo;`s growth
                    potential and financial health. By strategically maximizing
                    and diversifying revenue streams, a business can bolster its
                    resilience against market fluctuations and secure its path
                    to sustained success.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <IncomeMetricsPane
                    enableAskSolomon={true}
                    enableIncomeOvertime={true}
                    enableTransactionVsIncome={false}
                    className="border-none shadow-none"
                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-6">
        {stats.map((stat) => (
          <div key={stat.id} className="flex flex-col p-8 bg-gray-400/5">
            <dt className="text-sm font-semibold leading-6 text-gray-600">
              {stat.name}
            </dt>
            <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

const ConnectedAcounts: React.FC = () => {
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const { profileType } = financialProfile;

  if (!linkedBankAccounts) {
    return <div></div>;
  }

  type CreditAccountMap = {
    [key: string]: CreditAccount[];
  };

  const creditCardToInstitutionNameMap =
    linkedBankAccounts.reduce<CreditAccountMap>((acc, card) => {
      if (card.creditAccounts && card.institutionName) {
        acc[card.institutionName] = card.creditAccounts;
      }
      return acc;
    }, {});

  const allBankAccounts = linkedBankAccounts.reduce<BankAccount[]>(
    (acc, link) => {
      if (link.bankAccounts) {
        // Check if bankAccounts is defined
        return [...acc, ...link.bankAccounts];
      }
      return acc;
    },
    []
  );

  const allCreditAccounts = linkedBankAccounts.reduce<CreditAccount[]>(
    (acc, link) => {
      if (link.creditAccounts) {
        // Check if bankAccounts is defined
        return [...acc, ...link.creditAccounts];
      }
      return acc;
    },
    []
  );

  return (
    <div className="p-5 bg-white border-4 border-white shadow-lg rounded-2xl">
      <Tabs defaultValue="bankaccounts">
        <TabsList className="bg-black">
          <TabsTrigger value="bankaccounts">Bank Accounts</TabsTrigger>
          <TabsTrigger value="creditaccounts">Credit Accounts</TabsTrigger>
        </TabsList>
        <TabsContent value="creditaccounts">
          <div className="flex flex-row gap-1">
            {allCreditAccounts.length === 0 ? (
              <div className="p-[3%] flex flex-row gap-1">
                <p className="p-3 text-xl font-bold">
                  No Connected Credit Accounts
                </p>

                <ConnectPlaidAccountButtonMemoized
                  title={"Connect Credit Acount"}
                  className="text-xs"
                />
              </div>
            ) : (
              allCreditAccounts.map((account) => {
                return (
                  <div key={account.id}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-md">
                          View More{" "}
                          <ChevronDoubleRightIcon className="ml-3 w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-5 border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:min-w-[80%] md:max-h-[70%] md:p-20 overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{account.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you are done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <SingleAccountView
                            account={new CreditAccountClass(account)}
                            historicalAccountBalance={[]}
                            userName={""}
                            addGoalCallback={function (): void {}}
                            addMilestoneCallback={function (): void {}}
                            className="w-[100%] bg-gray-50 text-black md:p-5"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <CreditCard
                      cardholderName={account.name || ""}
                      cardNumber={account.number || ""}
                      expiryDate={"xx/xx" || ""}
                      cvv={"xxx"}
                    />
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
        <TabsContent value="bankaccounts">
          <div className="flex flex-row gap-1">
            {allBankAccounts.length === 0 ? (
              <div className="p-[3%] flex flex-row gap-1">
                <p className="p-3 text-xl font-bold">
                  No Connected Credit Accounts
                </p>

                <ConnectPlaidAccountButtonMemoized
                  title={"Connect Credit Acount"}
                  className="text-xs"
                />
              </div>
            ) : (
              allBankAccounts.map((account) => {
                return (
                  <div key={account.id}>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="text-md">
                          View More
                          <ChevronDoubleRightIcon className="ml-3 w-5 h-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-5 border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:min-w-[80%] md:max-h-[70%] md:p-20 overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{account.name}</DialogTitle>
                          <DialogDescription>
                            Make changes to your profile here. Click save when
                            you are done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                          <SingleAccountView
                            account={new BankAccountClass(account)}
                            historicalAccountBalance={[]}
                            userName={""}
                            addGoalCallback={function (): void {}}
                            addMilestoneCallback={function (): void {}}
                            className="w-[100%] bg-gray-50 text-black md:p-5"
                          />
                        </div>
                        <DialogFooter>
                          <Button type="submit">Save changes</Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <CreditCard
                      cardholderName={account.name || ""}
                      cardNumber={account.number || ""}
                      expiryDate={"xx/xx" || ""}
                      cvv={"xxx"}
                    />
                  </div>
                );
              })
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const TransactionsPopulatedDataTableComponent: React.FC<{
  numTransactionsToQuery: number;
}> = ({ numTransactionsToQuery }) => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(numTransactionsToQuery);
  const userId = useAppSelector(selectCurrentUserID);
  const financialProfile = useAppSelector(selectUserFinancialProfile);

  // const req = new GetTransactionsRequestClass({
  //   userId: Number(userId),
  //   pageNumber: pageNumber,
  //   pageSize: pageSize,
  // });

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPlaidAccountTransactionsAcrossAllAccountsQuery({
    userId: Number(userId),
    pageNumber: pageNumber,
    pageSize: pageSize,
    profileType: financialProfile.profileType!,
  });

  // const {
  //   data: response,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetTransactionsQuery(req);

  let txnComponent;
  let spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;
  let numTransactions = 0;
  let numTransactionsThisPastWeekend = 0;
  let largestTransactionThisWeek: Transaction = {};
  let smallestTransactionThisWeek: Transaction = {};

  if (isSuccess && response.transactions) {
    // spinner should be null
    // get only the transactions that occcured this past weel
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const transactionsThisWeek = response.transactions.filter(
      (txn) =>
        new Date(
          txn.authorizedDate !== undefined
            ? txn.authorizedDate
            : txn.authorizedDatetime!
        ) > oneWeekAgo
    );

    if (transactionsThisWeek.length === 0) {
      txnComponent = (
        <Card className="py-2">
          <CardHeader>
            <CardTitle>No transactions this week!</CardTitle>
            <p>There are no transactions this week!</p>
          </CardHeader>
        </Card>
      );
      return txnComponent;
    }

    // compute the largest transaction this week, smallest this week, the number of transactions spent on the weekend as well
    const sortedTxnSet = transactionsThisWeek.sort(
      (a, b) => a.amount! - b.amount!
    );

    smallestTransactionThisWeek = sortedTxnSet[0];
    largestTransactionThisWeek = sortedTxnSet[sortedTxnSet.length - 1];

    numTransactionsThisPastWeekend = transactionsThisWeek.filter((txn) => {
      const authorizedDate = txn.authorizedDate || txn.authorizedDatetime;
      if (!authorizedDate) return false;

      const date = new Date(authorizedDate);
      return date.getDay() === 0 || date.getDay() === 6;
    }).length;

    // compute the top 3 merchants
    const merchants = transactionsThisWeek
      .filter((txn) => txn.merchantName !== undefined)
      .map((txn) => txn.merchantName);
    const merchantToCount = new Map<string, number>();
    merchants.forEach((merchant) => {
      if (merchant !== undefined) {
        if (merchantToCount.has(merchant)) {
          merchantToCount.set(merchant, merchantToCount.get(merchant)! + 1);
        } else {
          merchantToCount.set(merchant, 1);
        }
      }
    });

    // Convert the map entries to an array of [merchant, count] pairs
    const merchantCountArray = Array.from(merchantToCount.entries());

    // Sort the array by count in descending order
    merchantCountArray.sort((a, b) => b[1] - a[1]);

    // Get the top 3 merchants
    const top3Merchants = merchantCountArray
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map((entry) => entry[0])
      .filter((element) => element.length > 0) // Extract merchant names
      .join(", ");

    txnComponent = (
      <>
        <div className="gap-2 md:grid md:grid-cols-4">
          <SimpleStatsCard
            title={"Largest Transaction This Week"}
            metric={largestTransactionThisWeek.amount?.toString() || ""}
            subtext="Largest transaction this week"
          />
          <SimpleStatsCard
            title={"Smallest Transaction This Week"}
            metric={smallestTransactionThisWeek.amount?.toString() || ""}
            subtext="Smallest transaction this week"
          />
          <SimpleStatsCard
            title={"Number of Transactions This Weekend"}
            metric={numTransactionsThisPastWeekend.toString()}
            subtext="Number of transactions this weekend"
          />
          <SimpleStatsCard
            title={"Top 3 Merchant"}
            metric={top3Merchants}
            subtext="Top 3 Merchants"
          />
        </div>
        <DataTable data={response.transactions} columns={columns} />
      </>
    );

    numTransactions = response.transactions.length;
  } else if (isLoading) {
    spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;
  } else if (isError) {
    spinner = (
      <Card className="py-2">
        <CardHeader>
          <CardTitle>
            An error occured while pulling your transactions{" "}
          </CardTitle>
        </CardHeader>
      </Card>
    );
  } else if (
    isSuccess &&
    (response.transactions?.length == 0 || response.transactions == undefined)
  ) {
    spinner = (
      <Card className="py-2">
        <CardHeader>
          <CardTitle>We are still pulling in your data!</CardTitle>
          <p>Sit tight and relax. We are still pulling in your data </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="p-5 bg-white border-4 border-white shadow-lg rounded-2xl">
      {spinner}

      <div className="flex-col flex-1 hidden h-full p-8 space-y-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {" "}
              Latest Transactions
            </h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your latest transactions this week
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TableNav />
          </div>
        </div>
        {txnComponent}
      </div>
    </div>
  );
};

export { HomePortal };
