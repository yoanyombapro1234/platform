import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { useAppSelector } from "src/redux/store/hooks";
import { selectUserFinancialProfile } from "src/redux/slice/authentication/AuthenticationSelector";
import { CreditAccount, Link } from "@solomon-ai/component-library";
import { CreditAccountCard } from "./credit-account-card/CreditAccountCard";

interface IProps {
  account: CreditAccount;
  institutionName: string;
}

const CreditAccountSummaryCard: React.FC<IProps> = (props) => {
  const { account, institutionName } = props;
  const samplQuestions: string[] = [
    "What is my account's interest rate?",
    "What is my minimum payment, and when is it due?",
    "What is my credit limit?",
    "How is my credit utilization ratio calculated?",
  ];

  const financialProfile = useAppSelector(selectUserFinancialProfile);
  let initialCreditAccounts: CreditAccount[] = [];

  const aggregatedCreditAccounts =
    financialProfile.link?.reduce((acc: CreditAccount[], current: Link) => {
      if (current.creditAccounts) {
        acc.push(...current.creditAccounts);
      }
      return acc;
    }, initialCreditAccounts) || [];

  return (
    <AskMelodiyAILayout
      context={aggregatedCreditAccounts}
      sampleQuestions={samplQuestions}
    >
      <CreditAccountCard
        institutionName={institutionName}
        creditAccount={account}
      />
    </AskMelodiyAILayout>
  );
};

export { CreditAccountSummaryCard };
