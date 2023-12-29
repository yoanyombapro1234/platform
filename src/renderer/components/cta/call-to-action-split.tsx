import React from "react";
import { Button } from "../ui/button";
import { cn } from "src/lib/utils";
import { Card } from "../ui/card";

export interface CallToActionSplitProps {
  backgroundColor?: "white" | "indigo-100";
  button1Title?: string;
  button1Handler?: () => void;
  button2Title?: string;
  button2Handlder?: () => void;
  title?: string;
}

export const CallToActionSplit: React.FC<CallToActionSplitProps> = ({
  backgroundColor = "white",
  button1Title = "Get Started",
  button1Handler = () => {},
  button2Title = "Learn more",
  button2Handlder = () => {},
  title = "Ready to dive in?",
}) => {
  const bgColorClass = backgroundColor === "white" ? "bg-white" : "bg-black";
  return (
    <Card className={bgColorClass}>
      <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {title}
        </h2>
        <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
          <Button
            onClick={button1Handler}
            className={cn(
              bgColorClass === "bg-black"
                ? " text-white bg-black"
                : "text-black bg-white",
              "text-sm font-semibold leading-6 border-4  border-white",
            )}
          >
            {button1Title}
          </Button>
          <Button
            onClick={button2Handlder}
            className={cn(
              bgColorClass === "bg-black"
                ? " text-white bg-black"
                : "text-black bg-white",
              "text-sm font-semibold leading-6 border-4  border-white",
            )}
          >
            {button2Title} <span aria-hidden="true">→</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};
