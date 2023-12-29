import { useEffect, useState } from "react";
import { useGetIncomeMetricsQuery } from "src/redux/queries/income/get-income-metrics";
import { selectCurrentUserID } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

import { Spinner } from "../spinner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  CardinalAreaChart,
  CardinalPieChart,
} from "../cards/category-monthly-income-card";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  GetIncomeMetricsRequestClass,
  IncomeMetrics,
} from "@solomon-ai/component-library";
import { cn, convertToMonth, convertToTitleCase } from "src/lib/utils";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { convertMonth } from "src/lib-utils/utils";

// Monthly Transactions
function totalTransactionsPerMonthHelper(
  data: Array<any>,
  month: number
): number {
  return data
    .filter((d) => d.month === month)
    .reduce((acc, curr) => acc + curr.transactionCount, 0);
}

// Income Analysis
function totalIncomePerMonth(data: Array<any>, month: number): number {
  return data
    .filter((d) => d.month === month)
    .reduce((acc, curr) => acc + curr.totalIncome, 0);
}

// Finance Category Analysis
function transactionsPerCategory(data: Array<any>, category: string): number {
  return data
    .filter((d) => d.personalFinanceCategoryPrimary === category)
    .reduce((acc, curr) => acc + curr.transactionCount, 0);
}

// User Behavior
function transactionsPerUser(data: Array<any>, userId: number): number {
  return data
    .filter((d) => d.userId === userId)
    .reduce((acc, curr) => acc + curr.transactionCount, 0);
}

function incomePerUser(data: Array<any>, userId: number): number {
  return data
    .filter((d) => d.userId === userId)
    .reduce((acc, curr) => acc + curr.totalIncome, 0);
}

// Top Personal Finance Categories
function topCategories(data: Array<any>): any {
  const categoriesCount: { [key: string]: number } = {};

  data.forEach((d) => {
    if (!categoriesCount[d.personalFinanceCategoryPrimary]) {
      categoriesCount[d.personalFinanceCategoryPrimary] = 0;
    }
    categoriesCount[d.personalFinanceCategoryPrimary] += d.transactionCount;
  });

  let maxCount = 0;
  let maxCategory = "";
  for (const category in categoriesCount) {
    if (categoriesCount[category] > maxCount) {
      maxCount = categoriesCount[category];
      maxCategory = category;
    }
  }

  return { category: maxCategory, count: maxCount };
}

// Pearson's correlation coefficient as the measure of correlation. This value lies
// between -1 and 1, where a value close to 1 indicates a strong positive correlation,
// a value close to -1 indicates a strong negative correlation, and a value close to
// 0 indicates no correlation.
function calculateCorrelation(data: Array<any>): number {
  let months = Array.from(new Set(data.map((d) => d.month))).sort();

  let totalIncomesPerMonth: number[] = months.map((month) =>
    totalIncomePerMonth(data, month)
  );
  let totalTransactionsPerMonth: number[] = months.map((month) =>
    totalTransactionsPerMonthHelper(data, month)
  );

  let meanIncome =
    totalIncomesPerMonth.reduce((a, b) => a + b, 0) /
    totalIncomesPerMonth.length;
  let meanTransactions =
    totalTransactionsPerMonth.reduce((a, b) => a + b, 0) /
    totalTransactionsPerMonth.length;

  let deviationsIncome = totalIncomesPerMonth.map(
    (income) => income - meanIncome
  );
  let deviationsTransactions = totalTransactionsPerMonth.map(
    (transactions) => transactions - meanTransactions
  );

  let numerator = deviationsIncome
    .map((deviation, index) => deviation * deviationsTransactions[index])
    .reduce((a, b) => a + b, 0);

  let denominator =
    Math.sqrt(
      deviationsIncome
        .map((deviation) => deviation ** 2)
        .reduce((a, b) => a + b, 0)
    ) *
    Math.sqrt(
      deviationsTransactions
        .map((deviation) => deviation ** 2)
        .reduce((a, b) => a + b, 0)
    );

  return numerator / denominator;
}

