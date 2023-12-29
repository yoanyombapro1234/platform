import { cn } from "src/lib/utils";
import logoImage from "src/images/icon.png";
import { Badge } from "./ui/badge";
import { constants } from "src/constant/constants";

export const Logo: React.FC<{
  className?: string;
}> = ({ className }) => {
  return (
    <div>
      <LogoTextComponent
        text="Solomon AI"
        className={cn(
          "ml-1 font-display text-xl font-bold tracking-tight text-neutral-950",
          className
        )}
      />
    </div>
  );
};

export function Logomark(props: any) {
  return (
    <img
      src={logoImage}
      alt="Solomon AI"
      {...props}
      className="rounded-2xl p-1.5"
    />
  );
}

const LogoTextComponent = ({ text, className }: any) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Logomark width="60" height="60" className="fill-blue-600 " />
      <p className={className}>{text}</p>
      {constants.BETA_MODE && <Badge className="ml-2">Beta Mode</Badge>}
    </div>
  );
};

export function PhoneLogo() {
  return (
    <LogoTextComponent
      logo="/src/images/icon.png"
      text="Solomon AI"
      textClass="font-bold text-lg ml-4 text-white"
    />
  );
}
