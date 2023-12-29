import * as React from "react";
import { createContext, ReactNode, RefObject, Component } from "react";

import { Card } from "src/components/ui/card";
import { Label } from "src/components/ui/label";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import {
  AccountBalanceHistory,
  IncomeMetrics,
  PlaidAccountTransaction,
  ExpenseMetricsClass,
  HistoricalAccountBalanceChart,
  BarGraph,
  TransactionDataTable,
  SimpleStatsCard,
} from "@solomon-ai/component-library";
import {
  cn,
  convertToMonthYear,
  convertToTitleCase,
  monthNumberToString,
} from "src/lib/utils";
import { MonthlyIncomeMetricsCard } from "../income/income-metrics-page";
import { DataTable } from "src/components/data-table/data-table";
import { columns } from "src/components/data-table/data-column";
import { CardinalAreaChart } from "src/components/cards/category-monthly-income-card";
import { IncomeCategoryDialog } from "src/components/category-expense-modal";

type SelectedDateRangeOfEvaluation = "30 Days" | "2 Weeks" | "1 Week";

// type SelectedDateRange = {
//   value: SelectedDateRangeOfEvaluation;
//   label: string;
// };

/** Context to provide a default value for the component. */
const IncomeViewContext = createContext<IncomeMetrics[] | undefined>(undefined);

export type IncomeViewProps<T extends IncomeMetrics[]> = {
  /** Primary data to be displayed or processed by the component. */
  data: T;

  /** Optional CSS classes for styling the component. */
  className?: string;

  enableDebugMode?: boolean;

  // historical account balance tied to the account of interest
  historicalAccountBalance: AccountBalanceHistory[];
  transactions: PlaidAccountTransaction[];
};

export type IncomeViewState<T extends IncomeMetrics[]> = {
  /** Counter to keep track of the number of button clicks. */
  data: T;
  historicalAccountBalance: AccountBalanceHistory[];
  selectedDateRangeOfEvaluation: SelectedDateRangeOfEvaluation;
};

/**
 * @class IncomeView
 * @extends {Component<IncomeViewProps, IncomeViewState>}
 *
 * @description
 * This is a templated advanced React class component written in TypeScript.
 * It demonstrates context usage, dynamic styles, generic props, and more.
 */
export class IncomeView<T extends IncomeMetrics[]> extends Component<
  IncomeViewProps<T>,
  IncomeViewState<T>
