import {
  AccountBalanceHistory,
  AccountsView,
  BankAccountClass,
  CombinedAccounts,
} from "@solomon-ai/component-library";
import { useLocation, useNavigate } from "react-router-dom";
import { BackButton } from "src/components/button/back-button";
import { Label } from "src/components/ui/label";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { Layout } from "src/layouts/layout";
import { SingleAccountView } from "./single-account-view";

const BankAccountOverviewPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    account,
    financialProfile,
    historicalAccountBalance,
    sampleQuestions,
  } = location.state;

  const bankAccount = new BankAccountClass(account);
  const accountBalance = historicalAccountBalance as AccountBalanceHistory[];

  return (
    <Layout>
      <AskMelodiyAILayout
        context={bankAccount}
        sampleQuestions={sampleQuestions}
        className="bg-white m-5"
      >
        <BackButton className="text-md md:text-md bg-white text-black border" />
        <div className="flex flex-row gap-2">
          <Label>
            <h1 className="text-lg md:text-5xl font-bold">
              Bank Account Overview
            </h1>
            <p className="text-md md:text-xl font-base">{bankAccount.name}</p>
          </Label>
        </div>

        <SingleAccountView
          account={bankAccount}
          historicalAccountBalance={accountBalance}
          userName={""}
          addGoalCallback={function (): void {}}
          addMilestoneCallback={function (): void {}}
          className="w-[100%] text-black md:p-5"
        />
      </AskMelodiyAILayout>
    </Layout>
  );
};

export { BankAccountOverviewPage };
