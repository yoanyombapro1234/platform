import { Meta, Story } from "@storybook/react";
import { DataTable } from "./data-table";
import {
  PlaidAccountTransaction,
  PlaidAccountTransactionClass,
} from "@solomon-ai/component-library";
import { columns } from "./data-column";

export default {
  title: "Tables/DataTable",
  component: DataTable,
} as Meta;

const transactions: PlaidAccountTransaction[] = Array.from({ length: 50 }, () =>
  PlaidAccountTransactionClass.randomInstance(),
).sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime());

const txnWithProperDate = transactions.map((txn) => {
  return {
    ...txn,
    // randomly generate a date between 1/1/2020 and today
    authorizedDate: new Date(
      Math.random() *
        (new Date().getTime() - new Date(2023, 10, 29).getTime()) +
        new Date(2023, 10, 29).getTime(),
    ).toLocaleDateString(),
    // generate a random amount in the range of 100 to 10000
    amount: Math.floor(Math.random() * (10000 - 100) + 100),
    // generata a random set of tags which are random strigns
    tags: Array.from({ length: 5 }, () => Math.random().toString(36)),
    // generate a random transaction nae and emrchant name
    transactionName: Math.random().toString(36),
    merchantName: Math.random().toString(36),
  };
});

const Template: Story = (args) => (
  <DataTable data={txnWithProperDate} columns={columns} {...args} />
);

export const Default = Template.bind({});
Default.args = {
  txnWithProperDate,
};
