import {
  BellIcon,
  CalendarIcon,
  TagIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import {
  CounterClockwiseClockIcon,
  EyeNoneIcon,
  PersonIcon,
  TimerIcon,
} from "@radix-ui/react-icons";
import {
  PlaidAccountTransaction,
  TransactionSplit,
} from "@solomon-ai/component-library";
import { Avatar, AvatarFallback, AvatarImage } from "src/components/ui/avatar";
import { Button } from "src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "src/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "src/components/ui/select";
import { Separator } from "src/components/ui/separator";
import { Switch } from "src/components/ui/switch";
import { addDays, format } from "date-fns";
import { Calendar } from "src/components/ui/calendar";
import { DateRange } from "react-day-picker";
import React from "react";
import { cn, removeUnderScores } from "src/lib/utils";
import { Textarea } from "src/components/ui/textarea";
import { ScrollArea } from "src/components/ui/scroll-area";
import { Badge } from "src/components/ui/badge";
import { SmartNoteCard } from "../smart-note-card/smart-note-card";
import { AskMelodiyAILayout } from "src/layouts/ask-melodiy-ai-layout";

export function TransactionSplitDetails({
  split,
}: {
  split: TransactionSplit;
}) {
  return (
    <Card className="w-fit">
      <CardHeader className="pb-3">
        <CardTitle>Transaction Split Details</CardTitle>
        <CardDescription>{split.description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-1">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-1 p-2">
          <Card>
            <CardHeader>
              <CardTitle>
                <CardDescription>seocndary category</CardDescription>
                {removeUnderScores(split.personalFinanceCategoryDetailed ?? "")}
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>
                {" "}
                <CardDescription>primary category</CardDescription>
                {removeUnderScores(split.personalFinanceCategoryPrimary ?? "")}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
        {/* Displaying various details of the TransactionSplit */}
        <div className="space-y-2">
          <div className="-mx-2 shadow-sm border flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
            <WalletIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">Amount</p>
              <p className="text-sm text-muted-foreground">${split.amount}</p>
            </div>
          </div>
          <div className="-mx-2 shadow-sm border flex items-start space-x-4 rounded-md bg-accent p-2 text-accent-foreground transition-all">
            <TimerIcon className="mt-px h-5 w-5" />
            <div className="space-y-1">
              <p className="text-sm font-medium leading-none">
                Authorized Date
              </p>
              <p className="text-sm text-muted-foreground">
                ${split.authorizedDate}
              </p>
            </div>
          </div>
          <div>
            {split.tags && (
              <div>
                <CardContent className="grid gap-1">
                  <p className="text-sm text-black font-bold">Tags</p>
                  <div className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                    <BellIcon className="mt-px h-5 w-5" />
                    <div className="space-y-1 flex flex-row gap-1">
                      {split.tags &&
                        split.tags.map((tag, idx) => (
                          <Badge
                            className="text-sm font-medium leading-none text-black p-2"
                            key={idx}
                            variant={"outline"}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                  <p className="text-sm text-black font-bold">Categories</p>
                  <div className="flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                    <TagIcon className="mt-px h-5 w-5" />
                    <div className="space-y-1 flex flex-row gap-1">
                      {split.categories &&
                        split.categories.map((tag, idx) => (
                          <Badge
                            className="text-sm font-medium leading-none text-black p-2"
                            key={idx}
                            variant={"outline"}
                          >
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </CardContent>
              </div>
            )}
          </div>
          {/* ... more fields as needed */}
        </div>
      </CardContent>
    </Card>
  );
}

export const PlaidAccountTransactionCard: React.FC<{
  className?: string;
  transaction: PlaidAccountTransaction;
}> = ({ transaction }) => {
  const sampleQuestions: string[] = [
    "Can you provide information about the merchant or entity involved in this transaction?",
    "What are the categories associated with this transaction",
    "What is the reason for this payment?",
    "Tell me more",
  ];

  return (
    <AskMelodiyAILayout
      context={transaction}
      sampleQuestions={sampleQuestions}
      className="flex flex-col gap-4 shadow-none border-0"
    >
      <div className="flex flex-col gap-2">
        <div>
          <CardHeader>
            <CardTitle className="text-4xl">${transaction.amount}</CardTitle>
            <CardTitle>Transaction {transaction.transactionName} </CardTitle>
            <div className="flex flex-row gap-2">
              <CardDescription>{transaction.merchantName} </CardDescription>
              <CardDescription>{transaction.paymentChannel} </CardDescription>
              <CardDescription>{transaction.authorizedDate} </CardDescription>
            </div>

            <CardDescription>
              Anyone with access can view this transaction details.{" "}
            </CardDescription>
          </CardHeader>
        </div>
        {transaction.splits && transaction.splits.length > 0 && (
          <div>
            <CardTitle>Transaction Splits</CardTitle>
            <div className="grid grid-cols-2 gap-2">
              {transaction.splits.map((split, idx) => (
                <TransactionSplitDetails key={idx} split={split} />
              ))}
            </div>
          </div>
        )}

        {transaction.tags && transaction.tags.length > 0 && (
          <div>
            <CardHeader className="pb-3">
              <CardTitle>Details</CardTitle>
              <CardDescription>Transaction details</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-1">
              <CardDescription className="text-sm text-black font-bold">
                Tags
              </CardDescription>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <BellIcon className="mt-px h-5 w-5" />
                <div className="space-y-1 flex flex-row gap-1">
                  {transaction.tags &&
                    transaction.tags.map((tag, idx) => (
                      <Badge
                        className="text-sm font-medium leading-none text-black p-2"
                        key={idx}
                        variant={"outline"}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
              <CardDescription className="text-sm text-black font-bold">
                Categories
              </CardDescription>
              <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                <TagIcon className="mt-px h-5 w-5" />
                <div className="space-y-1 flex flex-row gap-1">
                  {transaction.categories &&
                    transaction.categories.map((tag, idx) => (
                      <Badge
                        className="text-sm font-medium leading-none text-black p-2"
                        key={idx}
                        variant={"outline"}
                      >
                        {tag}
                      </Badge>
                    ))}
                </div>
              </div>
            </CardContent>
          </div>
        )}
        <div>
          <CardHeader>
            <CardTitle>Transaction Fields</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="necessary" className="flex flex-col space-y-1">
                <span>Hide Transactions</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  Enable this option to conceal selected transactions from your
                  main transaction list. This feature is useful for decluttering
                  your view or keeping sensitive transactions private
                </span>
              </Label>
              <Switch
                id="necessary"
                defaultChecked={transaction.hideTransaction}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="functional" className="flex flex-col space-y-1">
                <span>Needs Review</span>
                <span className="font-normal leading-snug text-muted-foreground">
                  This label is assigned to transactions that require further
                  verification or clarification. Review these transactions to
                  ensure accuracy and completeness before they are fully
                  processed or recorded.
                </span>
              </Label>
              <Switch
                id="functional"
                defaultChecked={transaction.needsReview}
              />
            </div>
          </CardContent>
          <div className="flex h-full flex-col space-y-4">
            <CardHeader>
              <CardTitle>Add Note</CardTitle>
              <CardDescription>
                Notes enable you to add more details to specific transactions of
                interest
              </CardDescription>
              {transaction.notes && (
                <div className="flex flex-row gap-2">
                  {transaction.notes &&
                    transaction.notes.map((note, idx) => (
                      <SmartNoteCard key={idx} note={note} />
                    ))}
                </div>
              )}
              <Textarea
                placeholder="Add A Note To This Transaction"
                className="flex-1 min-h-[200px] md:max-h-[700px] lg:max-h-[700px]"
              />
            </CardHeader>
          </div>
        </div>
      </div>
    </AskMelodiyAILayout>
  );
};

export default function DatePickerWithRange({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2022, 0, 20),
    to: addDays(new Date(2022, 0, 20), 20),
  });

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
