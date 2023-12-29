import { Meta, Story } from "@storybook/react";
import { PlaidAccountTransactionCard } from "./plaid-account-transaction-card";
import { PlaidAccountTransactionClass } from "@solomon-ai/component-library";

export default {
  title: "Cards/PlaidAccountTransactionCard",
  component: PlaidAccountTransactionCard,
} as Meta;

let txn = PlaidAccountTransactionClass.randomInstance();
txn.tags = Array.from({ length: 5 }, () => Math.random().toString(36));

const Template: Story = (args) => (
  <PlaidAccountTransactionCard transaction={txn} {...args} />
);

export const Default = Template.bind({});
Default.args = {};
