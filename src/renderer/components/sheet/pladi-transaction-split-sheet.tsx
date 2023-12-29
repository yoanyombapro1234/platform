import { PlaidAccountTransaction } from "@solomon-ai/component-library";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  PlaidAccountTransactionCard,
  TransactionSplitDetails,
} from "../cards/plaid-account-transaction-card/plaid-account-transaction-card";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { Bars3Icon } from "@heroicons/react/24/outline";
// Ensure you import the necessary components from your UI library
// For example: import { Sheet, SheetTrigger, SheetContent, Button, Input, Label } from 'your-ui-library';

// Define the props type for TransactionSplitSheet
interface TransactionSplitSheetProps {
  transaction: PlaidAccountTransaction;
}

const TransactionSplitSheet: React.FC<TransactionSplitSheetProps> = ({
  transaction,
}) => {
  if (!transaction.splits || transaction.splits.length == 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          View Splits <Bars3Icon className="ml-2 h-4 w-4 border-0" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:min-w-[30%] md:p-20 overflow-y-auto">
        <div>
          <CardHeader>
            <CardTitle className="text-4xl">${transaction.amount}</CardTitle>
            <CardTitle>Transaction {transaction.transactionName} </CardTitle>
            <div className="flex flex-row gap-2">
              <CardDescription>{transaction.merchantName} </CardDescription>
              <CardDescription>{transaction.paymentChannel} </CardDescription>
              <CardDescription>{transaction.authorizedDate} </CardDescription>
            </div>

            <CardDescription>
              Anyone with access can view this transaction details.{" "}
            </CardDescription>
          </CardHeader>
        </div>
        <div className="gap-4 py-4">
          {transaction.splits &&
            transaction.splits.map((split, idx) => (
              <TransactionSplitDetails key={idx} split={split} />
            ))}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionSplitSheet;
