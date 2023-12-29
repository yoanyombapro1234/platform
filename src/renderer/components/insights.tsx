import { cn, formatDate } from "src/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Label } from "./ui/label";
import { ScrollArea } from "./ui/scroll-area";
import { ActionableInsight } from "@solomon-ai/component-library";

interface ActionableInsightCardProps
  extends React.HTMLAttributes<HTMLDivElement> {
  insight: ActionableInsight;
}

export function ActionableInsightCard({
  insight,
  className,
  ...props
}: ActionableInsightCardProps) {
  return (
    <div className={cn("space-y-3", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex flex-1 gap-x-2">
            <CardTitle>Actionable Insight</CardTitle>
            <p></p>
          </div>

          <CardDescription>
            Generated as of {formatDate(insight.generatedTime!)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <ScrollArea className="h-[500px] px-1">
                  <Label htmlFor="framework">{insight.summarizedAction}</Label>
                </ScrollArea>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
