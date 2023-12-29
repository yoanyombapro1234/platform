import { ColumnDef, FilterFnOption } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./data-table-column-header";
import { DataTableRowActions } from "./data-table-row-actions";
import { Checkbox } from "../ui/checkbox";
import { Badge } from "../ui/badge";
import { labels, priorities, statuses } from "../data/data";
import { PlaidAccountTransaction } from "@solomon-ai/component-library";
import { removeUnderScores } from "src/lib-utils/utils";
import { DataTableFilter } from "./data-table-filters";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { CalendarDays } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { useState } from "react";
import PlaidTransactionSheet from "../sheet/plaid-account-transaction-sheet";
import TransactionSplitSheet from "../sheet/pladi-transaction-split-sheet";
import TransactionNotetSheet from "../sheet/plaid-transaction-notes.sheet";
import {
  ArrowLeftOnRectangleIcon,
  ArrowUpOnSquareIcon,
} from "@heroicons/react/24/outline";

export const columns: ColumnDef<PlaidAccountTransaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      const [enableViewTransaction, setEnableViewTransaction] = useState(false);

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <ArrowUpOnSquareIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}

            <DropdownMenuLabel className="flex items-center justify-center">
              Additional Actions
            </DropdownMenuLabel>
            {/* <DropdownMenuItem
              onClick={() =>
                payment.id && navigator.clipboard.writeText(payment.id)
              }
            >
              Copy Transaction ID
            </DropdownMenuItem> */}
            <DropdownMenuSeparator />
            <PlaidTransactionSheet
              transaction={row.original}
              onSave={function (transaction: PlaidAccountTransaction): void {
                throw new Error("Function not implemented.");
              }}
            />
            <TransactionNotetSheet transaction={row.original} />
            <TransactionSplitSheet transaction={row.original} />
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
  {
    accessorKey: "accountId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Account" />
    ),
    cell: ({ row }) => (
      <div className="w-[80px]">
        {(row.getValue("accountId") as String).slice(0, 8)}
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transactionName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("transactionName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "personalFinanceCategoryPrimary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {removeUnderScores(row.getValue("personalFinanceCategoryPrimary"))}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "personalFinanceCategoryDetailed",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Secondary Category" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate font-medium">
  //           {removeUnderScores(row.getValue("personalFinanceCategoryDetailed"))}
  //         </span>
  //       </div>
  //     );
  //   },
  // },

  {
    accessorKey: "authorizedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authorized" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {new Date(row.getValue("authorizedDate"))
              .toISOString()
              .slice(0, 10)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column, table }) => (
      // <DataTableColumnHeader column={column} title="Amount" />
      <div className="flex flex-row gap-2 justify-center items-center">
        <span>Amount</span>
        <DataTableFilter column={column} table={table} />
      </div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            ${Math.abs(Number(row.getValue("amount"))).toFixed(2)}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "locationCity",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="City" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("locationCity")}
          </span>
        </div>
      );
    },
  },
  // {
  //   accessorKey: "tags",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Tags" />
  //   ),
  //   cell: ({ row }) => {
  //     const tags = row.getValue("tags") as Array<string>;

  //     return (
  //       <GenericHoverCard
  //         triggerLabel={`${tags.length} tags`}
  //         title={`Transaction ${row.getValue("transactionName")} tags`}
  //         items={tags}
  //         avatarSrc="https://github.com/vercel.png" // URL to a relevant avatar image
  //         avatarFallbackText="TXN"
  //       />
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  {
    accessorKey: "categories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Categories" />
    ),
    cell: ({ row }) => {
      // only store max 3 categories
      const categories = row.getValue("categories") as Array<string>;

      return (
        <GenericHoverCard
          triggerLabel={`${categories.length} categories`}
          title={`Transaction ${row.getValue("transactionName")} Categories`}
          items={categories}
          avatarSrc="https://github.com/vercel.png" // URL to a relevant avatar image
          avatarFallbackText="TXN"
        />
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "merchantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("merchantName")}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];

interface GenericHoverCardProps {
  triggerLabel: string;
  title: string;
  items: string[];
  avatarSrc?: string;
  avatarFallbackText?: string;
}

export const GenericHoverCard: React.FC<GenericHoverCardProps> = ({
  triggerLabel,
  title,
  items,
  avatarSrc,
  avatarFallbackText = "Default",
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">{triggerLabel}</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src={avatarSrc || "default_avatar_url.png"} />
            <AvatarFallback>{avatarFallbackText}</AvatarFallback>
          </Avatar>
          <div className="border-l p-2 space-y-1 flex flex-col gap-2">
            <h4 className="text-xs font-semibold">{title}</h4>
            <div className="flex flex-wrap gap-2">
              {items.map((item, index) => (
                <Badge variant="outline" key={index}>
                  {item}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
};
