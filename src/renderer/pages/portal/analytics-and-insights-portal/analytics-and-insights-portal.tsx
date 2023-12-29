import {
  AccountBalanceHistory,
  ExpenseMetrics,
  GetExpenseMetricsRequestClass,
  GetIncomeMetricsRequestClass,
  GetTransactionsRequestClass,
  IncomeMetrics,
  PlaidAccountTransaction,
} from "@solomon-ai/component-library";
import { useEffect, useState } from "react";
import { Spinner } from "src/components/spinner";
import { Card, CardHeader, CardTitle } from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { useGetIncomeMetricsQuery } from "src/redux/queries/income/get-income-metrics";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import { IncomeView } from "./income-portal-view";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { useGetTransactionsQuery } from "src/redux/queries/transactions/get-transactions";
import { useGetExpenseMetricsQuery } from "src/redux/queries/expense/get-expense-metrics";
import { ExpenseView } from "./expense-portal-view";
import { mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";
import { useGetPlaidAccountTransactionsForBankAccountQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-for-bank-account";
import { useGetPlaidAccountTransactionsAcrossAllAccountsQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-across-all-accounts";

const AnalyticsOptions = {
  EXPENSE: "EXPENSE",
  INCOME: "INCOME",
};

const AnalyticsAndInsightsPortal: React.FC = () => {
  // useSelector hook to extract data from Redux Store, getting user's financial profile from the authentication selector
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const userId = useAppSelector(selectCurrentUserID);
  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />
  );
  const currentUserAccount = useAppSelector(selectCurrentUserAccount);

  const [transactions, setTransactions] = useState<PlaidAccountTransaction[]>(
    []
  );

  // TODO: make a call to the backend to get income and expense metrics for the user
  // of interest and then display the data in the appropriate components
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const request = {
    userId: Number(userId),
    pageNumber: pageNumber,
    pageSize: pageSize,
    profileType: financialProfile.profileType!,
  };

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPlaidAccountTransactionsAcrossAllAccountsQuery(request);

  useEffect(() => {
    const getMetric = () => {
      if (isSuccess && response.transactions) {
        setSpinner(null);
        setTransactions(response.transactions);
      } else if (isLoading) {
        setSpinner(<Spinner className={"w-8 h-8 mt-3 ml-3"} />);
      } else if (isError) {
        setSpinner(<div>{error.toString()}</div>);
      } else if (
        isSuccess &&
        (!response.transactions || response.transactions.length === 0)
      ) {
        setSpinner(
          <Card className="py-2">
            <CardHeader>
              <CardTitle>We are still pulling in your data!</CardTitle>
              <p>Sit tight and relax. We are still pulling in your data</p>
            </CardHeader>
          </Card>
        );
      }
    };
    getMetric();
  }, [isLoading, isError, response]);

  mixPanelClient.trackEventOfType(
    eventNames.FEATURE_VIEW_ANALYTICS_AND_INSIGHTS_PORTAL_EVENT,
    {
      userID: currentUserAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${currentUserAccount.username}`,
        tags: `${currentUserAccount.tags}`,
      },
    }
  );

  return (
    <div className="flex-1 space-y-4 py-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics & Insights{" "}
          <span className="ml-4 text-sm">
            {" "}
            ({linkedBankAccounts !== undefined ? linkedBankAccounts.length : 0})
            Linked Accounts
          </span>
        </h2>
      </div>
      <Tabs defaultValue={AnalyticsOptions.EXPENSE} className="space-y-4">
        <TabsList className="m-1 py-2 bg-black">
          <TabsTrigger value={AnalyticsOptions.EXPENSE}>Expenses</TabsTrigger>
          <TabsTrigger value={AnalyticsOptions.INCOME}>Income</TabsTrigger>
        </TabsList>
        <TabsContent value={AnalyticsOptions.EXPENSE} className="space-y-4">
          <div>
            <ExpenseMetricsAnalyticsAndInsights transactions={transactions} />
          </div>
        </TabsContent>
        <TabsContent value={AnalyticsOptions.INCOME} className="space-y-4">
          <div>
            <IncomeMetricsAnalyticsAndInsights transactions={transactions} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const IncomeMetricsAnalyticsAndInsights: React.FC<{
  transactions: PlaidAccountTransaction[];
  historicalAccountBalance?: AccountBalanceHistory[];
}> = ({ transactions, historicalAccountBalance }) => {
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const userId = useAppSelector(selectCurrentUserID);
  const [incomeMetrics, setIncomeMetrics] = useState<IncomeMetrics[]>([]);
  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />
  );

  const req = new GetIncomeMetricsRequestClass({
    userId: Number(userId),
    pageNumber: 1,
    pageSize: 100,
  });

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetIncomeMetricsQuery(req);

  useEffect(() => {
    const getMetric = () => {
      if (isSuccess && response.incomeMetrics) {
        setSpinner(null);
        setIncomeMetrics(response.incomeMetrics);
      } else if (isLoading) {
        setSpinner(<Spinner className={"w-8 h-8 mt-3 ml-3"} />);
      } else if (isError) {
        setSpinner(<div>{error.toString()}</div>);
      } else if (
        isSuccess &&
        (!response.incomeMetrics || response.incomeMetrics.length === 0)
      ) {
        setSpinner(
          <Card className="py-2">
            <CardHeader>
              <CardTitle>We are still pulling in your data!</CardTitle>
              <p>Sit tight and relax. We are still pulling in your data</p>
            </CardHeader>
          </Card>
        );
      }
    };
    getMetric();
  }, [isLoading, isError, response]);

  const sampleQuestions: string[] = [
    "Where am l earning the most money?",
    "Which month am l earning the most?",
    "Is my income random?",
    "Are there any discrepancies in my income?",
  ];

  const validIncomeMetrics = incomeMetrics.filter(
    (metric) => metric?.totalIncome !== undefined
  );

  let incomeMetricsContext = {};

  if (validIncomeMetrics.length > 0) {
    const highestIncomeMonth = validIncomeMetrics.reduce((prev, curr) =>
      prev.totalIncome! > curr.totalIncome! ? prev : curr
    );

    const lowestIncomeMonth = validIncomeMetrics.reduce((prev, curr) =>
      prev.totalIncome! < curr.totalIncome! ? prev : curr
    );

    const totalIncomeSum = validIncomeMetrics.reduce(
      (prev, curr) => prev + (curr.totalIncome ?? 0),
      0
    );

    const averageIncome =
      validIncomeMetrics.length > 0
        ? totalIncomeSum / validIncomeMetrics.length
        : 0;

    // get the top 5 categories by income
    const topCategories = validIncomeMetrics
      .sort((a, b) => b.totalIncome! - a.totalIncome!)
      .slice(0, 5);

    incomeMetricsContext = {
      highestIncomeMonth: highestIncomeMonth,
      lowestIncomeMonth: lowestIncomeMonth,
      averageIncome: averageIncome,
      topCategories: topCategories,
    };
  }

  return (
    <AskMelodiyAILayout
      context={incomeMetricsContext}
      sampleQuestions={sampleQuestions}
    >
      {spinner}
      <h2 className="ml-5 text-xl font-bold tracking-tight">
        Income Metrics <span className="ml-1 text-xs"> </span>
      </h2>
      {incomeMetrics.length > 0 && (
        <div>
          <IncomeView
            data={incomeMetrics}
            historicalAccountBalance={historicalAccountBalance ?? []}
            transactions={transactions}
          />
        </div>
      )}
    </AskMelodiyAILayout>
  );
};

const ExpenseMetricsAnalyticsAndInsights: React.FC<{
  transactions: PlaidAccountTransaction[];
  historicalAccountBalance?: AccountBalanceHistory[];
}> = ({ transactions, historicalAccountBalance }) => {
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const userId = useAppSelector(selectCurrentUserID);
  const [expenseMetrics, setExpenseMetrics] = useState<ExpenseMetrics[]>([]);
  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />
  );

  const req = new GetExpenseMetricsRequestClass({
    userId: Number(userId),
    pageNumber: 1,
    pageSize: 100,
  });

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetExpenseMetricsQuery(req);

  useEffect(() => {
    const getMetric = () => {
      if (isSuccess && response.expenseMetrics) {
        setSpinner(null);
        setExpenseMetrics(response.expenseMetrics);
      } else if (isLoading) {
        setSpinner(<Spinner className={"w-8 h-8 mt-3 ml-3"} />);
      } else if (isError) {
        setSpinner(<div>{error.toString()}</div>);
      } else if (
        isSuccess &&
        (!response.expenseMetrics || response.expenseMetrics.length === 0)
      ) {
        setSpinner(
          <Card className="py-2">
            <CardHeader>
              <CardTitle>We are still pulling in your data!</CardTitle>
              <p>Sit tight and relax. We are still pulling in your data</p>
            </CardHeader>
          </Card>
        );
      }
    };
    getMetric();
  }, [isLoading, isError, response]);

  const sampleQuestions: string[] = [
    "Where am l earning the most money?",
    "Which month am l earning the most?",
    "Is my income random?",
    "Are there any discrepancies in my income?",
  ];

  const validIncomeMetrics = expenseMetrics.filter(
    (metric) => metric?.totalExpenses !== undefined
  );

  let incomeMetricsContext = {};

  if (validIncomeMetrics.length > 0) {
    const highestIncomeMonth = validIncomeMetrics.reduce((prev, curr) =>
      prev.totalExpenses! > curr.totalExpenses! ? prev : curr
    );

    const lowestIncomeMonth = validIncomeMetrics.reduce((prev, curr) =>
      prev.totalExpenses! < curr.totalExpenses! ? prev : curr
    );

    const totalExpensesSum = validIncomeMetrics.reduce(
      (prev, curr) => prev + (curr.totalExpenses ?? 0),
      0
    );

    const averageIncome =
      validIncomeMetrics.length > 0
        ? totalExpensesSum / validIncomeMetrics.length
        : 0;

    // get the top 5 categories by income
    const topCategories = validIncomeMetrics
      .sort((a, b) => b.totalExpenses! - a.totalExpenses!)
      .slice(0, 5);

    incomeMetricsContext = {
      highestExpenseMonth: highestIncomeMonth,
      lowestExpenseMonth: lowestIncomeMonth,
      averageExpense: averageIncome,
      topCategories: topCategories,
    };
  }

  return (
    <AskMelodiyAILayout
      context={incomeMetricsContext}
      sampleQuestions={sampleQuestions}
    >
      {spinner}
      <h2 className="m-5 text-xl font-bold tracking-tight">
        Expense Metrics <span className="ml-1 text-xs"> </span>
      </h2>
      {expenseMetrics.length > 0 && (
        <div>
          <ExpenseView
            data={expenseMetrics}
            historicalAccountBalance={historicalAccountBalance ?? []}
            transactions={transactions}
          />
        </div>
      )}
    </AskMelodiyAILayout>
  );
};

export { AnalyticsAndInsightsPortal };
