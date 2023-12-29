import React from "react";
import { createContext, ReactNode, RefObject, Component } from "react";
import {
  CaretSortIcon,
  ChevronDownIcon,
  DotsHorizontalIcon,
} from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn, formatDate, removeUnderScores } from "src/lib-utils/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { BankAccountHoverLabel, CreditAccountHoverLabel } from "../label";
import {
  BankAccount,
  CreditAccount,
  Transaction,
} from "@solomon-ai/component-library";
import { DataTableColumnHeader } from "./TransactionDataTableHeader";
import { Badge } from "../ui/badge";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
/** @type {React.Context<ransaction[]>} */
const TransactionDataTableContext = createContext<Transaction[]>([]);

export type TransactionDataTableProps = {
  transactions: Transaction[];
  className?: string;
  account?: BankAccount | CreditAccount;
};

export type TransactionDataTableState = {
  transactions: Transaction[];
};

/**
 * @class TransactionDataTable
 * @extends {Component<TransactionDataTableProps, TransactionDataTableState>}
 *
 * @description
 * This is a templated advanced React class component written in TypeScript
 * with TSDoc annotations. It has various features like context usage,
 * dynamic styles, generic props, and more.
 */
export class TransactionDataTable extends Component<
  TransactionDataTableProps,
  TransactionDataTableState
> {
  private myRef: RefObject<HTMLDivElement>;

  static defaultProps = {
    className: "",
  };

  constructor(props: TransactionDataTableProps) {
    super(props);
    this.state = {
      transactions: props.transactions,
    };

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

  /**
   * Renders the component.
   * @returns {ReactNode}
   */
  render(): ReactNode {
    const { className, account } = this.props;
    const { transactions } = this.state;

    return (
      <TransactionDataTableContext.Provider value={transactions}>
        <div className={cn("", className)}>
          <SimpleDataTable data={transactions} account={account} />
        </div>
      </TransactionDataTableContext.Provider>
    );
  }
}

export const columns: ColumnDef<Transaction>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Transaction Name" />
    ),
    cell: ({ row }) => <div className="lowercase">{row.getValue("name")}</div>,
  },
  {
    accessorKey: "merchantName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Merchant Name" />
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <Badge variant="outline">
            {" "}
            {removeUnderScores(row.getValue("personalFinanceCategoryPrimary"))}
          </Badge>
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("merchantName")}
          </span>
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));

      // Format the amount as a dollar amount
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium text-right">{formatted}</div>;
    },
  },
  {
    accessorKey: "authorizedDate",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Authorized Date" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-right">
          {formatDate(row.getValue("authorizedDate"))}
        </div>
      );
    },
  },
  {
    accessorKey: "paymentChannel",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Payment Channel" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-right">
          {row.getValue("paymentChannel")}
        </div>
      );
    },
  },
  {
    accessorKey: "personalFinanceCategoryPrimary",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Primary Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-right">
          {removeUnderScores(row.getValue("personalFinanceCategoryPrimary"))}
        </div>
      );
    },
  },
  {
    accessorKey: "personalFinanceCategoryDetailed",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Secondary Category" />
    ),
    cell: ({ row }) => {
      return (
        <div className="font-medium text-right">
          {removeUnderScores(row.getValue("personalFinanceCategoryDetailed"))}
        </div>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                payment.id && navigator.clipboard.writeText(payment.id)
              }
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

const SimpleDataTable: React.FC<{
  data: Transaction[];
  account?: BankAccount | CreditAccount;
}> = ({ data, account }) => {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  const isCreditAccount = (account: BankAccount | CreditAccount): boolean => {
    return (account as CreditAccount).aprs !== undefined;
  };

  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <Card className="w-full p-2 bg-white">
      <CardHeader>
        <CardTitle>
          <h2 className="flex text-2xl font-semibold">
            Transactions
            {account !== undefined && (
              <div className="flex flex-row">
                {!isCreditAccount(account) ? (
                  <BankAccountHoverLabel bankAccount={account as BankAccount} />
                ) : (
                  <CreditAccountHoverLabel
                    creditAccount={account as CreditAccount}
                  />
                )}
              </div>
            )}
          </h2>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter by merchant..."
            value={
              (table.getColumn("merchantName")?.getFilterValue() as string) ??
              ""
            }
            onChange={(event) =>
              table
                .getColumn("merchantName")
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDownIcon className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="border rounded-md">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end py-4 space-x-2">
          <div className="flex-1 text-sm text-muted-foreground">
            {table.getFilteredSelectedRowModel().rows.length} of{" "}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
