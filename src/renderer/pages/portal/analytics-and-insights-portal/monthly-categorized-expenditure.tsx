import {
  CategoryMonthlyExpenditure,
  GetUserCategoryMonthlyExpenditureRequestClass,
} from "@solomon-ai/component-library";
import React, { useEffect, useState } from "react";
import { Pie, PieChart, ResponsiveContainer } from "recharts";
import { CardinalAreaChart } from "src/components/cards/category-monthly-income-card";
import { Spinner } from "src/components/spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { convertMonth } from "src/lib-utils/utils";
import { cn, convertToTitleCase } from "src/lib/utils";
import { useGetMonthlyCategoryExpenditureQuery } from "src/redux/queries/category/get-monthly-category-expenditure";
import {
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

/**
 * Component displaying monthly categorized income metrics.
 */
export const MonthlyCategorizedExpenditureMetricsView: React.FC<{
  enableAskSolomon?: boolean;
  enableTitle?: boolean;
  className?: string;
}> = ({ enableAskSolomon = true, enableTitle = true, className = "" }) => {
  const userId = useAppSelector(selectCurrentUserID);
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const linkedBankAccounts = financialProfile.link;
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(50);
  const [month, setMonth] = useState<number>(202307);
  const [categoryMonthlyExpenditure, setCategoryMonthlyExpenditures] = useState<
    CategoryMonthlyExpenditure[]
  >([]);

  const [spinner, setSpinner] = useState<React.ReactElement | null>(
    <Spinner className={"w-8 h-8 mt-3 ml-3"} />
  );

  // pull monthly income
  const req = new GetUserCategoryMonthlyExpenditureRequestClass({
    userId: Number(userId),
    pageNumber: pageNumber,
    pageSize: pageSize,
  });
  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetMonthlyCategoryExpenditureQuery(req);

  // pull monthly across categories

  const getMetric = () => {
    if (isSuccess && response.categoryMonthlyExpenditure) {
      setSpinner(null);

      // convert all negative values to positive
      const categoryMonthlyExpenditure =
        response.categoryMonthlyExpenditure.map(
          (categoryMonthlyExpenditure: CategoryMonthlyExpenditure) => {
            return {
              ...categoryMonthlyExpenditure,
              totalSpending: Math.abs(
                categoryMonthlyExpenditure.totalSpending || 0
              ),
            };
          }
        );

      setCategoryMonthlyExpenditures(categoryMonthlyExpenditure);
    } else if (isLoading) {
      setSpinner(<Spinner className={"w-8 h-8 mt-3 ml-3"} />);
    } else if (isError) {
      setSpinner(<div>{error.toString()}</div>);
    } else if (
      isSuccess &&
      (response.categoryMonthlyExpenditure?.length == 0 ||
        response.categoryMonthlyExpenditure == undefined)
    ) {
      setSpinner(
        <Card className="py-2">
          <CardHeader>
            <CardTitle>We are still pulling in your data!</CardTitle>
            <p>Sit tight and relax. We are still pulling in your data </p>
          </CardHeader>
        </Card>
      );
    }
  };

  const sumOfExpensesPerMonth = categoryMonthlyExpenditure
    .reduce(
      (acc, curr) => {
        const month = curr.month;
        const totalSpending = curr.totalSpending;

        // Find if an entry for the month already exists
        const existingMonth = acc.find(
          (entry) => entry.month === convertMonth(month!)
        );

        if (existingMonth) {
          // Update the income for the existing month
          existingMonth.totalSpending += totalSpending ?? 0;
        } else {
          // Create a new entry for the month
          acc.push({
            month: convertMonth(month!),
            totalSpending: totalSpending ?? 0,
          });
        }

        return acc;
      },
      [] as { month: string; totalSpending: number }[]
    )
    .reverse();

  const categoryTotals = categoryMonthlyExpenditure
    .reduce(
      (acc, curr) => {
        const category = curr.personalFinanceCategoryPrimary;
        const totalSpending = curr.totalSpending;

        // Find if an entry for the category already exists
        const existingCategory = acc.find(
          (entry) => entry.category === convertToTitleCase(category!)
        );

        if (existingCategory) {
          // Update the total income for the existing category
          existingCategory.totalSpending +=
            totalSpending !== undefined ? Number(totalSpending) : 0;
        } else {
          // Create a new entry for the category
          acc.push({
            category: convertToTitleCase(category!),
            totalSpending:
              totalSpending !== undefined ? Number(totalSpending) : 0,
          });
        }

        return acc;
      },
      [] as { category: string; totalSpending: number }[]
    )
    .reverse();

  useEffect(() => {
    getMetric();
  }, [isLoading, isError, response]);

  const sampleQuestions: string[] = [
    "What were my total expenditures last month",
    "What categories do my expenses fall into?",
    "Are there any unusual or unexpected expenditures on my account?",
    "How much am I spending on non-essentials?",
  ];

  const content = (
    <>
      {enableTitle && (
        <h2 className="ml-5 text-xl font-bold tracking-tight">
          Monthly Expenditures <span className="ml-1 text-xs"> </span>
        </h2>
      )}
      <div className="py-3 gap-2">
        <Tabs defaultValue="monthlyExpense" className="w-full">
          <TabsList className="flex flex-1 w-fit bg-black">
            <TabsTrigger value="monthlyExpense">Expenses Over Time</TabsTrigger>
            <TabsTrigger value="monthlyExpenseCategories">
              Expenses Across Categories
            </TabsTrigger>
          </TabsList>
          <TabsContent value="monthlyExpense">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle>Expenses Over Time</CardTitle>
                <CardDescription>
                  This graph describes your total expense over time.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardinalAreaChart
                  data={sumOfExpensesPerMonth}
                  xAxisDataKey="month"
                  yAxisDataKey="totalSpending"
                  title="Monthly Expenses Over Time"
                  className={cn(className)}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="monthlyExpenseCategories">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <CardTitle>Expenses Across Categories</CardTitle>
                <CardDescription>
                  This graph details the distribution of your expenses across
                  categories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CardinalAreaChart
                  data={categoryTotals}
                  xAxisDataKey="category"
                  yAxisDataKey="totalSpending"
                  title="Expensess Across Categories"
                  className={cn(className)}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );

  if (enableAskSolomon) {
    return (
      <AskMelodiyAILayout
        context={categoryMonthlyExpenditure}
        sampleQuestions={sampleQuestions}
      >
        {spinner}
        {content}
      </AskMelodiyAILayout>
    );
  }

  return (
    <div>
      {spinner}
      {content}
    </div>
  );
};
