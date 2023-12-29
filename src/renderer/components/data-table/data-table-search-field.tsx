import { Table } from "@tanstack/react-table";
import { Input } from "../ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { cn } from "src/lib/utils";
import { Label } from "../ui/label";
import { Cross2Icon } from "@radix-ui/react-icons";
import { Calendar } from "../ui/calendar";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "@heroicons/react/24/outline";
import { format } from "date-fns";

interface DataTableSearchProps<TData> {
  table: Table<TData>;
  className?: string;
}

export function DataTableSearchField<TData>({
  table,
  className,
}: DataTableSearchProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const [currentDate, setDate] = React.useState<Date | undefined>(undefined);

  const setSelectedDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (undefined !== selectedDate) {
      table
        .getColumn("authorizedDate")
        ?.setFilterValue(selectedDate.toDateString());
    }
  };

  return (
    <div className="flex flex-col gap-4 p-5">
      <div className="flex flex-col flex-1 gap-3">
        <Label>Merchant</Label>
        <Input
          placeholder="Filter..."
          value={
            (table.getColumn("merchantName")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("merchantName")?.setFilterValue(event.target.value)
          }
          className={cn("h-8 w-fit lg:w-[250px]", className)}
        />
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <Label>Payment Method</Label>
        <Input
          placeholder="Filter ..."
          value={
            (table.getColumn("paymentChannel")?.getFilterValue() as string) ??
            ""
          }
          onChange={(event) =>
            table
              .getColumn("paymentChannel")
              ?.setFilterValue(event.target.value)
          }
          className={cn("h-8 w-fit lg:w-[250px]", className)}
        />
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <Label>Primary Category</Label>
        <Input
          placeholder="Filter ..."
          value={
            (table
              .getColumn("personalFinanceCategoryPrimary")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("personalFinanceCategoryPrimary")
              ?.setFilterValue(event.target.value)
          }
          className={cn("h-8 w-fit lg:w-[250px]", className)}
        />
      </div>
      <div className="flex flex-col flex-1 gap-3">
        <Label>Secondary Category</Label>
        <Input
          placeholder="Filter ..."
          value={
            (table
              .getColumn("personalFinanceCategoryDetailed")
              ?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table
              .getColumn("personalFinanceCategoryDetailed")
              ?.setFilterValue(event.target.value)
          }
          className={cn("h-8 w-fit lg:w-[250px]", className)}
        />
      </div>
      <div>
        <Label>Authorized Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("h-8 w-fit lg:w-[250px]", className)}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {currentDate ? (
                format(currentDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}

export function CustomDataTableSearchField<TData>({
  table,
  className,
}: DataTableSearchProps<TData>) {
  const [merchantNameFilter, setMerchantNameFilter] = useState("");
  const [paymentChannelFilter, setPaymentChannelFilter] = useState("");
  const [primaryCategoryFilter, setPrimaryCategoryFilter] = useState("");
  const [secondaryCategoryFilter, setSecondaryCategoryFilter] = useState("");
  const [currentDate, setDate] = React.useState<Date | undefined>(undefined);

  const setSelectedDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    if (undefined !== selectedDate) {
      table
        .getColumn("authorizedDate")
        ?.setFilterValue(selectedDate.toDateString());
    }
  };

  const updateFilter = (columnId: string, value: string | undefined) => {
    table.getColumn(columnId)?.setFilterValue(value);
  };

  return (
    <div className="flex flex-row items-center justify-between w-full gap-4 p-5">
      {/* Merchant Name Filter */}
      <div className="flex flex-col flex-1 gap-3">
        <Label className="font-bold">Merchant</Label>
        <Input
          placeholder="Filter..."
          value={merchantNameFilter}
          onChange={(event) => {
            setMerchantNameFilter(event.target.value);
            updateFilter("merchantName", event.target.value);
          }}
          className={cn(
            "h-8 w-full lg:max-w-[250px] px-3 py-1 rounded-lg",
            className
          )}
        />
      </div>

      {/* Payment Channel Filter */}
      <div className="flex flex-col flex-1 gap-3">
        <Label className="font-bold">Payment Method</Label>
        <Input
          placeholder="Filter ..."
          value={paymentChannelFilter}
          onChange={(event) => {
            setPaymentChannelFilter(event.target.value);
            updateFilter("paymentChannel", event.target.value);
          }}
          className={cn(
            "h-8 w-full lg:max-w-[250px] px-3 py-1 rounded-lg",
            className
          )}
        />
      </div>

      {/* Primary Category Filter */}
      <div className="flex flex-col flex-1 gap-3">
        <Label className="font-bold">Primary Category</Label>
        <Input
          placeholder="Filter ..."
          value={primaryCategoryFilter}
          onChange={(event) => {
            setPrimaryCategoryFilter(event.target.value);
            updateFilter("personalFinanceCategoryPrimary", event.target.value);
          }}
          className={cn(
            "h-8 w-full lg:max-w-[250px] px-3 py-1 rounded-lg",
            className
          )}
        />
      </div>

      {/* Secondary Category Filter */}
      <div className="flex flex-col flex-1 gap-3">
        <Label className="font-bold">Secondary Category</Label>
        <Input
          placeholder="Filter ..."
          value={secondaryCategoryFilter}
          onChange={(event) => {
            setSecondaryCategoryFilter(event.target.value);
            updateFilter("personalFinanceCategoryDetailed", event.target.value);
          }}
          className={cn(
            "h-8 w-full lg:max-w-[250px] px-3 py-1 rounded-lg",
            className
          )}
        />
      </div>

      <div className="flex flex-col flex-1 gap-3">
        <Label className="font-bold">Authorized Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn("h-8 w-full lg:max-w-[250px] px-3 py-2 rounded-lg")}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {currentDate ? (
                format(currentDate, "PPP")
              ) : (
                <span>Pick a date</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={currentDate}
              onSelect={setSelectedDate}
              className="rounded-md"
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
