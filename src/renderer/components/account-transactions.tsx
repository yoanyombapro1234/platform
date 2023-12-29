import { useEffect, useState } from "react";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialContext,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import { Spinner } from "./spinner";
import { CardHeader, CardTitle, Card } from "./ui/card";
import { DataTable } from "./data-table/data-table";
import { columns } from "./data-table/data-column";
import {
  FinancialAccountType,
  PlaidAccountTransaction,
  SimpleStatsCard,
} from "@solomon-ai/component-library";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { useGetPlaidAccountTransactionsForBankAccountQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-for-bank-account";
import { filterTransactionsByDate } from "src/lib-utils/utils";
import { useGetPlaidAccountTransactionsAcrossAllAccountsQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-across-all-accounts";

interface IAccountTransactionsProps {
  plaidAccountId: string;
  financialAccountType: FinancialAccountType;
  bankAccountId: number;
  children?: React.ReactNode;
}

const BankAccountTransactions: React.FC<IAccountTransactionsProps> = ({
  plaidAccountId,
  financialAccountType,
  bankAccountId,
  children,
}) => {
  const [pageSize, setPageSize] = useState<number>(150);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [transactions, setTransactions] = useState<PlaidAccountTransaction[]>(
    [],
  );
  const currentUserId = useAppSelector(selectCurrentUserID);
  const currentUserAccount = useAppSelector(selectCurrentUserAccount);
  const financialContext = useAppSelector(selectUserFinancialContext);
  const financialProfile = useAppSelector(selectUserFinancialProfile);

  const request = {
    userId: Number(currentUserId),
    accountId: bankAccountId,
    pageNumber: pageNumber,
    pageSize: pageSize,
    financialAccountType: financialAccountType,
    profileType: financialProfile.profileType!,
  };

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPlaidAccountTransactionsForBankAccountQuery(request);

  useEffect(() => {
    if (isSuccess && response.transactions) {
      setTransactions(response.transactions);
    }
  }, [isSuccess, response]);

  let spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;

  if (isSuccess && response.transactions) {
    spinner = <></>;
  } else if (isError) {
    spinner = <div>{error.toString()}</div>;
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

  const sampleQuestions: string[] = [
    "Is there a transaction limit on my account?",
    "How can I set up alerts for large transactions?",
    "Across what categories am l spending most?",
    "How can I optimize my spending?",
  ];

  const transactionsThisWeek = filterTransactionsByDate(
    transactions,
    "week",
  ).length;
  const transactionsThesePast3Days = filterTransactionsByDate(
    transactions,
    "past3days",
  ).length;
  const transactionsToday = filterTransactionsByDate(
    transactions,
    "today",
  ).length;

  return (
    <AskMelodiyAILayout
      context={financialContext}
      sampleQuestions={sampleQuestions}
      className="flex flex-col gap-4"
    >
      {spinner}
      <div className="gap-2 md:grid md:grid-cols-3">
        <SimpleStatsCard
          title={"Transactions This Week"}
          metric={transactionsThisWeek.toString() || ""}
          subtext="transactions this week"
        />
        <SimpleStatsCard
          title={"Number of Transactions The Past 3 Days"}
          metric={transactionsThesePast3Days.toString()}
          subtext="Number of transactions The Past 3 Days"
        />

        <SimpleStatsCard
          title={"Transactions Today"}
          metric={transactionsToday.toString()}
          subtext="Transactions Today"
        />
      </div>
      <div>{children}</div>
      <Card className="p-[3%] shadow-md border-2 border-white">
        <h2 className="ml-5 text-3xl font-bold tracking-tight">
          Transactions{" "}
          <span className="ml-1 text-xs">({transactions.length}) </span>
        </h2>
        <DataTable data={transactions} columns={columns} />
      </Card>
    </AskMelodiyAILayout>
  );
};

export { BankAccountTransactions };
