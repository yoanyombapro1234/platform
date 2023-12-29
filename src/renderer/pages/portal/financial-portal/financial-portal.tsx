import React, { useState } from "react";
import { BankAccountsOverviewSummary } from "src/components/bank-accounts-overview-summary";
import { CreditAccountsOverviewSummary } from "src/components/credit-accounts-overview-summary";
import { LinkedAccountCard } from "src/components/cards/linked-account-card";
import { OPTIONS } from "src/layouts/portal-layout";
import {
  selectCurrentUserAccount,
  selectUserFinancialContext,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { RecurringTransactionOverview } from "src/components/recurring-transaction-component";
import { InvestmentAccountsView } from "../../investments/investments-view";
import {
  BankAccount,
  CreditAccount,
  InvestmentAccount,
} from "@solomon-ai/component-library";
import { Search } from "src/components/search";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { CreateGoalButton } from "src/components/button/create-goal-button";
import { mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";

/**
 * Enum representing different types of selected account types in the portal.
 */
enum SelectedAccountType {
  OVERVIEW = "OVERVIEW",
  BANK_ACCOUNT = "BANK_ACCOUNT",
  CREDIT_CARD = "CREDIT_CARD",
  INVESTMENT_ACCOUNT = "INVESTMENT_ACCOUNT",
  SUBSCRIPTIONS = "SUBSCRIPTIONS",
  INVESTMENTS_ACCOUNT_V2 = "INVESTMENTS_ACCOUNT_V2",
}

/**
 * The main financial analytics portal component that renders summary and analytics tabs.
 */
const FinancialAnalyticsPortal: React.FC = () => {
  // useSelector hook to extract data from Redux Store, getting user's financial profile from the authentication selector
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  return (
    <>
      <Tabs defaultValue={OPTIONS.OVERVIEW} className="space-y-4">
        <TabsContent value={OPTIONS.OVERVIEW} className="space-y-4">
          <FinancialPortalComponent />
        </TabsContent>
      </Tabs>
    </>
  );
};

const FinancialAnalyticsPortalOverview: React.FC = () => {
  const currentAccount = useAppSelector(selectCurrentUserAccount);
  const currentFinancialContext = useAppSelector(selectUserFinancialContext);
  // get the current financial profile
  const financialProfile = useAppSelector(selectUserFinancialProfile);

  const linkedInstitutions =
    financialProfile.link !== undefined ? financialProfile.link : [];

  // get the linked institution names
  const linkedInstitutionNames = linkedInstitutions.map((link) => {
    return link.institutionName !== undefined
      ? " " + link.institutionName.toLowerCase()
      : "";
  });

  const numConnectedAccounts =
    (currentFinancialContext.bankAccounts?.length ?? 0) +
    (currentFinancialContext.creditAccounts?.length ?? 0) +
    (currentFinancialContext.investmentAccounts?.length ?? 0) +
    (currentFinancialContext.mortgageLoanAccounts?.length ?? 0) +
    (currentFinancialContext.studentLoanAccounts?.length ?? 0);
  const stats = [
    {
      id: 1,
      name: "Connected Accounts",
      value: numConnectedAccounts,
    },
    {
      id: 2,
      name: "Number Of Linked Institutions",
      value: `${linkedInstitutions.length}`,
    },
    {
      id: 3,
      name: "Linked Institutions",
      value: `${linkedInstitutionNames}`,
    },
  ];

  const samplQuestions: string[] = [
    "Tell me a bit about my spending lately",
    "Which of my expenses are the highest?",
    "Across what categories are my expenses distributed?",
    "What would you advise l do based on this?",
  ];

  return (
    <AskMelodiyAILayout
      context={currentFinancialContext}
      sampleQuestions={samplQuestions}
    >
      <div className="bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-7xl lg:mx-0">
            <div className="flex flex-row justify-between">
              <p className="text-base font-semibold leading-7 text-blue-600 md:pt-[10%]">
                Solomon AI
              </p>
              <div className="ml-auto flex items-center space-x-4">
                <CreateGoalButton className="text-xs text-white px-2 border bg-black" />
                <Search
                  placeholder="Search Transactions ..."
                  className="border shadow-sm"
                />
              </div>
            </div>

            <h2 className="mt-2 text-4xl font-bold tracking-tight text-black sm:text-6xl">
              Financial Portal
              <span className="ml-4 text-sm font-base">
                {" "}
                {linkedInstitutions !== undefined
                  ? linkedInstitutions.length
                  : 0}{" "}
                Linked Accounts
              </span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Your Premier Gateway to Wealth Mastery and Financial Liberation.
            </p>
            <div>
              <h2 className="py-5 text-2xl font-bold tracking-tight">
                Overview{" "}
                <span className="ml-1 text-xs">
                  {" "}
                  {linkedInstitutions.length} Linked Accounts
                </span>
              </h2>
              <div className="pt-3 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2 md:mx-[5%]">
                {linkedInstitutions.map((link, idx) => (
                  <LinkedAccountCard link={link} key={idx} />
                ))}
              </div>
            </div>
          </div>
        </div>

        <dl className="mt-16 grid grid-cols-1 gap-0.5 overflow-hidden rounded-2xl text-center sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.id} className="flex flex-col bg-gray-400/5 p-8">
              <dt className="text-sm font-semibold leading-6 text-gray-600">
                {stat.name}
              </dt>
              <dd className="order-first text-3xl font-semibold tracking-tight text-gray-900">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </AskMelodiyAILayout>
  );
};

/**
 * Component displaying the financial portal overview.
 */
const FinancialPortalComponent: React.FC = () => {
  const [selectedAccountType, setSelectedAccountType] =
    useState<SelectedAccountType>(SelectedAccountType.BANK_ACCOUNT);
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const currentAccount = useAppSelector(selectCurrentUserAccount);

  if (!linkedBankAccounts) {
    return <div></div>;
  }

  type CreditAccountMap = {
    [key: string]: CreditAccount[];
  };

  const isObjectEmpty = (obj: CreditAccountMap): boolean => {
    return Object.keys(obj).length === 0;
  };

  const creditCardToInstitutionNameMap =
    linkedBankAccounts.reduce<CreditAccountMap>((acc, card) => {
      if (card.creditAccounts && card.institutionName) {
        acc[card.institutionName] = card.creditAccounts;
      }
      return acc;
    }, {});

  const allBankAccounts = linkedBankAccounts.reduce<BankAccount[]>(
    (acc, link) => {
      if (link.bankAccounts) {
        // Check if bankAccounts is defined
        return [...acc, ...link.bankAccounts];
      }
      return acc;
    },
    [],
  );

  const allInvestmentAccounts = linkedBankAccounts.reduce<InvestmentAccount[]>(
    (acc, link) => {
      if (link.investmentAccounts) {
        // Check if investmentAccounts is defined
        return [...acc, ...link.investmentAccounts];
      }
      return acc;
    },
    [],
  );
  // across the linked accounts get all bankAccounts
  // compute the sum of all bank accounts under this linked account
  // compute the same for all credit cards
  // compute the total balance

  mixPanelClient.trackEventOfType(
    eventNames.FEATURE_VIEW_FINANCIAL_SUB_DASHBOARD_EVENT,
    {
      userID: currentAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${currentAccount.username}`,
        tags: `${currentAccount.tags}`,
      },
    },
  );
  return (
    <>
      <div className="sm:block hidden">
        <Tabs defaultValue={SelectedAccountType.OVERVIEW}>
          <TabsList className="m-1 bg-black py-2">
            <TabsTrigger value={SelectedAccountType.OVERVIEW}>
              Overview
            </TabsTrigger>
            <TabsTrigger value={SelectedAccountType.BANK_ACCOUNT}>
              Bank Account
            </TabsTrigger>
            <TabsTrigger value={SelectedAccountType.CREDIT_CARD}>
              Credit Account
            </TabsTrigger>
            <TabsTrigger value={SelectedAccountType.INVESTMENT_ACCOUNT}>
              Investment Account
            </TabsTrigger>
            <TabsTrigger value={SelectedAccountType.SUBSCRIPTIONS}>
              Subscriptions
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value={SelectedAccountType.OVERVIEW}
            className="pt-20 md:pt-15 lg:pt-10"
          >
            <FinancialAnalyticsPortalOverview />
          </TabsContent>
          <TabsContent
            value={SelectedAccountType.BANK_ACCOUNT}
            className="pt-20 md:pt-15 lg:pt-10"
          >
            <BankAccountsOverviewSummary allBankAccounts={allBankAccounts} />
          </TabsContent>
          <TabsContent
            value={SelectedAccountType.CREDIT_CARD}
            className="pt-20 md:pt-15 lg:pt-10"
          >
            <CreditAccountsOverviewSummary
              creditCardToInstitutionNameMap={creditCardToInstitutionNameMap}
            />
          </TabsContent>

          <TabsContent
            value={SelectedAccountType.INVESTMENT_ACCOUNT}
            className="pt-20 md:pt-15 lg:pt-10"
          >
            <InvestmentAccountsView
              investment_accounts={allInvestmentAccounts}
            />
          </TabsContent>

          <TabsContent
            value={SelectedAccountType.SUBSCRIPTIONS}
            className="pt-20 md:pt-15 lg:pt-10"
          >
            <RecurringTransactionOverview />
          </TabsContent>
        </Tabs>
      </div>
      <div className="mb-2 md:hidden block lg:hidden">
        <select
          value={selectedAccountType}
          onChange={(e) =>
            setSelectedAccountType(e.target.value as SelectedAccountType)
          }
          className="m-1 bg-black py-2 text-white"
        >
          <option value={SelectedAccountType.BANK_ACCOUNT}>Bank Account</option>
          <option value={SelectedAccountType.CREDIT_CARD}>
            Credit Account
          </option>
          <option value={SelectedAccountType.INVESTMENT_ACCOUNT}>
            Investment Account
          </option>
          <option value={SelectedAccountType.SUBSCRIPTIONS}>
            Subscriptions
          </option>
        </select>

        {selectedAccountType === SelectedAccountType.BANK_ACCOUNT && (
          <BankAccountsOverviewSummary allBankAccounts={allBankAccounts} />
        )}
        {selectedAccountType === SelectedAccountType.CREDIT_CARD && (
          <CreditAccountsOverviewSummary
            creditCardToInstitutionNameMap={creditCardToInstitutionNameMap}
          />
        )}
        {selectedAccountType === SelectedAccountType.INVESTMENT_ACCOUNT && (
          <InvestmentAccountsView investment_accounts={allInvestmentAccounts} />
        )}

        {selectedAccountType === SelectedAccountType.SUBSCRIPTIONS && (
          <RecurringTransactionOverview />
        )}
      </div>
    </>
  );
};

export { FinancialAnalyticsPortal };
