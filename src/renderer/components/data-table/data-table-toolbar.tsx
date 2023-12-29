import react from "react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";

import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { priorities, statuses } from "../data/data";
import { PlaidAccountTransaction } from "@solomon-ai/component-library";
import { BriefcaseIcon, WalletIcon } from "@heroicons/react/24/outline";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter transactions..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("personalFinanceCategoryPrimary") && (
          <DataTableFacetedFilter
            column={table.getColumn("personalFinanceCategoryPrimary")}
            title="Personal Finance Category"
            // TODO: need to ensure we pass this as a props
            options={statuses}
          />
        )}
        {table.getColumn("merchantName") && (
          <DataTableFacetedFilter
            column={table.getColumn("merchantName")}
            title="Merchant Name"
            // TODO: need to ensure we pass this as a props
            options={priorities}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}

export function PlaidAccountTransactionDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  function isPlaidAccountTransaction(
    data: any,
  ): data is PlaidAccountTransaction {
    // Perform checks for all properties expected in PlaidAccountTransaction
    return (
      data.hasOwnProperty("merchantName") &&
      typeof data.merchantName === "string" &&
      data.hasOwnProperty("personalFinanceCategoryPrimary") &&
      typeof data.personalFinanceCategoryPrimary === "string" &&
      data.hasOwnProperty("tags") &&
      typeof data.tags === "string"
    );
  }

  const tabledata = table.getAllColumns() as TData[];

  // extract all personal finance category properties
  const personalFinanceCategories = tabledata
    .map((data) => {
      if (
        isPlaidAccountTransaction(data) &&
        data.personalFinanceCategoryPrimary!.length > 0
      ) {
        return {
          label: data.personalFinanceCategoryPrimary ?? "",
          value: data.personalFinanceCategoryPrimary ?? "",
          icon: WalletIcon,
        };
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  // extract all merchant names
  const merchantNames = tabledata
    .map((data) => {
      if (isPlaidAccountTransaction(data) && data.merchantName!.length > 0) {
        return {
          label: data.merchantName ?? "",
          value: data.merchantName ?? "",
          icon: BriefcaseIcon,
        };
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  // extract all categories
  const tags = tabledata
    .map((data) => {
      if (isPlaidAccountTransaction(data) && data.tags!.length > 0) {
        return {
          label: data.tags?.toString() ?? "",
          value: data.tags?.toString() ?? "",
          icon: BriefcaseIcon,
        };
      }
    })
    .filter((item): item is NonNullable<typeof item> => item !== undefined);

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Filter transactions..."
          value={
            (table.getColumn("transactionName")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("transactionName")
              ?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("personalFinanceCategoryPrimary") && (
          <DataTableFacetedFilter
            column={table.getColumn("personalFinanceCategoryPrimary")}
            title="Personal Finance Category"
            // TODO: need to ensure we pass this as a props
            options={personalFinanceCategories}
          />
        )}
        {table.getColumn("merchantName") && (
          <DataTableFacetedFilter
            column={table.getColumn("merchantName")}
            title="Merchant Name"
            // TODO: need to ensure we pass this as a props
            options={merchantNames}
          />
        )}
        {table.getColumn("categories") && (
          <DataTableFacetedFilter
            column={table.getColumn("categories")}
            title="Categories"
            // TODO: need to ensure we pass this as a props
            options={tags}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  );
}
