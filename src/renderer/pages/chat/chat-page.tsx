import { Cog6ToothIcon, DocumentPlusIcon } from "@heroicons/react/24/outline";
import {
  BankAccount,
  CreditAccount,
  InvestmentAccount,
  Link,
  MortgageAccount,
  StudentLoanAccount,
} from "@solomon-ai/component-library";
import { PlusCircleIcon, RocketIcon } from "lucide-react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { AsyncTaskStatusBanner } from "src/components/async-task-status-banner";
import { AsyncTaskPoller } from "src/components/button/trigger-sync-button";
import { Chat, ContextTypes } from "src/components/chat/chat";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Badge } from "src/components/ui/badge";
import { Button } from "src/components/ui/button";
import { Card } from "src/components/ui/card";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "src/components/ui/hover-card";
import { Separator } from "src/components/ui/separator";
import { Layout } from "src/layouts/layout";
import { cn } from "src/lib/utils";
import {
  selectAuthenticationState,
  selectBankTotalsAcrossAllAcounts,
  selectCreditAccountTotalsAcrossAllAccounts,
  selectCurrentSocialProfile,
  selectInvestmentAccountTotalsAcrossAllAccounts,
  selectMortgageAccountTotalsAcrossAllAccounts,
  selectStudentLoanAccountTotalsAcrossAllAccounts,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import {
  selectCurrentUserID,
  selectUserFinancialContext,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { authenticateUserAction } from "src/redux/slice/authentication/AuthenticationSlice";
import { useAppSelector } from "src/redux/store/hooks";

/**
 * ChatPage component to render the chat page with financial context information.
 * @returns {JSX.Element} - The JSX element representing the ChatPage component.
 */
const samplQuestions: string[] = [
  "How much money do I have in my account?",
  "What is my credit utilization rate?",
  "Tell me about my holdings?",
  "How can l optimize my spending on this account?",
];

const ChatPage: React.FC = () => {
  // Get the current user ID from the Redux store
  const userId = useAppSelector(selectCurrentUserID);
  const financialContext = useAppSelector(selectUserFinancialContext);
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const { taskId } = useParams();
  const authenticationState = useAppSelector(selectAuthenticationState);
  const dispatch = useDispatch();

  const onTaskCompleteHandler = () => {
    // update the redux store
    dispatch(authenticateUserAction(authenticationState));
  };

  // if the task id is not undefined, we pass it to the banner component which will
  // continue to poll the backend for the status of the task
  let investmentAccounts: InvestmentAccount[] = [];
  if (financialProfile.link) {
    investmentAccounts = financialProfile.link.reduce<InvestmentAccount[]>(
      (acc, link: Link) => {
        if (link.investmentAccounts) {
          // Check if investmentAccounts is defined
          return [...acc, ...link.investmentAccounts];
        }
        return acc;
      },
      []
    );
  }

  /*
    TODO: Get these funcitons to be util functions that can be shared across components for context
  */
  let creditAccounts: CreditAccount[] = [];
  if (financialProfile.link) {
    financialProfile.link.reduce((acc: CreditAccount[], current: Link) => {
      const { creditAccounts } = current;

      if (creditAccounts) {
        // Check if creditAccounts is defined
        acc.push(...creditAccounts);
      }

      return acc;
    }, creditAccounts);
  }

  let bankAccounts: BankAccount[] = [];
  if (financialProfile.link) {
    financialProfile.link.reduce((acc: BankAccount[], current: Link) => {
      const { bankAccounts } = current;

      if (bankAccounts) {
        // Check if bankAccounts is defined
        acc.push(...bankAccounts);
      }

      return acc;
    }, bankAccounts);
  }

  let mortgageAccounts: MortgageAccount[] = [];
  if (financialProfile.link) {
    financialProfile.link.reduce(
      (acc: MortgageAccount[], current: Link) => {
        const { mortgageAccounts } = current;

        if (mortgageAccounts) {
          // Check if mortgageAccounts is defined
          acc.push(...mortgageAccounts);
        }

        return acc;
      },
      mortgageAccounts || [] // Use default value if mortgageAccounts is undefined
    );
  }

  let studentLoanAccounts: StudentLoanAccount[] = [];
  if (financialProfile.link) {
    financialProfile.link.reduce(
      (acc: StudentLoanAccount[], current: Link) => {
        const { studentLoanAccounts } = current;

        if (studentLoanAccounts) {
          // Check if mortgageAccounts is defined
          acc.push(...studentLoanAccounts);
        }

        return acc;
      },
      studentLoanAccounts || [] // Use default value if studentLoanAccounts is undefined
    );
  }

  const baseContext: ContextTypes = {
    contextName: "default - general finances",
    context: financialContext,
  };

  const secondaryContexts: ContextTypes[] = [
    {
      contextName: "your investments",
      context: investmentAccounts,
    },
    {
      contextName: "your bank accounts",
      context: bankAccounts,
    },
    {
      contextName: "your credit accounts",
      context: creditAccounts,
    },
    {
      contextName: "your mortgage accounts",
      context: creditAccounts,
    },
    {
      contextName: "your student loan accounts",
      context: studentLoanAccounts,
    },
  ];

  // compute the total balance of all accounts
  let totalBalance: number = 0;
  let totalCreditBalance: number = 0;
  let totalDebt: number = 0;
  let totalAssets: number = 0;

  // TODO: may need to rethink this
  if (financialProfile.link) {
    financialProfile.link.forEach((link: Link) => {
      if (link.bankAccounts) {
        link.bankAccounts.forEach((account: BankAccount) => {
          totalBalance += account.balance;
          totalAssets += account.balance;
        });
      }
      if (link.creditAccounts) {
        link.creditAccounts.forEach((account: CreditAccount) => {
          totalCreditBalance += account.balance ?? 0;
          totalDebt += account.balance ?? 0;
        });
      }
      if (link.mortgageAccounts) {
        link.mortgageAccounts.forEach((account: MortgageAccount) => {
          totalDebt += account.outstandingPrincipalBalance ?? 0;
        });
      }
      if (link.studentLoanAccounts) {
        link.studentLoanAccounts.forEach((account: StudentLoanAccount) => {
          totalDebt +=
            (account.outstandingInterestAmount ?? 0) +
            (account.originationPrincipalAmount ?? 0);
        });
      }
    });
  }

  return (
    <Layout>
      {/**
       * Here we place the sidebar component
       */}
      {taskId && (
        <AsyncTaskPoller
          taskId={taskId}
          onSuccessCallback={onTaskCompleteHandler}
          interval={15000}
        />
      )}

      <div className="grid border-t lg:grid-cols-5">
        <ChatAISidebar className="hidden lg:block" />
        <div className="flex flex-col items-center justify-center h-[100%] gap-12 bg-white rounded-2xl col-span-3 lg:col-span-4 lg:border-l">
          {/**
           * Here we discloe account level statistics to the user
           * Stats:
           *  Account balance accross all accounts,
           *  Credit utilization rate
           *  Total debt
           *  Total assets
           *  Total net worth
           */}
          <div className="flex flex-col justify-end p-5 mx-4">
            <FinancialSummary />
            <div className="border-0 rounded-2xl h-full sm:w-[70%] w-[90%]">
              <section className="flex flex-col gap-3">
                <Chat
                  baseContext={baseContext}
                  sampleQuestions={samplQuestions}
                  secondaryContext={secondaryContexts}
                  className="h-full border-0 w-fit shadow-0"
                />
              </section>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

const FinancialSummary: React.FC<{
  className?: string;
}> = ({ className }) => {
  const profile = useAppSelector(selectUserFinancialProfile);
  const totalCreditAccountBalance = useAppSelector(
    selectCreditAccountTotalsAcrossAllAccounts
  );
  const totalStudentloanBalance = useAppSelector(
    selectStudentLoanAccountTotalsAcrossAllAccounts
  );
  const totalMortgageAccountBalance = useAppSelector(
    selectMortgageAccountTotalsAcrossAllAccounts
  );
  const totalAccountBalance = useAppSelector(selectBankTotalsAcrossAllAcounts);
  const totalInvestmentAccountBalance = useAppSelector(
    selectInvestmentAccountTotalsAcrossAllAccounts
  );

  if (profile.link) {
    const totalDebt =
      totalCreditAccountBalance +
      totalStudentloanBalance +
      totalMortgageAccountBalance;

    const totalBalance = totalAccountBalance;
    const totalAssets = totalAccountBalance + totalInvestmentAccountBalance;

    // The computed values can be used in the return JSX below
    return (
      <div className={cn("grid grid-cols-3 gap-2 p-3", className)}>
        <Card className="p-4 space-y-3 bg-white border rounded-lg shadow-md md:p-6">
          <strong className="text-sm font-semibold md:text-xl">
            Total Balance
          </strong>{" "}
          <div className="text-lg font-bold md:text-2xl">
            ${totalBalance?.toFixed(2)}
          </div>
          <p className="text-xs text-gray-600 md:text-md md:text-gray-700">
            Total balance across all your connected accounts
          </p>
        </Card>
        <Card className="p-4 space-y-3 bg-white border rounded-lg shadow-md md:p-6">
          <strong className="text-sm font-semibold md:text-xl">
            Total Assets
          </strong>{" "}
          <div className="text-lg font-bold md:text-2xl">
            ${totalAssets?.toFixed(2)}
          </div>
          <p className="text-xs text-gray-600 md:text-md md:text-gray-700">
            Total assets across all your connected accounts
          </p>
        </Card>
        <Card className="p-4 space-y-3 bg-white border rounded-lg shadow-md md:p-6">
          <strong className="text-sm font-semibold md:text-xl">
            Total Debt Balance
          </strong>{" "}
          <div className="text-lg font-bold md:text-2xl">
            ${totalDebt?.toFixed(2)}
          </div>
          <p className="text-xs text-gray-600 md:text-md md:text-gray-700">
            Total credit balance you owe across all your connected accounts
          </p>
        </Card>
      </div>
    );
  }

  return <div></div>;
};

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function ChatAISidebar({ className }: SidebarProps) {
  const profile = useAppSelector(selectCurrentSocialProfile);

  return (
    <div className={cn("pb-12", className)}>
      <div className="py-4 space-y-4">
        <div className="px-3 py-2">
          <div className="flex flex-1 gap-2">
            <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
              Conversations
            </h2>
            <Badge className="px-4 py-1 text-xs" variant={"outline"}>
              Private Beta
            </Badge>
          </div>

          <div className="space-y-1">
            <Button variant="secondary" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              List Conversations
            </Button>
            <Button variant="ghost" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
              Explore Conversations
            </Button>
          </div>
        </div>
        <div className="px-3 py-2">
          <div className="flex flex-1 gap-2">
            <h2 className="px-4 mb-2 text-lg font-semibold tracking-tight">
              Assistant Fleets
            </h2>
            <Badge className="px-4 py-1 text-xs" variant={"outline"}>
              Private Beta
            </Badge>
          </div>
          <div className="space-y-1">
            <Button variant="ghost" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M21 15V6" />
                <path d="M18.5 18a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                <path d="M12 12H3" />
                <path d="M16 6H3" />
                <path d="M12 18H3" />
              </svg>
              <ChatAISidebarItemHover
                title="Budgeting and Forecasting Fleet"
                description="This agent assists in budget creation and financial forecasting. Using historical data, it predicts future revenue, expenses, and cash flow needs, aiding in strategic planning and financial stability. It helps in identifying spending patterns, potential cost savings, and provides insights for informed decision-making about business growth and investments."
                stage="Private Beta"
              />
            </Button>
            <Button variant="ghost" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <circle cx="8" cy="18" r="4" />
                <path d="M12 18V2l7 4" />
              </svg>
              <ChatAISidebarItemHover
                title="Tax and Compliance Fleet"
                description=" This agent ensures meticulous adherence to tax laws and
              regulations, streamlines tax preparation and filing, and manages
              compliance-related tasks. It&lsquo;s a comprehensive solution for
              managing all tax-related activities, keeping solo entrepreneurs on
              track with their fiscal responsibilities."
                stage="Private Beta"
              />
            </Button>
            <p className="text-xs"></p>
            <Button variant="ghost" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <ChatAISidebarItemHover
                title="Accounting Fleet"
                description="This agent automates accounting tasks, including bookkeeping, invoicing, and payroll. It helps in tracking income and expenses, managing invoices, and generating financial reports. It also facilitates tax preparation and filing, ensuring compliance with tax laws and regulations."
                stage="Private Beta"
              />
            </Button>
            <Button variant="ghost" className="justify-start w-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4 mr-2"
              >
                <path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12" />
                <circle cx="17" cy="7" r="5" />
              </svg>
              <ChatAISidebarItemHover
                title="Spend Management Fleet"
                description="Designed to commandeer the challenges of cash flow management and debt handling, this tool offers strategic advice and predictive insights. It helps maintain a healthy balance between income and expenditures, ensuring smooth financial operations for solo practitioners."
                stage="Private Beta"
              />
            </Button>
          </div>
        </div>
        <Separator />
        <div className="px-3 py-2">
          <Button variant="ghost" className="justify-start w-full text-black">
            <PlusCircleIcon className="w-4 h-4 mr-2" /> Create A Fleet
          </Button>
          <Button variant="ghost" className="justify-start w-full text-black">
            <DocumentPlusIcon className="w-4 h-4 mr-2" /> Create A Conversation
          </Button>
        </div>{" "}
        <div className="fixed p-4 bottom-10">
          {/* Content of your bottom component */}
          <Button variant="ghost" className="justify-start w-full text-black">
            <Cog6ToothIcon className="w-4 h-4 mr-2" /> Settings
          </Button>
          <Button
            variant="ghost"
            className="flex flex-row justify-start w-full gap-2 text-black"
          >
            <Avatar className="w-6 h-6">
              <AvatarImage src={profile?.profileImageUrl} />
              <AvatarFallback>{profile?.name}</AvatarFallback>
            </Avatar>
            <p>
              <span className="font-semibold">{profile?.name}</span>{" "}
            </p>
          </Button>
        </div>
      </div>
    </div>
  );
}

const ChatAISidebarItemHover: React.FC<{
  title: string;
  description: string;
  stage: string;
}> = ({ title, description, stage }) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">{title}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://github.com/vercel.png" />
            <AvatarFallback>VC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">{title}</h4>
            <p className="text-xs">{description}</p>
            <div className="flex items-center pt-2">
              <Badge className="text-xs text-black" variant={"outline"}>
                <RocketIcon className="w-4 h-4 mr-2 opacity-70" /> {stage}
              </Badge>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
export { ChatPage };
