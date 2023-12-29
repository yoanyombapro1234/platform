import React from "react";
import { createContext, ReactNode, RefObject, Component } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "../../ui/card";
import { cn, formatDate } from "src/lib-utils/utils";
import { InvestmentSecurity } from "@solomon-ai/component-library";
import { InvestmentSecurityClass } from "@solomon-ai/component-library";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/** @type {React.Context<InvestmentSecurity>} */
const InvestmentSecurityCardContext = createContext<InvestmentSecurity>(
  new InvestmentSecurityClass({})
);

export type InvestmentSecurityCardProps = {
  security: InvestmentSecurity;
  className?: string;
};

export type InvestmentSecurityCardState = {
  security: InvestmentSecurity;
};

/**
 * @class InvestmentSecurityCard
 * @extends {Component<InvestmentSecurityCardProps, InvestmentSecurityCardState>}
 *
 * @description
 * This is a templated advanced React class component written in TypeScript
 * with TSDoc annotations. It has various features like context usage,
 * dynamic styles, generic props, and more.
 */
export class InvestmentSecurityCard extends Component<
  InvestmentSecurityCardProps,
  InvestmentSecurityCardState
> {
  private myRef: RefObject<HTMLDivElement>;

  static defaultProps = {
    security: new InvestmentSecurityClass({}),
  };

  constructor(props: InvestmentSecurityCardProps) {
    super(props);
    this.state = {
      security: props.security,
    };

    this.myRef = React.createRef();
  }

  /** Lifecycle method when the component is about to mount. */
  componentWillMount() {
    // Deprecated lifecycle, use with caution!
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
    const { className } = this.props;
    const { security } = this.state;

    return (
      <InvestmentSecurityCardContext.Provider value={security}>
        <Card
          className={cn(
            "flex flex-col justify-between border-t rounded-2xl",
            className
          )}
        >
          <CardHeader>
            <p className="font-bold text-md">
              {security.name}{" "}
              <span
                className="text-xs"
                style={{
                  fontSize: "8px",
                }}
              >
                {" "}
                ({security.tickerSymbol})
              </span>
            </p>
          </CardHeader>
          <CardContent className="grid grid-cols-1">
            <div className="font-bold text-md md:text-2xl lg:text-3xl">
              ${security.closePrice}
              <span
                className="p-1 ml-1 text-xs font-bold text-black"
                style={{
                  fontSize: "9px",
                }}
              >
                {" "}
                {security.type}
              </span>
            </div>
          </CardContent>
          <CardFooter className="flex flex-row justify-between gap-4">
            {/* <div className="flex justify-between flex-1"> */}
            <div className="flex flex-col">
              <p className="text-sm font-bold">Price As Of </p>
              <p className="text-xs font-base">
                {formatDate(security.closePriceAsOf)}{" "}
              </p>
            </div>
            <div>
              <p className="text-sm font-bold">
                {security.isCashEquivalent ? "cash equivalent" : ""}
              </p>
            </div>

            {/* </div> */}
          </CardFooter>
        </Card>
      </InvestmentSecurityCardContext.Provider>
    );
  }
}