const IncomeMetricsPane: React.FC<{
  enableIncomeOvertime?: boolean;
  enableTransactionVsIncome?: boolean;
  className?: string;
  enableAskSolomon?: boolean;
}> = ({
  enableIncomeOvertime = true,
  enableTransactionVsIncome = true,
  className,
  enableAskSolomon = true,
}) => {
  const currentUserId = useAppSelector(selectCurrentUserID);
  const [incomeMetrics, setIncomeMetrics] = useState<IncomeMetrics[]>([]);
  const [pageSize, setPageSize] = useState<number>(50);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const request = new GetIncomeMetricsRequestClass({
    userId: Number(currentUserId),
    pageNumber: pageNumber,
    pageSize: pageSize,
  });

  const {
    data: response,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetIncomeMetricsQuery(request);

  useEffect(() => {
    if (isSuccess && response.incomeMetrics) {
      setIncomeMetrics(response.incomeMetrics);
    }
  }, [isSuccess, response]);

  let spinner = <Spinner className={"w-8 h-8 mt-3 ml-3"} />;

  if (isSuccess && response.incomeMetrics) {
    spinner = <></>;
  } else if (isError) {
    spinner = <div>{error.toString()}</div>;
  } else if (
    isSuccess &&
    (response.incomeMetrics?.length == 0 || response.incomeMetrics == undefined)
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

  // from the income metrics compute the sum of income per month and it should be an array of object
  // with each object being a motnh and income
  const sumOfIncomePerMonth = incomeMetrics
    .reduce(
      (acc, curr) => {
        const month = curr.month;
        const income = curr.totalIncome;

        // Find if an entry for the month already exists
        const existingMonth = acc.find(
          (entry) => entry.month === convertMonth(month!)
        );

        if (existingMonth) {
          // Update the income for the existing month
          existingMonth.income += income ?? 0;
        } else {
          // Create a new entry for the month
          acc.push({ month: convertMonth(month!), income: income ?? 0 });
        }

        return acc;
      },
      [] as { month: string; income: number }[]
    )
    .reverse();

  const sumOfTransactionCountPerMonth = incomeMetrics
    .reduce(
      (acc, curr) => {
        const month = curr.month;
        const transactionCount = curr.transactionCount;

        // Find if an entry for the month already exists
        const existingMonth = acc.find(
          (entry) => entry.month === convertMonth(month!)
        );

        if (existingMonth) {
          // Update the transaction count for the existing month
          existingMonth.transactionCount +=
            transactionCount !== undefined ? Number(transactionCount) : 0;
        } else {
          // Create a new entry for the month
          acc.push({
            month: convertMonth(month!),
            transactionCount:
              transactionCount !== undefined ? Number(transactionCount) : 0,
          });
        }

        return acc;
      },
      [] as { month: string; transactionCount: number }[]
    )
    .reverse();

  const sumOfTransactionCountByCategory = incomeMetrics
    .reduce(
      (acc, curr) => {
        const category = curr.personalFinanceCategoryPrimary;
        const transactionCount = curr.transactionCount;

        // Find if an entry for the category already exists
        const existingCategory = acc.find(
          (entry) => entry.category === convertToTitleCase(category!)
        );

        if (existingCategory) {
          // Update the transaction count for the existing category
          existingCategory.transactionCount +=
            transactionCount !== undefined ? Number(transactionCount) : 0;
        } else {
          // Create a new entry for the category
          acc.push({
            category: convertToTitleCase(category!),
            transactionCount:
              transactionCount !== undefined ? Number(transactionCount) : 0,
          });
        }

        return acc;
      },
      [] as { category: string; transactionCount: number }[]
    )
    .reverse();

  const categoryTotals = incomeMetrics
    .reduce(
      (acc, curr) => {
        const category = curr.personalFinanceCategoryPrimary;
        const totalIncome = curr.totalIncome;

        // Find if an entry for the category already exists
        const existingCategory = acc.find(
          (entry) => entry.category === convertToTitleCase(category!)
        );

        if (existingCategory) {
          // Update the total income for the existing category
          existingCategory.totalIncome +=
            totalIncome !== undefined ? Number(totalIncome) : 0;
        } else {
          // Create a new entry for the category
          acc.push({
            category: convertToTitleCase(category!),
            totalIncome: totalIncome !== undefined ? Number(totalIncome) : 0,
          });
        }

        return acc;
      },
      [] as { category: string; totalIncome: number }[]
    )
    .reverse();

  const metrics = incomeMetrics.map((metric) => {
    return {
      month: metric.month,
      transactionCount: metric.transactionCount,
      totalIncome: metric.totalIncome,
      personalFinanceCategoryPrimary: convertToTitleCase(
        metric.personalFinanceCategoryPrimary!
      ),
      userId: metric.userId,
    };
  });

  const sampleQuestions: string[] = [
    "What was my total income last month",
    "How am l making most of my money?",
  ];

  const content = (
    <>
      {enableIncomeOvertime && (
        <div>
          <div className="py-3 gap-2">
            <Tabs defaultValue="monthlyIncome" className="w-full">
              <TabsList className="grid w-fit grid-cols-4 bg-black">
                <TabsTrigger value="monthlyIncome">
                  Income Over Time
                </TabsTrigger>
                <TabsTrigger value="monthlyIncomeCategories">
                  Income Across Categories
                </TabsTrigger>
                <TabsTrigger value="monthlyIncomeTransactions">
                  Transactions Over Time
                </TabsTrigger>
                <TabsTrigger value="transactionsAcrossCategories">
                  Transactions Across Categories
                </TabsTrigger>
              </TabsList>
              <TabsContent value="monthlyIncome">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Income Over Time</CardTitle>
                    <CardDescription>
                      This graph describes your total income over time.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardinalAreaChart
                      data={sumOfIncomePerMonth}
                      xAxisDataKey="month"
                      yAxisDataKey="income"
                      title="Monthly Income Over Time"
                      className={cn(className)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="monthlyIncomeCategories">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Income Across Categories</CardTitle>
                    <CardDescription>
                      This graph details the distribution of your income across
                      categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardinalAreaChart
                      data={categoryTotals}
                      xAxisDataKey="category"
                      yAxisDataKey="totalIncome"
                      title="Income Across Categories"
                      className={cn(className)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="monthlyIncomeTransactions">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle> Transactions Over Time</CardTitle>
                    <CardDescription>
                      This graph details the distribution of your transactions
                      over time
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardinalAreaChart
                      data={sumOfTransactionCountPerMonth}
                      xAxisDataKey="month"
                      yAxisDataKey="transactionCount"
                      title="Transaction Count Over Time"
                      className={cn(className)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="transactionsAcrossCategories">
                <Card className="border-0 shadow-none">
                  <CardHeader>
                    <CardTitle>Transactions By Categories</CardTitle>
                    <CardDescription>
                      This graph partitions your transactions across categories
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <CardinalAreaChart
                      data={sumOfTransactionCountByCategory}
                      xAxisDataKey="category"
                      yAxisDataKey="transactionCount"
                      title="Transaction Count By Category"
                      className={cn(className)}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      )}

      {enableTransactionVsIncome && (
        <Card className={cn("p-5", className)}>
          <CardHeader>
            <CardTitle>
              Transaction Count vs Total Monthly Income Over Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <AreaChart
                className="w-full"
                data={incomeMetrics}
                margin={{
                  top: 20,
                  right: 20,
                  bottom: 20,
                  left: 20,
                }}
              >
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="transactionCount"
                  stroke="#000000"
                  fillOpacity={1}
                  fill="url(#colorUv)"
                />
                <Area
                  type="monotone"
                  dataKey="totalIncome"
                  stroke="#000000"
                  fillOpacity={1}
                  fill="url(#colorPv)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </>
  );

  if (enableAskSolomon) {
    return (
      <AskMelodiyAILayout context={metrics} sampleQuestions={sampleQuestions}>
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

export { IncomeMetricsPane };