> {
  /** Reference to the main div element of the component. */
  private myRef: RefObject<HTMLDivElement>;

  static defaultProps = {};

  constructor(props: IncomeViewProps<T>) {
    super(props);
    this.state = {
      data: props.data,
      historicalAccountBalance: props.historicalAccountBalance.sort(
        (a, b) => new Date(a.time!).getTime() - new Date(b.time!).getTime()
      ),
      selectedDateRangeOfEvaluation: "30 Days",
    };

    this.convertToChartData = this.convertToChartData.bind(this);
    this.getNumberOfTransactionsPerCategory =
      this.getNumberOfTransactionsPerCategory.bind(this);
    this.aggregateTransactionsByMonthAndConvertToChartData =
      this.aggregateTransactionsByMonthAndConvertToChartData.bind(this);
    this.setSelectedDateRangeOfEvaluation =
      this.setSelectedDateRangeOfEvaluation.bind(this);
    this.getMetricsForMonth = this.getMetricsForMonth.bind(this);
    this.getTopCategories = this.getTopCategories.bind(this);
    this.getHistoricalAccountBalance =
      this.getHistoricalAccountBalance.bind(this);

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

  convertToChartData(data: AccountBalanceHistory) {
    return {
      // Assuming the 'time' property represents the X-axis unit.
      // Using the date as the name for simplicity. You might want to format it more appropriately.
      name: data.time ?? "Unknown Date",
      // Mapping 'balance' to the 'uv' metric.
      total: data.balance ?? 0,
      // Not sure which property from AccountBalanceHistory should map to 'pv', so leaving it out for now.
      // You can map another property if needed.
    };
  }

  // get the number of transaction per category
  // this function is used to get the data for the bar chart
  getNumberOfTransactionsPerCategory() {
    const { data } = this.state;

    if (data === undefined) {
      return [];
    }

    return data
      .map((expense) => {
        if (expense.personalFinanceCategoryPrimary === undefined) {
          return {
            name: "Unknown Category",
            value: Number(expense.transactionCount),
          };
        }

        return {
          name: expense.personalFinanceCategoryPrimary,
          value: Number(expense.transactionCount),
        };
      })
      .sort((a, b) => b.value - a.value);
  }

  // aggregate the transactions by month and convert them to a chart data format
  // this function is used to get the data for the line chart
  aggregateTransactionsByMonthAndConvertToChartData() {
    const { data } = this.state;

    if (data === undefined) {
      return [];
    }
    const aggregatedData: { [key: number]: number } = {};
    data.forEach((expense) => {
      if (expense.month !== undefined) {
        aggregatedData[expense.month] =
          (aggregatedData[expense.month] || 0) +
          Number(expense.transactionCount || 0);
      }
    });

    // Convert aggregated data to array
    const aggregatedMonthlyTxnCount = Object.entries(aggregatedData)
      .map(([month, total]) => ({
        month: Number(month),
        total,
      }))
      .sort((a, b) => a.month - b.month);

    // Convert the aggregatedMonthlyTxnCount to a chart data format
    return aggregatedMonthlyTxnCount.map((data) => {
      return {
        name: monthNumberToString(data.month) || "Unknown Month",
        total: data.total,
      };
    });
  }

  setSelectedDateRangeOfEvaluation(
    selectedDateRangeOfEvaluation: SelectedDateRangeOfEvaluation
  ) {
    this.setState({
      selectedDateRangeOfEvaluation:
        selectedDateRangeOfEvaluation as SelectedDateRangeOfEvaluation,
    });
  }

  // get all the expenses or income metrics for a given month
  // this function is used to get the data for the line chart
  getMetricsForMonth(month: number) {
    const { data } = this.state;

    if (data === undefined) {
      return [];
    }

    return data.filter((metric) => {
      return metric.month === month;
    });
  }

  getListByCategory(category: string): IncomeMetrics[] {
    const { data } = this.state;

    if (data === undefined) {
      return [];
    }
    // Filter the array by the given category
    const filteredByCategory = data.filter(
      (income) => income.personalFinanceCategoryPrimary === category
    );

    // Sort the filtered array by month
    const sortedByMonth = filteredByCategory.sort(
      (a, b) => (a.month ?? 0) - (b.month ?? 0)
    );

    return sortedByMonth;
  }

  getTopCategories() {
    const { data } = this.state;
    const { enableDebugMode } = this.props;

    if (enableDebugMode) {
      return [
        {
          name: "Food",
          transactionCount: 100,
        },
        {
          name: "Entertainment",
          transactionCount: 200,
        },
        {
          name: "Transportation",
          transactionCount: 300,
        },
        {
          name: "Education",
          transactionCount: 400,
        },
        {
          name: "Health",
          transactionCount: 500,
        },
      ];
    } else {
      if (data === undefined) {
        return [];
      }

      const categoryMap = new Map(); // Use a Map to track unique categories

      data.forEach((expense) => {
        const categoryName = expense.personalFinanceCategoryPrimary;
        const transactionCount = Number(expense.transactionCount);

        if (!categoryMap.has(categoryName)) {
          // If category is not in the Map, add it
          categoryMap.set(categoryName, {
            name: categoryName,
            transactionCount: transactionCount,
          });
        } else {
          // If category is in the Map, update the transactionCount
          const existingCategory = categoryMap.get(categoryName);
          existingCategory.transactionCount += transactionCount;
        }
      });

      // Convert the Map values back to an array and sort by transactionCount
      const uniqueCategories = Array.from(categoryMap.values()).sort(
        (a, b) => b.transactionCount - a.transactionCount
      );

      return uniqueCategories;
    }
  }

  getHistoricalAccountBalance() {
    // we get the range based on the selectedDateRangeOfEvaluation
    // we then filter the historicalAccountBalance based on the range
    // we then return the filtered historicalAccountBalance

    const { historicalAccountBalance } = this.state;
    const { selectedDateRangeOfEvaluation } = this.state;

    if (selectedDateRangeOfEvaluation === "30 Days") {
      // get only the last 30 days of historicalAccountBalance
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return historicalAccountBalance.filter((accountBalance) => {
        return (
          new Date(accountBalance.time!).getTime() >= thirtyDaysAgo.getTime()
        );
      });
    } else if (selectedDateRangeOfEvaluation === "2 Weeks") {
      // get only 14 days of histroical account balance
      const fourteenDaysAgo = new Date();
      fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
      return historicalAccountBalance.filter((accountBalance) => {
        return (
          new Date(accountBalance.time!).getTime() >= fourteenDaysAgo.getTime()
        );
      });
    } else {
      // get only 7 days of historical account balance
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      return historicalAccountBalance.filter((accountBalance) => {
        return (
          new Date(accountBalance.time!).getTime() >= sevenDaysAgo.getTime()
        );
      });
    }
  }

  /**
   * Renders the component.
   * @returns {ReactNode}
   */
  render(): ReactNode {
    const { className, transactions } = this.props;
    const { data } = this.state;

    if (data === undefined) {
      return <></>;
    }

    const topCategories = this.getTopCategories().splice(0, 10);

    {
      /** TODO: need to account for debug mode */
    }

    return (
      <IncomeViewContext.Provider value={data}>
        <div
          className={cn("flex flex-col gap-2 w-full p-8", className)}
          ref={this.myRef}
        >
          <Card className="flex flex-col gap-3 md:p-8 border-0 shadow-none">
            {/** list our the top 5 categories */}
            <div className="flex flex-row justify-between">
              <h2 className="text-xl font-semibold">
                Top 10 Categories Through Time
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {topCategories.map((category) => {
                if (category.name === undefined) {
                  return <></>;
                }

                return (
                  <Card
                    className="flex flex-col justify-between p-5"
                    key={category.name}
                  >
                    <div className="flex justify-between">
                      <div className="flex flex-col gap-1">
                        <p className="text-black font-bold">
                          {convertToTitleCase(category.name)}
                        </p>
                        <p className="text-gray-700">
                          {category.transactionCount} transactions
                        </p>
                      </div>

                      <IncomeCategoryDialog
                        data={this.getListByCategory(category.name)}
                        category={category.name}
                      />
                    </div>
                  </Card>
                );
              })}
            </div>
          </Card>

          <Card className="md:p-5">
            <IncomeAnalytics data={data as IncomeMetrics[]} category={""} />
          </Card>

          <div>
            <HistoricalAccountBalanceChart
              historicalAccountBalance={this.getHistoricalAccountBalance()}
            />
          </div>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex flex-col gap-2">
              <CardinalAreaChart
                data={this.aggregateTransactionsByMonthAndConvertToChartData()}
                xAxisDataKey="name"
                yAxisDataKey="total"
                title="Transactions Over Time"
                className={cn(className)}
              />
            </div>
          </div>
          <div>
            <DataTable columns={columns} data={transactions} />
          </div>
        </div>
      </IncomeViewContext.Provider>
    );
  }
}

export const IncomeAnalytics: React.FC<{
  data: IncomeMetrics[];
  category: string;
}> = ({ data, category }) => {
  const [totalYearlyExpense, setTotalYearlyExpense] = React.useState<number>(0);
  const [averageMonthlyExpense, setAverageMonthlyExpense] =
    React.useState<number>(0);
  const [highestExpenseCategory, setHighestExpenseCategory] =
    React.useState<string>("");
  const [monthWithHighestTransactions, setMonthWithHighestTransactions] =
    React.useState<number>(0);

  const [top3Categories, setTop3Categories] = React.useState<string[]>([]);
  const [averageTransactionAmount, setAverageTransactionAmount] =
    React.useState<number>(0);
  const [monthWithLowestExpenditure, setMonthWithLowestExpenditure] =
    React.useState<number>(0);
  const [expenditureVolatility, setExpenditureVolatility] =
    React.useState<number>(0);
  const [growthRateChartData, setGrowthRateChartData] = React.useState<
    {
      name: string;
      total: number;
    }[]
  >([]);

  React.useEffect(() => {
    // Compute metrics when data changes

    // 1. Total Yearly Expense
    const yearlyExpense = data.reduce(
      (sum, expense) => sum + (expense.totalIncome || 0),
      0
    );
    setTotalYearlyExpense(yearlyExpense);

    // 2. Average Monthly Expense
    setAverageMonthlyExpense(yearlyExpense / 12);

    // 3. Category with Highest Expenditure
    const categoryExpenses: { [key: string]: number } = {};
    data.forEach((expense) => {
      if (expense.personalFinanceCategoryPrimary) {
        categoryExpenses[expense.personalFinanceCategoryPrimary] =
          (categoryExpenses[expense.personalFinanceCategoryPrimary] || 0) +
          (expense.totalIncome || 0);
      }
    });
    const highestCategory = Object.keys(categoryExpenses).reduce(
      (a, b) => (categoryExpenses[a] > categoryExpenses[b] ? a : b),
      ""
    );
    setHighestExpenseCategory(highestCategory);

    // 4. Month with Highest Number of Transactions
    const transactionCounts: { [key: number]: number } = {};
    data.forEach((expense) => {
      if (expense.month !== undefined) {
        transactionCounts[expense.month] =
          (transactionCounts[expense.month] || 0) +
          Number(expense.transactionCount || "0");
      }
    });
    const highestTransactionsMonth = Object.keys(transactionCounts).reduce(
      (a, b) =>
        transactionCounts[Number(a)] > transactionCounts[Number(b)]
          ? Number(a)
          : Number(b),
      0
    );
    setMonthWithHighestTransactions(highestTransactionsMonth);

    // 1. Monthly Growth Rate
    const monthlyIncome: { [key: number]: number } = {};
    data.forEach((expense) => {
      if (expense.month !== undefined) {
        monthlyIncome[expense.month] =
          (monthlyIncome[expense.month] || 0) + (expense.totalIncome || 0);
      }
    });

    const monthlyGrowthRates: { [key: number]: number } = {};

    const months = Object.keys(monthlyIncome).sort();

    for (let i = 1; i < months.length; i++) {
      const currentMonth = parseInt(months[i]);
      const previousMonth = parseInt(months[i - 1]);

      const currentIncome = monthlyIncome[currentMonth];
      const previousIncome = monthlyIncome[previousMonth];

      const growthRate =
        ((currentIncome - previousIncome) / previousIncome) * 100;

      monthlyGrowthRates[currentMonth] = growthRate;
    }

    const chartData: {
      name: string;
      total: number;
    }[] = Object.entries(monthlyGrowthRates).map(([month, rate]) => {
      return {
        name: `${monthNumberToString(Number(month))} ${rate.toFixed(1)}%`,
        total: rate,
      };
    });

    setGrowthRateChartData(chartData);

    // 2. Top 3 Categories
    const categoryOfExpenses: { [key: string]: number } = {};
    data.forEach((expense) => {
      if (expense.personalFinanceCategoryPrimary) {
        categoryOfExpenses[expense.personalFinanceCategoryPrimary] =
          (categoryOfExpenses[expense.personalFinanceCategoryPrimary] || 0) +
          (expense.totalIncome || 0);
      }
    });
    const sortedCategories = Object.keys(categoryOfExpenses).sort(
      (a, b) => categoryOfExpenses[b] - categoryOfExpenses[a]
    );

    const topCategories = sortedCategories.map((category) =>
      convertToTitleCase(category)
    );

    setTop3Categories(topCategories.slice(0, 3));

    // 3. Average Transaction Amount
    const totalExpenses = data.reduce(
      (sum, expense) => sum + (expense.totalIncome || 0),
      0
    );
    const totalTransactions = data.reduce(
      (sum, expense) => sum + Number(expense.transactionCount || "0"),
      0
    );
    setAverageTransactionAmount(
      totalTransactions ? totalExpenses / totalTransactions : 0
    );

    // 4. Month with Lowest Expenditure
    const lowestExpenseMonth = Object.keys(monthlyIncome).reduce(
      (a, b) =>
        monthlyIncome[Number(a)] < monthlyIncome[Number(b)]
          ? Number(a)
          : Number(b),
      0
    );
    setMonthWithLowestExpenditure(lowestExpenseMonth);

    // 5. Expenditure Volatility (Standard Deviation)
    const monthlyExpenseValues = Object.values(monthlyIncome);
    const avgExpense =
      monthlyExpenseValues.reduce((a, b) => a + b, 0) /
      monthlyExpenseValues.length;
    const sqDifferences = monthlyExpenseValues.map((value) =>
      Math.pow(value - avgExpense, 2)
    );
    const avgSqDifference =
      sqDifferences.reduce((a, b) => a + b, 0) / sqDifferences.length;
    setExpenditureVolatility(Math.sqrt(avgSqDifference));
  }, [data]);

  return (
    <>
      <Tabs defaultValue="statistics" className="w-full">
        <TabsList className="bg-black">
          <TabsTrigger value="statistics">Statistics</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="drilldown">Drill Down</TabsTrigger>
        </TabsList>
        <TabsContent value="drilldown">
          <div>
            <MonthlyIncomeMetricsCard />
          </div>
        </TabsContent>
        <TabsContent value="statistics">
          <div className="flex flex-col gap-2 md:p-8">
            <Label className="text-xl font-bold">Statistics</Label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <SimpleStatsCard
                title={"Total Yearly Income"}
                metric={totalYearlyExpense.toFixed(2)}
                subtext="Total amount earned by the user in a year"
              />
              <SimpleStatsCard
                title={"Average Monthly Income"}
                metric={averageMonthlyExpense.toFixed(2)}
                subtext="Average Monthly Income for the given user"
              />
              <SimpleStatsCard
                title={"Highest Income Category"}
                metric={convertToTitleCase(highestExpenseCategory)}
                subtext="The category with the highest earning"
              />
              <SimpleStatsCard
                title={"Month with Highest Transactions"}
                metric={convertToMonthYear(
                  monthWithHighestTransactions.toString()
                )}
                subtext="The month with the highest number of transactions"
              />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="insights">
          <div className="flex flex-col gap-2 md:p-8">
            <Label className="text-xl font-bold">Statistics</Label>
            <BarGraph
              data={growthRateChartData}
              label="Monthly Income Growth Rate"
              className="w-full"
            />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <SimpleStatsCard
                title={"Top 3 Income Categories"}
                metric={top3Categories.join(", ")}
                subtext="Average Monthly Income for the given user"
              />
              <SimpleStatsCard
                title={"Average Transaction Amount"}
                metric={averageTransactionAmount.toFixed(2)}
                subtext="The category with the highest income"
              />
              <SimpleStatsCard
                title={"Month with Lowest Income"}
                metric={convertToMonthYear(
                  monthWithLowestExpenditure.toString()
                )}
                subtext="The month with the lowert income"
              />
              <SimpleStatsCard
                title={"Income Volatility"}
                metric={expenditureVolatility.toFixed(2)}
                subtext="rate of change of income"
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};
