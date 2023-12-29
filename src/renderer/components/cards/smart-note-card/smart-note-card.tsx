import { SmartNote } from "@solomon-ai/component-library";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "src/components/ui/card";

export const SmartNoteCard: React.FC<{ note: SmartNote }> = ({ note }) => {
  return (
    <Card>
      <CardHeader className="grid grid-cols-[1fr_110px] items-start gap-4 space-y-0">
        <div className="space-y-1">{note.content || "No content provided"}</div>
        {/* Additional controls can go here */}
      </CardHeader>
      <CardFooter className="px-4">
        <p>Add {note.createdAt?.toLocaleLowerCase()}</p>
      </CardFooter>
    </Card>
  );
};
