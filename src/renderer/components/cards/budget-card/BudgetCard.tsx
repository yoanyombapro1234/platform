import React from "react";
import { Budget } from "@solomon-ai/component-library";
import { Label } from "../../ui/label";
import { ClipboardSignature } from "lucide-react";

/**
 * Props for the BudgetCard.
 */
interface BudgetProps {
  /**
   * Budget details to display.
   * This is an object containing the information for the budget.
   */
  budget: Budget;
}

/**
 * React component to display the details of a budget.
 *
 * This component will render the name, description, start and end dates of the budget,
 * along with the associated category and its subcategories.
 *
 * Usage:
 *
 * ```tsx
 * <BudgetCard budget={someBudgetObject} />
 * ```
 *
 * @param props The props containing the budget details.
 * @returns A React element displaying the budget details.
 */
const BudgetCard: React.FC<BudgetProps> = ({ budget }) => {
  return (
    <div className="p-8 space-y-2 border border-gray-300 rounded-3xl">
      <div className="flex flex-row justify-between">
        <h2 className="text-xl font-semibold">{budget.name}</h2>
        <ClipboardSignature className="w-5 h-5" />
      </div>
      <p className="text-gray-700">{budget.description}</p>
      <div className="flex flex-row justify-between gap-3">
        <p className="text-sm text-gray-500">Start Date: {budget.startDate}</p>
        <p className="text-sm text-gray-500">End Date: {budget.endDate}</p>
      </div>

      {budget.category && (
        <div className="pt-4 mt-2 space-y-1 border-gray-300">
          <p className="text-xs font-semibold">Category</p>
          <h3 className="text-lg font-bold">{budget.category.name}</h3>
          <p className="text-sm text-gray-700">{budget.category.description}</p>
          <ul className="flex flex-wrap gap-2">
            {budget.category.subcategories?.map((sub, index) => (
              <Label
                key={index}
                className="p-2 text-xs text-gray-700 border rounded-lg"
              >
                {sub}
              </Label>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default BudgetCard;
