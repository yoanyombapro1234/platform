import React from "react";
import { AggregatedStat } from "./aggregate-statistic-card";
import { Card } from "../ui/card";

export interface FinanceStatsCardProps {
  stats: AggregatedStat[];
}

/**
 * Display a list of financial stats.
 * @param props The stats to display.
 * @returns A component displaying the financial stats.
 */
const FinanceStatsCard: React.FC<FinanceStatsCardProps> = ({ stats }) => {
  const classNames = (...classes: string[]) => {
    return classes.filter(Boolean).join(" ");
  };

  return (
    <dl className="mx-auto grid grid-cols-1 gap-2 bg-black/5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card
          key={stat.name}
          className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 bg-white px-4 py-10 sm:px-6 xl:px-8"
        >
          <dt className="text-sm font-medium leading-6 text-gray-500">
            {stat.name}
          </dt>
          <dd
            className={classNames(
              stat.changeType === "decrease"
                ? "text-rose-600"
                : "text-gray-700",
              "text-xs font-medium",
            )}
          >
            {stat.change}
          </dd>
          <dd className="w-full flex-none text-3xl font-medium leading-10 tracking-tight text-gray-900">
            {stat.stat}
          </dd>
        </Card>
      ))}
    </dl>
  );
};

export default FinanceStatsCard;
