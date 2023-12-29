import React from "react";
import { createContext, ReactNode, RefObject, Component } from "react";
import { cn } from "src/lib-utils/utils";
import { Card, CardHeader, CardContent, CardFooter } from "../../ui/card";
import { HistoricalAccountBalanceChart } from "../../charts-and-graphs/historical-account-balance-chart";
import { Badge } from "../../ui/badge";
import { HoverCard, HoverCardTrigger } from "@radix-ui/react-hover-card";
import { HoverCardContent } from "../../ui/hover-card";
import { InvestmentHoldingCard } from "../investment-holding-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";
import { InvestmentSecurityCard } from "../investment-security-card";
import {
  AccountBalanceHistory,
  InvestmentAccount,
  InvestmentSecurity,
} from "@solomon-ai/component-library";
import { InvestmentAccountClass } from "@solomon-ai/component-library";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/** @type {React.Context<InvestmentAccount>} */
const InvestmentAccountCardContext = createContext<InvestmentAccount>(
  new InvestmentAccountClass({})
);

export type InvestmentAccountCardProps = {
  investmentAccount: InvestmentAccount;
  historicalAccountBalance?: AccountBalanceHistory[];
  enableDemoMode?: boolean;
  className?: string;
};

export type InvestmentAccountCardState = {
  investmentAccount: InvestmentAccount;
};

/**
 * @class InvestmentAccountCard
 * @extends {Component<InvestmentAccountCardProps, InvestmentAccountCardState>}
 *
 * @description
 * This is a templated advanced React class component written in TypeScript
 * with TSDoc annotations. It has various features like context usage,
 * dynamic styles, generic props, and more.
 */
export class InvestmentAccountCard extends Component<
  InvestmentAccountCardProps,
  InvestmentAccountCardState
> {
  private myRef: RefObject<HTMLDivElement>;

  static defaultProps = {
    InvestmentAccount: new InvestmentAccountClass({}),
    historicalAccountBalance: [],
  };

  constructor(props: InvestmentAccountCardProps) {
    super(props);
    this.state = {
      investmentAccount: props.investmentAccount,
    };

    this.myRef = React.createRef();
  }

  /**
   * Lifecycle method that runs after the component has been mounted.
   */
  componentDidMount() {
    // You can use the ref here, for example:
    if (this.myRef.current) {
      this.myRef.current.focus();
    }
  }

  /**
   * Renders the component.
   * @returns {ReactNode}
   */
  render(): ReactNode {
    const { className, enableDemoMode, historicalAccountBalance } = this.props;
    const investmentAccount = enableDemoMode
      ? InvestmentAccountClass.randomInstance()
      : this.state.investmentAccount;

    return (
      <InvestmentAccountCardContext.Provider value={investmentAccount}>
        <Card
          className={cn(
            "flex flex-col bg-white rounded-lg shadow-lg overflow-hidden min-h-[400px] rounded-t-2xl rounded-b-2xl gap-3",
            className
          )}
        >
          <CardHeader className="flex flex-col flex-1 px-6 py-8">
            <HoverCard>
              <p className="text-lg font-bold">
                <HoverCardTrigger>
                  {investmentAccount.name
                    ? investmentAccount.name.toUpperCase()
                    : ""}
                </HoverCardTrigger>
                <span
                  className="ml-1 text-xs"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  {" "}
                  {investmentAccount.number}
                </span>
              </p>
              <HoverCardContent className="w-fit rounded-2xl">
                <InvestmentHoldingCard
                  holdings={investmentAccount.holdings || []}
                  className="border-none shadow-none"
                />
              </HoverCardContent>
            </HoverCard>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
              <Badge className="py-3 font-bold text-white bg-black rounded-lg">
                {investmentAccount.holdings
                  ? investmentAccount.holdings.length
                  : 0}{" "}
                Holdings
              </Badge>
              <Badge className="flex flex-col items-start justify-start py-3 font-bold text-white bg-black border-gray-300 rounded-lg">
                <span>{investmentAccount.type} </span>
                <span
                  className="text-xs"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  account type
                </span>
              </Badge>
              <Badge className="flex flex-col items-start justify-start py-3 font-bold text-white bg-black border-gray-300 rounded-lg">
                <span>{investmentAccount.subtype} </span>
                <span
                  className="text-xs"
                  style={{
                    fontSize: "10px",
                  }}
                >
                  account sub type
                </span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue={
                historicalAccountBalance && historicalAccountBalance.length > 0
                  ? "accountBalance"
                  : "holdings"
              }
              className="w-fit"
            >
              <TabsList className="grid w-full grid-cols-2 font-bold">
                {historicalAccountBalance &&
                  historicalAccountBalance.length > 0 && (
                    <TabsTrigger value="accountBalance">
                      Account Balance
                    </TabsTrigger>
                  )}
                <TabsTrigger value="holdings">Holdings</TabsTrigger>
              </TabsList>
              {historicalAccountBalance &&
                historicalAccountBalance.length > 0 && (
                  <TabsContent value="accountBalance">
                    <HistoricalAccountBalanceChart
                      historicalAccountBalance={historicalAccountBalance}
                      disableLabel={true}
                      className="py-3"
                    />
                  </TabsContent>
                )}
              <TabsContent value="holdings" className="py-3">
                <InvestmentHoldingCard
                  holdings={investmentAccount.holdings ?? []}
                  historicalAccountBalance={historicalAccountBalance}
                />
              </TabsContent>
            </Tabs>

            <div className="flex flex-col gap-2">
              <div className="flex flex-row justify-between pt-3 md:pt-6">
                <p className="text-lg font-bold">Total Value</p>
                <p className="text-4xl font-bold">
                  $
                  {investmentAccount.currentFunds &&
                    investmentAccount.currentFunds.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <div className="px-3 pb-3">
              <HoverCard>
                <HoverCardTrigger>Hover To View Securities</HoverCardTrigger>
                <HoverCardContent className="w-fit rounded-2xl">
                  <div className="flex flex-col h-48 w-48 md:h-64 md:w-64 lg:h-96 lg:w-96 xl:h-[500px] xl:w-[500px] 2xl:h-[600px] 2xl:w-[600px] overflow-scroll gap-2">
                    <p className="flex items-center text-lg font-bold">
                      Account {investmentAccount.name} Currently Holds{" "}
                      {investmentAccount.securities
                        ? investmentAccount.securities.length
                        : 0}{" "}
                      Securities
                    </p>
                    {investmentAccount.securities &&
                      investmentAccount.securities.map(
                        (security: InvestmentSecurity | undefined, idx) => (
                          <InvestmentSecurityCard
                            security={security}
                            key={idx}
                          />
                        )
                      )}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </CardFooter>
        </Card>
      </InvestmentAccountCardContext.Provider>
    );
  }
}
