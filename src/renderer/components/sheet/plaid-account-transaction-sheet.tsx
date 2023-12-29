import { PlaidAccountTransaction } from "@solomon-ai/component-library";
import React, { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { PlaidAccountTransactionCard } from "../cards/plaid-account-transaction-card/plaid-account-transaction-card";
import { ArrowsPointingOutIcon } from "@heroicons/react/24/outline";
// Ensure you import the necessary components from your UI library
// For example: import { Sheet, SheetTrigger, SheetContent, Button, Input, Label } from 'your-ui-library';

// Define the props type for PlaidTransactionSheet
interface PlaidTransactionSheetProps {
  transaction: PlaidAccountTransaction;
  onSave: (transaction: PlaidAccountTransaction) => void; // Callback function for saving the transaction
}

const PlaidTransactionSheet: React.FC<PlaidTransactionSheetProps> = ({
  transaction,
  onSave,
}) => {
  const [editedTransaction, setEditedTransaction] = useState(transaction);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedTransaction((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onSave(editedTransaction);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost">
          View Transaction
          <ArrowsPointingOutIcon className="ml-2 h-4 w-4 border-0" />
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:min-w-[40%] md:p-20 overflow-y-auto">
        {/* ... SheetHeader, SheetTitle, SheetDescription */}
        <div className="gap-4 py-4">
          {/* Field for Account ID */}
          <PlaidAccountTransactionCard transaction={transaction} />
        </div>
        <div className="flex justify-end p-4">
          <Button onClick={handleSave}>Save changes</Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PlaidTransactionSheet;
