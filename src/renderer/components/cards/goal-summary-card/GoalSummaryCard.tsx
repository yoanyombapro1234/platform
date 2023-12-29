// GoalSummaryCard.tsx
import React from "react";
import { SmartGoal } from "@solomon-ai/component-library";
import DonutStatistic from "../../cards/donut-statistic-card/DonutStatisticCard";

interface GoalSummaryCardProps {
  goal: SmartGoal;
  currentAmount: number;
  targetAmount: number;
}

/**
 * @description The GoalSummaryCard component presents a summarized view of a user's goal.
 * @param goal - The data of the goal to be displayed.
 * @returns JSX Element
 */
const GoalSummaryCard: React.FC<GoalSummaryCardProps> = ({
  goal,
  currentAmount,
  targetAmount,
}) => {
  return (
    <div className="w-full max-w-sm p-8 bg-white border rounded-md shadow-md">
      <div className="flex flex-row">
        <h2 className="mb-2 text-xl font-bold">{goal.name}</h2>
        <span className="p-1 ml-auto text-xs font-bold rounded-md">
          {goal.isCompleted ? "Completed" : "Active"}
        </span>
      </div>
      <p className="text-gray-600">{goal.description}</p>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <div className="mt-4">
            <span className="block font-bold text-black">Current Amount</span>
            <span className="text-gray">${goal.currentAmount}</span>
          </div>
          <div className="mt-2">
            <span className="block font-bold text-black">Target Amount</span>
            <span className="text-gray">${goal.targetAmount}</span>
          </div>
          <div className="mt-2">
            <span className="block font-bold text-black">End Date</span>
            <span className="text-gray">{goal.endDate}</span>
          </div>
        </div>
        <div className="p-5">
          <DonutStatistic
            percentage={(currentAmount / targetAmount) * 100}
            label="Progress"
          />
        </div>
      </div>

      {goal.isCompleted && (
        <span className="block mt-3 font-bold text-green-500">
          Goal Achieved! 🎉
        </span>
      )}
    </div>
  );
};

export default GoalSummaryCard;
