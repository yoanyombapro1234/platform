import * as React from "react";

import { ExpenseMetrics, IncomeMetrics } from "@solomon-ai/component-library";
import { convertToTitleCase } from "src/lib/utils";
import { Button } from "src/components/ui/button";
import { BarChart2Icon } from "lucide-react";
import { ExpenseAnalytics } from "src/pages/portal/analytics-and-insights-portal/expense-portal-view";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { ScrollArea } from "./ui/scroll-area";
import { CardinalAreaChart } from "./cards/category-monthly-income-card";
import { Badge } from "./ui/badge";
import { ChartBarIcon } from "@heroicons/react/24/outline";
import { IncomeAnalytics } from "src/pages/portal/analytics-and-insights-portal/income-portal-view";

export const ExpenseCategoryDialog: React.FC<{
  data: ExpenseMetrics[];
  category: string;
}> = ({ data, category }) => {
  // convert all expenses to postivie amounts
  let transformedData: ExpenseMetrics[] = [];
  data.forEach((d) => {
    transformedData.push({
      ...d,
      totalExpenses:
        d.totalExpenses !== undefined
          ? Math.abs(d.totalExpenses)
          : d.totalExpenses,
    });
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div>
          <Badge variant={"outline"}>
            <ChartBarIcon className="w-5 h-5 mr-2" />
            <p className="m-1">More</p>
          </Badge>
        </div>
      </SheetTrigger>
      <SheetContent className="md:min-w-[80%] overflow-y-scroll">
        <ScrollArea>
          <div className="flex flex-col gap-4">
            <SheetHeader className="w-full flex flex-col gap-2">
              <SheetTitle>
                Spending Across {convertToTitleCase(category)} Over Time
              </SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <div className="w-full">
              <ExpenseAnalytics data={transformedData as ExpenseMetrics[]} />
              <div>
                <CardinalAreaChart
                  data={transformedData}
                  xAxisDataKey="month"
                  yAxisDataKey="totalExpenses"
                  title={`Expenses across ${convertToTitleCase(
                    category
                  )} over time`}
                  className="px-[4%] border-2 border-gray-100 rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export const IncomeCategoryDialog: React.FC<{
  data: IncomeMetrics[];
  category: string;
}> = ({ data, category }) => {
  // convert all expenses to postivie amounts
  let transformedData: IncomeMetrics[] = [];
  data.forEach((d) => {
    transformedData.push({
      ...d,
      totalIncome:
        d.totalIncome !== undefined ? Math.abs(d.totalIncome) : d.totalIncome,
    });
  });
  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="w-fit">
          <Button variant={"outline"}>
            <ChartBarIcon className="w-5 h-5 mr-2" />
            <p>More</p>
          </Button>
        </div>
      </SheetTrigger>
      <SheetContent className="md:min-w-[80%] overflow-y-scroll">
        <ScrollArea>
          <div className="flex flex-col gap-4">
            <SheetHeader className="w-full flex flex-col gap-2">
              <SheetTitle>
                Spending Across {convertToTitleCase(category)} Over Time
              </SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <div className="w-full">
              <IncomeAnalytics
                data={transformedData as IncomeMetrics[]}
                category={category}
              />
              <div className="pt-[2%]">
                <CardinalAreaChart
                  data={transformedData}
                  xAxisDataKey="month"
                  yAxisDataKey="totalIncome"
                  title={`Revenue across ${convertToTitleCase(
                    category
                  )} over time`}
                  className="px-[4%] border-2 border-gray-100 rounded-2xl shadow-md"
                />
              </div>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};
