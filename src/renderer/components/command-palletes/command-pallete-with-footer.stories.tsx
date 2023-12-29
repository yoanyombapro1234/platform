import { Story, Meta } from "@storybook/react";
import {
  BankAccount,
  BankAccountClass,
  CreditAccount,
  CreditAccountClass,
  InvestmentAccount,
  InvestmentAccountClass,
  StudentLoanAccount,
  StudentLoanAccountClass,
  Transaction,
  TransactionClass,
} from "@solomon-ai/component-library";
import {
  AccountMetadata,
  CommandPalleteWithFooter,
} from "./command-palleter-with-footer";

export default {
  title: "CommandPalletes/CommandPalleteWithFooter",
  component: CommandPalleteWithFooter,
} as Meta;

const transactions: Transaction[] = Array.from(
  { length: 50 },
  () => TransactionClass.randomInstance() as Transaction,
).sort((a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime());

const bankAccount: BankAccount[] = Array.from(
  { length: 3 },
  () => BankAccountClass.randomInstance() as BankAccount,
);

const creditAccount: CreditAccount[] = Array.from(
  { length: 3 },
  () => CreditAccountClass.randomInstance() as CreditAccount,
);

const investmentAccount: InvestmentAccount[] = Array.from(
  { length: 3 },
  () => InvestmentAccountClass.randomInstance() as InvestmentAccount,
);

const studentloanAccount: StudentLoanAccount[] = Array.from(
  { length: 3 },
  () => StudentLoanAccountClass.randomInstance() as StudentLoanAccount,
);

const accounts = [
  ...bankAccount,
  ...creditAccount,
  ...investmentAccount,
  ...studentloanAccount,
];

const input: AccountMetadata[] = accounts.map((account) => {
  return {
    name: account.name!,
    accountPlaidId: account.plaidAccountId!,
  };
});

const Template: Story = (args) => (
  <CommandPalleteWithFooter
    accounts={input}
    transactions={transactions}
    {...args}
  />
);

export const Default = Template.bind({});
Default.args = {
  transactions,
};
