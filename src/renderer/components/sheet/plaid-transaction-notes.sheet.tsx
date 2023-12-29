import { PlaidAccountTransaction } from "@solomon-ai/component-library";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import {
  PlaidAccountTransactionCard,
  TransactionSplitDetails,
} from "../cards/plaid-account-transaction-card/plaid-account-transaction-card";
import { CardDescription, CardHeader, CardTitle } from "../ui/card";
import { SmartNoteCard } from "../cards/smart-note-card/smart-note-card";
import { BarsArrowUpIcon } from "@heroicons/react/24/outline";
// Ensure you import the necessary components from your UI library
// For example: import { Sheet, SheetTrigger, SheetContent, Button, Input, Label } from 'your-ui-library';

// Define the props type for TransactionSplitSheet
interface TransactionNotetSheetProps {
  transaction: PlaidAccountTransaction;
}

const TransactionNotetSheet: React.FC<TransactionNotetSheetProps> = ({
  transaction,
}) => {
  if (!transaction.notes || transaction.notes.length == 0) {
    return null;
  }

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          View Notes
          <BarsArrowUpIcon className="ml-2 h-4 w-4 border-0" />
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
          <div className="grid grid-cols-3 gap-2">
            {transaction.notes &&
              transaction.notes.map((note, idx) => (
                <SmartNoteCard key={idx} note={note} />
              ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TransactionNotetSheet;
