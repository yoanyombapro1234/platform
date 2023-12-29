import { GetTransactionsRequestClass } from "@solomon-ai/component-library";
import { useState } from "react";
import { columns } from "src/components/data-table/data-column";
import { DataTable } from "src/components/data-table/data-table";
import { TableNav } from "src/components/data-table/data-table-nav";
import { Spinner } from "src/components/spinner";
import { TransactionAnalyticsByMonth } from "src/components/transaction-analytics-by-month";
import { TransactionDataTable } from "src/components/transaction-data-table";
import { Card, CardHeader, CardTitle } from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { mixPanelClient } from "src/lib/mixpanel";
import { useGetPlaidAccountTransactionsAcrossAllAccountsQuery } from "src/redux/queries/transactions/get-plaid-account-transactions-across-all-accounts";
import { useGetTransactionsQuery } from "src/redux/queries/transactions/get-transactions";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

const TransactionPortal: React.FC = () => {
  return (
    <div>
      <TransactionsView />
    </div>
  );
};

const TransactionsView: React.FC = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(150);
  const userId = useAppSelector(selectCurrentUserID);
  const acct = useAppSelector(selectCurrentUserAccount);
  const financialProfile = useAppSelector(selectUserFinancialProfile);

  // const req = new GetTransactionsRequestClass({
  //   userId: Number(userId),
  //   pageNumber: pageNumber,
  //   pageSize: pageSize,
  // });

  // const {
  //   data: response,
  //   isLoading,
  //   isSuccess,
  //   isError,
  //   error,
  // } = useGetTransactionsQuery(req);

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

  let txnComponent;
  let spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;
  let numTransactions = 0;

  if (isSuccess && response.transactions) {
    // spinner should be null
    txnComponent = (
      <>
        <Tabs defaultValue="transactions" className="w-full">
          <TabsList className="bg-black">
            <TabsTrigger value="transactions">Transaction Summary</TabsTrigger>
            <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
          </TabsList>
          <TabsContent value="transactions">
            <DataTable data={response.transactions} columns={columns} />
          </TabsContent>
          <TabsContent value="breakdown">
            <TransactionAnalyticsByMonth
              transactions={response.transactions}
              className="bg-white"
            />
          </TabsContent>
        </Tabs>
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

  const sampleQuestions: string[] = [
    "Is there a transaction limit on my account?",
    "How can I set up alerts for large transactions?",
    "Across what categories am l spending most?",
    "How can I optimize my spending?",
  ];

  mixPanelClient.trackViewTransactionsPortalEvent({
    userID: userId,
    time: new Date().toDateString(),
    metaData: {
      userName: `${acct.username}`,
      tags: `${acct.tags}`,
    },
  });

  return (
    <AskMelodiyAILayout context={undefined} sampleQuestions={sampleQuestions}>
      {spinner}
      <h2 className="ml-5 text-xl font-bold tracking-tight">
        Transactions <span className="ml-1 text-xs">({numTransactions}) </span>
      </h2>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Welcome back!</h2>
            <p className="text-muted-foreground">
              Here&apos;s a list of your transactions this month!
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TableNav />
          </div>
        </div>
        {txnComponent}
      </div>
    </AskMelodiyAILayout>
  );
};

export { TransactionPortal };
