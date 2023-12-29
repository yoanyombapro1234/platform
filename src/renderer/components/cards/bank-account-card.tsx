import { Card, CardHeader, CardTitle } from "../ui/card";
import { Label } from "../ui/label";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import {
  AccountBalanceHistory,
  BankAccount,
  BankAccountClass,
  Link,
} from "@solomon-ai/component-library";
import { Spinner } from "../spinner";
import { useGetAllConnectedAccountsBalanceHistoryQuery } from "src/redux/queries/balance-history/get-balance-history";
import { ArrowRight } from "lucide-react";
import { Link as ReactRouterLink } from "react-router-dom";
import { routes } from "src/constant/routes";
import { CreateGoalButton } from "../button/create-goal-button";
import { Button } from "../ui/button";
import { selectUserFinancialContext } from "../../redux/slice/authentication/AuthenticationSelector";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { BankAccountCard } from "./bank-account-card/BankAccountCard";
import { TriggerSyncButton } from "../button/trigger-sync-button";

/**
 * Props interface for the BankAccountSummaryCard component.
 */
interface IProps {
  /**
   * The bank account information to display.
   */
  account: BankAccount;
}

/**
 * BankAccountSummaryCard component displays a summary card for a bank account.
 * It shows details like balance, account number, pockets, and goals.
 *
 * @param props - The props for the component.
 * @returns A React functional component.
 */
const BankAccountSummaryCard: React.FC<IProps> = (props) => {
  const financialContext = useAppSelector(selectUserFinancialContext);
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const userAccount = useAppSelector(selectCurrentUserAccount);
  const bankAccountToLinkMap = new Map<string, Link>();

  let bankAccounts: BankAccount[] = [];
  if (financialProfile.link !== undefined) {
    financialProfile.link.reduce((acc: BankAccount[], current: Link) => {
      const { bankAccounts } = current;
      if (bankAccounts === undefined) {
        return acc;
      }

      acc.push(...bankAccounts);
      return acc;
    }, bankAccounts);

    // create a hashmap comprised of bank account to link mapping
    financialProfile.link.forEach((link) => {
      link.bankAccounts?.forEach((bankAccount) => {
        bankAccountToLinkMap.set(bankAccount.plaidAccountId!, link);
      });
    });
  }

  const currentUserId = useAppSelector(selectCurrentUserID);

  const { account } = props;

  const sampleQuestions: string[] = [
    "How much money do I have in my account?",
    "Am l spending too much in my account?",
    "What fees are associated with my account?",
    "How can l optimize my spending on this account?",
  ];

  // call the backend and obtain the historical account balance for this
  const req = {
    userId: Number(currentUserId),
    plaidAccountId: account.plaidAccountId!,
    profileType: financialProfile.profileType!,
  };

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetAllConnectedAccountsBalanceHistoryQuery(req);

  let accountHistoricalBalance: AccountBalanceHistory[] = [];
  let spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;

  if (isSuccess && response.historicalAccountBalance) {
    accountHistoricalBalance = response.historicalAccountBalance;
  } else if (isLoading) {
    spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;
  } else if (
    isSuccess &&
    (response.historicalAccountBalance?.length == 0 ||
      response.historicalAccountBalance == undefined)
  ) {
    spinner = (
      <Card className="py-2">
        <CardHeader>
          <CardTitle>We are still pulling in your data!</CardTitle>
          <p>Sit tight and relax. We are still pulling in your data </p>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <AskMelodiyAILayout
        context={bankAccounts}
        sampleQuestions={sampleQuestions}
        className="border-2 border-t"
      >
        <div className="flex flex-row justify-between">
          <ReactRouterLink
            className="flex flex-row gap-1 p-2"
            to={routes.BANK_ACCOUNT_OVERVIEW}
            state={{
              account: account,
              financialProfile: financialProfile,
              historicalAccountBalance: accountHistoricalBalance,
              sampleQuestions: sampleQuestions,
            }}
          >
            <Button className="flex-row gap-3 bg-white border shadow-sm">
              <Label className="text-sm font-semibold text-black">
                Account Overview
              </Label>
              <ArrowRight className="w-4 h-4 text-black" />
            </Button>
          </ReactRouterLink>
          <CreateGoalButton />
          {bankAccountToLinkMap.get(account.plaidAccountId!) !== undefined &&
            bankAccountToLinkMap.get(account.plaidAccountId!)?.id && (
              <TriggerSyncButton
                linkId={bankAccountToLinkMap.get(account.plaidAccountId!)!.id!}
                financialAccountType={"FINANCIAL_ACCOUNT_TYPE_BANK"}
              />
            )}
        </div>

        <BankAccountCard
          bankAccount={new BankAccountClass(account)}
          className="bg-white shadow-none"
          enableDemoMode={false}
          historicalAccountBalance={accountHistoricalBalance}
          financialProfile={financialProfile}
        />
      </AskMelodiyAILayout>
    </>
  );
};

/**
 * Helper function to format the pocket name string.
 *
 * @param input - The pocket name string to format.
 * @returns The formatted pocket name string.
 */
function formatPocketNameString(input: string): string {
  const prefix = "POCKET_TYPE_";

  // Remove the prefix
  let formatted = input.startsWith(prefix) ? input.slice(prefix.length) : input;

  // Replace all underscores with spaces
  formatted = formatted.replace(/_/g, " ");

  return formatted.toLowerCase();
}

export { BankAccountSummaryCard };
