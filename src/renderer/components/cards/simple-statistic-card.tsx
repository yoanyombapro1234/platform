import React from "react";
import { AggregatedStat } from "./aggregate-statistic-card";
import { Card } from "../ui/card";

export interface SimpletStatisticCardProps {
  stats: AggregatedStat[];
  title: string;
}

/**
 * Display a list of stats.
 * @param props The stats to display.
 * @returns A component displaying the stats.
 */
const SimpletStatisticCard: React.FC<SimpletStatisticCardProps> = ({
  stats,
  title,
}) => {
  return (
    <div className="p-5 w-full">
      <h3 className="text-base font-semibold leading-6 text-gray-900">
        {title}
      </h3>
      <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.name}
            className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6"
          >
            <dt className="truncate text-sm font-medium text-gray-500">
              {item.name}
            </dt>
            <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
              {item.stat}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
};

export default SimpletStatisticCard;
