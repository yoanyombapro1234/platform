import { useEffect, useState } from "react";
import { Input } from "./ui/input";
import { CommandPalleteWithFooter } from "./command-palletes/command-palleter-with-footer";
import {
  GetTransactionsRequestClass,
  Transaction,
} from "@solomon-ai/component-library";
import {
  selectCurrentUserID,
  selectUserFinancialContext,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import { useGetTransactionsQuery } from "src/redux/queries/transactions/get-transactions";
import { Spinner } from "./spinner";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { tr } from "date-fns/locale";

export const Search: React.FC<{
  className?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
}> = ({
  className,
  placeholder = "Search...",
  type = "search",
  value,
  onChange,
  ...props
}) => {
  const [enableTransactionCommandPallete, setEnableTransactionCommandPallete] =
    useState<boolean>(false);

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const userId = useAppSelector(selectCurrentUserID);
  const financialContext = useAppSelector(selectUserFinancialContext);
  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />,
  );
  // TODO: make a call to the backend to get income and expense metrics for the user
  // of interest and then display the data in the appropriate components
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);

  const req = new GetTransactionsRequestClass({
    userId: Number(userId),
    pageNumber: pageNumber,
    pageSize: pageSize,
  });

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetTransactionsQuery(req);

  useEffect(() => {
    const getMetric = () => {
      if (isSuccess && response.transactions) {
        setSpinner(null);
        // sort transactions
        const sortedTxns = response.transactions
          .filter((element) => {
            return element.authorizedDate !== null;
          })
          .sort((a, b) => {
            return (
              new Date(b.authorizedDate!).getTime() -
              new Date(a.authorizedDate!).getTime()
            );
          });
        setTransactions(sortedTxns);
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
          </Card>,
        );
      }
    };
    getMetric();
  }, [isLoading, isError, response]);

  const samplQuestions: string[] = [
    "Tell me a bit about my spending lately",
    "Which of my expenses are the highest?",
    "Across what categories are my expenses distributed?",
    "What would you advise l do based on this?",
  ];

  return (
    // <AskMelodiyAILayout
    //   context={
    //     transactions.length > 10 ? transactions.slice(0, 10) : transactions
    //   }
    //   sampleQuestions={samplQuestions}
    // >
    <div
      onClick={() => {
        setEnableTransactionCommandPallete(!enableTransactionCommandPallete);
      }}
    >
      {!enableTransactionCommandPallete && (
        <Input
          type={type}
          placeholder={placeholder}
          className="md:w-[100px] lg:w-[300px] text-black my-1"
          {...props}
        />
      )}
      {enableTransactionCommandPallete && (
        <CommandPalleteWithFooter transactions={transactions} accounts={[]} />
      )}
    </div>
    // </AskMelodiyAILayout>
  );
};
