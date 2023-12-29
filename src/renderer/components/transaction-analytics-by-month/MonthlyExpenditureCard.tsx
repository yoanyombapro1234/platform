import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Transaction } from "@solomon-ai/component-library";
import { isEmptyObject } from "src/lib-utils/utils";

type Props = {
  transactions: Transaction[];
  children?: React.ReactNode;
};

const MonthlyExpenditureCard: React.FC<Props> = ({
  transactions,
  children,
}) => {
  const totalExpenditure = transactions
    .filter((txn) => txn.amount && txn.amount > 0)
    .reduce((acc, txn) => acc + Math.abs(txn.amount || 0), 0);

  // plaid treats negative amounts as income and positive amounts as expenditure
  const totalIncome = transactions
    .filter((txn) => txn.amount && txn.amount < 0)
    .reduce((acc, txn) => acc + Math.abs(txn.amount || 0), 0);

  const netSavings = totalIncome - totalExpenditure;
  const averageTransactionSize =
    transactions.length > 0
      ? transactions.reduce((acc, txn) => acc + (txn.amount || 0), 0) /
        transactions.length
      : 0;

  const largestTransaction = Math.max(
    ...transactions.map((txn) => txn.amount || 0),
  );
  const smallestTransaction = Math.min(
    ...transactions.map((txn) => txn.amount || 0),
  );

  // Merchant Breakdown
  const merchantBreakdown: { [key: string]: number } = {};
  transactions.forEach((txn) => {
    if (txn.merchantName) {
      merchantBreakdown[txn.merchantName] =
        (merchantBreakdown[txn.merchantName] || 0) + 1;
    }
  });

  // Payment Method Breakdown
  const paymentMethodBreakdown: { [key: string]: number } = {};
  transactions.forEach((txn) => {
    if (txn.paymentMetaPaymentMethod) {
      paymentMethodBreakdown[txn.paymentMetaPaymentMethod] =
        (paymentMethodBreakdown[txn.paymentMetaPaymentMethod] || 0) + 1;
    }
  });

  // Frequency of Transactions
  const transactionFrequency: { [key: string]: number } = {};
  transactions.forEach((txn) => {
    const date = txn.currentDate; // Assuming currentDate represents the date of the transaction
    if (date) {
      transactionFrequency[date] = (transactionFrequency[date] || 0) + 1;
    }
  });

  // Cash Flow Analysis
  const cashFlowAnalysis: { [key: string]: number } = {};
  transactions.forEach((txn) => {
    const date = txn.currentDate;
    if (date) {
      cashFlowAnalysis[date] =
        (cashFlowAnalysis[date] || 0) + (txn.amount || 0);
    }
  });

  return (
    <div className="bg-white">
      <h2 className="mb-4 text-xl font-bold">Transaction Metrics</h2>
      {children}
      <Card className="m-2">
        <CardHeader className="flex flex-row items-center justify-center pb-2 space-y-0">
          <CardTitle className="text-xl font-bold">Further Details</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-row gap-2 justify-center items-center">
          <CardHeader className="pt-4 text-md font-bold">
            <CardTitle>${largestTransaction.toFixed(2)}</CardTitle>
            <CardDescription>largest transaction</CardDescription>
          </CardHeader>{" "}
          <CardHeader className="pt-4 text-md font-bold">
            <CardTitle>${smallestTransaction.toFixed(2)}</CardTitle>
            <CardDescription>smallest transaction</CardDescription>
          </CardHeader>{" "}
          <CardHeader className="pt-4 text-md font-bold">
            <CardTitle>${averageTransactionSize.toFixed(2)}</CardTitle>
            <CardDescription>average transaction</CardDescription>
          </CardHeader>{" "}
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <Card className="contain">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Total Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent className="w-fit">
            <div className="font-bold"> ${totalExpenditure.toFixed(2)}</div>
            {/* <p className="text-xs font-bold">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card className="contain">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
          </CardHeader>
          <CardContent className="w-fit">
            <div className="font-bold"> ${totalIncome.toFixed(2)}</div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
        <Card className="contain">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">
              Net Savings/Net Expenditure
            </CardTitle>
          </CardHeader>
          <CardContent className="w-fit">
            <div className="font-bold"> ${netSavings.toFixed(2)}</div>
            {/* <p className="text-xs text-muted-foreground">
              +20.1% from last month
            </p> */}
          </CardContent>
        </Card>
      </div>

      <ul>
        {!isEmptyObject(merchantBreakdown) && (
          <li className="mt-4">
            <strong className="text-lg">Merchant Breakdown</strong>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(merchantBreakdown).map(([merchant, count]) => (
                <Card key={merchant} className="w-fit p-2">
                  <div className="m-2">
                    <CardTitle>{merchant}</CardTitle>
                    <CardDescription>{count} transactions</CardDescription>
                  </div>
                </Card>
              ))}
            </ul>
          </li>
        )}

        {!isEmptyObject(paymentMethodBreakdown) && (
          <li className="mt-4">
            <strong className="text-lg">Payment Method</strong>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(paymentMethodBreakdown).map(([method, count]) => (
                <Card key={method} className="w-fit p-2">
                  <div className="m-2">
                    <CardTitle>{method}</CardTitle>
                    <CardDescription>{count} transactions</CardDescription>
                  </div>
                </Card>
              ))}
            </ul>
          </li>
        )}

        {!isEmptyObject(paymentMethodBreakdown) && (
          <li className="mt-4">
            <strong className="text-lg">Frequency of Transactions</strong>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(paymentMethodBreakdown).map(([date, count]) => (
                <Card key={date} className="w-fit p-2">
                  <div className="m-2">
                    <CardTitle>{date}</CardTitle>
                    <CardDescription>{count} transactions</CardDescription>
                  </div>
                </Card>
              ))}
            </ul>
          </li>
        )}

        {!isEmptyObject(cashFlowAnalysis) && (
          <li className="mt-4">
            <strong className="text-lg">Cash Flow Analysis</strong>
            <ul className="flex flex-wrap gap-2">
              {Object.entries(cashFlowAnalysis).map(([date, amount]) => (
                <Card key={date}>
                  <div className="m-2">
                    <CardTitle>${amount.toFixed(2)}</CardTitle>
                    <CardDescription>{date}</CardDescription>
                  </div>
                </Card>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  );
};

export { MonthlyExpenditureCard };
