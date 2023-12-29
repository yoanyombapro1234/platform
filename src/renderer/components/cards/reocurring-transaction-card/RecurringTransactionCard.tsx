import React from "react";
import { createContext, ReactNode, RefObject, Component } from "react";

import { Card, CardContent, CardHeader } from "../../ui/card";
import {
  cn,
  formatDate,
  formatFrequency,
  formatNumber,
  removeUnderScores,
} from "src/lib-utils/utils";
import { ArrowDownNarrowWide, RocketIcon } from "lucide-react";
import { Badge } from "../../ui/badge";
import { Alert, AlertDescription, AlertTitle } from "../../ui/alert";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../../ui/collapsible";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "../../ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@radix-ui/react-hover-card";
import { TransactionDataTable } from "../../transaction-data-table";
import {
  BankAccount,
  CreditAccount,
  ReOccuringTransaction,
  Transaction,
} from "@solomon-ai/component-library";
import { ReOccuringTransactionClass } from "@solomon-ai/component-library";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/** @type {React.Context<ReOccuringTransaction>} */
const RecurringTransactionCardContext = createContext<ReOccuringTransaction>(
  new ReOccuringTransactionClass({})
);

export type RecurringTransactionCardProps = {
  recurringTransaction: ReOccuringTransaction;
  className?: string;
  nextTransactionDate?: string;
  enableDetailedDisplay?: boolean;
  participantTransactions?: Transaction[];
  account?: BankAccount | CreditAccount;
};

export type RecurringTransactionCardState = {
  transaction: ReOccuringTransaction;
};

/**
 * @class RecurringTransactionCard
 * @extends {Component<RecurringTransactionCardProps, RecurringTransactionCardState>}
 *
 * @description
 * This is a templated advanced React class component written in TypeScript
 * with TSDoc annotations. It has various features like context usage,
 * dynamic styles, generic props, and more.
 */
export class RecurringTransactionCard extends Component<
  RecurringTransactionCardProps,
  RecurringTransactionCardState
