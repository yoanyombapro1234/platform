import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "src/lib/utils";

const BackButton: React.FC<{
  className?: string;
}> = ({ className }) => {
  const navigate = useNavigate();
  return (
    <Button
      className={cn("flex flex-row gap-1 my-3", className)}
      onClick={() => {
        navigate(-1);
      }}
    >
      <ArrowLeft className="inline-block w-5 h-5 mr-1" />
      <span className="font-bold cursor-pointer  hover:underline">Back</span>
    </Button>
  );
};

export { BackButton };