> {
  private myRef: RefObject<HTMLDivElement>;

  static defaultProps = {
    nextTransactionDate: "2020-01-01",
    enableDetailedDisplay: false,
    className: "",
    participantTransactions: [],
  };

  constructor(props: RecurringTransactionCardProps) {
    super(props);
    this.state = {
      transaction: props.recurringTransaction,
    };

    this.isTransactionFrequencyInvalid =
      this.isTransactionFrequencyInvalid.bind(this);
    this.myRef = React.createRef();
  }

  /**
   * Lifecycle method that runs after the component has been mounted.
   */
  componentDidMount() {
    // You can use the ref here, for example:
    if (this.myRef.current) {
      this.myRef.current.focus();
    }
  }

  private isTransactionFrequencyInvalid(): boolean {
    const { transaction } = this.state;
    if (
      transaction.isActive === false ||
      transaction.frequency === "RE_OCCURING_TRANSACTIONS_FREQUENCY_UNSPECIFIED"
    ) {
      return true;
    }

    return false;
  }

  /**
   * Renders the component.
   * @returns {ReactNode}
   */
  render(): ReactNode {
    const {
      className,
      nextTransactionDate,
      enableDetailedDisplay,
      participantTransactions,
      account,
    } = this.props;
    const { transaction } = this.state;

    if (this.isTransactionFrequencyInvalid()) {
      return null;
    }

    return (
      <RecurringTransactionCardContext.Provider value={transaction}>
        <Card className={cn("rounded-3xl w-full", className)}>
          <CardHeader>
            <div className="flex flex-col">
              {nextTransactionDate && (
                <div className="col-span-3">
                  <p className="text-xs font-bold">
                    Next Payment Due On {formatDate(nextTransactionDate)}
                  </p>
                </div>
              )}
              <div className="flex flex-row gap-2 py-2 w-full">
                <Badge className="text-black bg-white rounded-lg">
                  {removeUnderScores(
                    transaction.personalFinanceCategoryPrimary ?? ""
                  )}
                </Badge>
                <Badge className="text-black bg-white rounded-lg">
                  {removeUnderScores(
                    transaction.personalFinanceCategoryDetailed ?? ""
                  )}
                </Badge>
              </div>
              {enableDetailedDisplay === true && (
                <div className="col-span-3 pt-2">
                  <div className="flex justify-between gap-2 flew-row">
                    <p className="text-xs font-bold">
                      {transaction.transactionIds?.length ?? 0} total
                      transactions
                    </p>
                    <div>
                      <Badge className="text-xs font-bold rounded-full">
                        {Number(transaction.lastAmount) < 0
                          ? "Income"
                          : "Expense"}
                      </Badge>
                    </div>
                  </div>
                </div>
              )}
            </div>
            {enableDetailedDisplay === true && (
              <div className="flex flex-row gap-2">
                <ArrowDownNarrowWide className="border border-black rounded-full" />
                <Badge
                  className="text-xs font-bold shadow-sm rounded-2xl"
                  variant={"outline"}
                >
                  {transaction.frequency &&
                    `Billed ${formatFrequency(
                      transaction.frequency.toString()
                    )}`}
                </Badge>
                <Badge
                  className="text-xs font-bold shadow-sm rounded-2xl"
                  variant={"outline"}
                >
                  {transaction.isActive ? "Active" : "InActive"}
                </Badge>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-3 m-2">
            <div className="flex flex-row justify-between py-2">
              <div className="flex justify-between flex-1 gap-1">
                <div>
                  <p className="text-xl font-bold text-bold">
                    {transaction.merchantName}
                  </p>
                </div>
                <p className="text-xl font-bold">
                  ${formatNumber(Math.abs(Number(transaction.lastAmount)), 2)}
                </p>
              </div>
            </div>
            {enableDetailedDisplay === true && (
              <div className="m-2">
                <div>
                  <Alert className="pt-3">
                    <RocketIcon className="w-4 h-4" />
                    <AlertTitle className="underline">
                      Transaction Details
                    </AlertTitle>
                    <AlertDescription
                      className="text-xs font-bold"
                      style={{
                        fontSize: "10px",
                      }}
                    >
                      {transaction.description}
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            )}
            <ReOccuringTransactionDetails />
            {participantTransactions !== undefined &&
              participantTransactions.length > 0 && (
                <HoverCard>
                  <HoverCardTrigger>
                    <p className="p-4 text-xs font-bold">
                      View Transaction Details
                    </p>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    <TransactionDataTable
                      transactions={participantTransactions}
                      account={account}
                    />
                  </HoverCardContent>
                </HoverCard>
              )}
          </CardContent>
        </Card>
      </RecurringTransactionCardContext.Provider>
    );
  }
}

const ReOccuringTransactionDetails: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const transaction = React.useContext(RecurringTransactionCardContext);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-full pt-3 space-y-2 md:pt-5 "
    >
      <div className="flex items-center justify-between px-4 space-x-4">
        <h4 className="text-sm font-semibold">Subscription details</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="sm">
            <CaretSortIcon className="w-4 h-4" />
            <span className="sr-only">Toggle</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="px-4 py-2 font-mono text-sm border rounded-md shadow-sm">
        {transaction.merchantName} Subscription is currently{" "}
        {transaction.isActive ? "active" : "inactive"}
      </div>
      <CollapsibleContent className="space-y-2">
        <div className="px-4 py-2 font-mono text-sm border rounded-md shadow-sm">
          <div className="flex flex-row justify-between items-between">
            <p className="text-sm"> First payed on</p>
            <p className="text-sm">
              {" "}
              {formatDate(transaction.firstDate).toLowerCase()}
            </p>
          </div>
        </div>
        <div className="px-4 py-2 font-mono text-sm border rounded-md shadow-sm">
          <div className="flex flex-row justify-between items-between">
            <p className="text-sm"> Last payed on </p>
            <p className="text-sm">
              {" "}
              {formatDate(transaction.lastDate).toLowerCase()}
            </p>
          </div>
        </div>
        <div className="px-4 py-2 font-mono text-sm border rounded-md shadow-sm">
          <div className="flex flex-row justify-between items-between">
            <p className="text-sm"> Last amount payed </p>
            <p className="text-sm">
              {" "}
              ${formatNumber(Math.abs(Number(transaction.lastAmount)), 2)}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};
