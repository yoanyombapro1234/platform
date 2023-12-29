import {
  AlignEndHorizontalIcon,
  AlignEndVerticalIcon,
  AlignStartHorizontal,
  Aperture,
  ArrowUpNarrowWide,
  BadgeDollarSign,
  BatteryChargingIcon,
  CandlestickChart,
  Globe,
  PlusCircleIcon,
  StickyNote,
  Wallet,
} from "lucide-react";
import SidebarLayout from "../layout/sidebar-layout";
import { ChartBarIcon, PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { cn } from "src/lib/utils";
import { Badge } from "../ui/badge";
import { CreateGoalButton } from "../button/create-goal-button";
import { useAppSelector } from "../../redux/store/hooks";
import { selectCurrentUserAccount } from "src/redux/slice/authentication/AuthenticationSelector";
import { ProfileType } from "@solomon-ai/component-library";

export type SidebarOption =
  | "HOME"
  | "FINANCIAL_PORTAL"
  | "TRANSACTIONS"
  | "ACCOUNTING"
  | "COMPLIANCE"
  | "ANALYTICS"
  | "GOALS"
  | "SETTINTGS"
  | "AI"
  | "FORECASTING";

type SidebarOptionType = {
  type: SidebarOption;
  Icon:
    | typeof CandlestickChart
    | typeof BadgeDollarSign
    | typeof BatteryChargingIcon
    | typeof ArrowUpNarrowWide
    | typeof Globe
    | typeof Wallet
    | typeof ChartBarIcon
    | typeof AlignStartHorizontal;
  label: string;
  featureStage: "ALPHA" | "BETA" | "GA" | "PRIVATE BETA";
  onClick?: () => void;
};

const FinancialPortalSidebar: React.FC<{
  setSelectedOption?: (option: SidebarOption) => void;
  selectedOption?: SidebarOption;
  className: string;
}> = ({ setSelectedOption, selectedOption, className }) => {
  const currentAccount = useAppSelector(selectCurrentUserAccount);
  if (!setSelectedOption || !selectedOption) {
    return null;
  }

  const sidebarOptions: SidebarOptionType[] = getSidebarOptions(
    currentAccount.accountType!,
  );

  return (
    <SidebarLayout className={className} title="Solomon AI">
      {sidebarOptions.map(({ type, Icon, label, featureStage }) => (
        <Button
          key={type}
          variant="ghost"
          className={cn(
            "w-full justify-start",
            type === selectedOption && "bg-black text-white font-bold",
          )}
          onClick={() => setSelectedOption(type)}
        >
          <Icon className="w-4 h-4 mr-2" />
          <Label className="">{label}</Label>
          {featureStage !== "GA" && (
            <Badge
              className="px-2 ml-4 text-xs text-white bg-black rounded-full"
              style={{
                fontSize: "0.6rem",
              }}
            >
              {featureStage.toLocaleLowerCase()}
            </Badge>
          )}
        </Button>
      ))}
      <div className="">
        <div className="relative">
          <div
            className="absolute inset-0 flex items-center"
            aria-hidden="true"
          >
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 text-gray-500 bg-white">
              <CreateGoalButton className="px-2 text-xs text-black border-0" />
            </span>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
};

export { FinancialPortalSidebar };
function getSidebarOptions(profileType: ProfileType): SidebarOptionType[] {
  const sidebarCommonOptions: SidebarOptionType[] = [
    { type: "HOME", Icon: Globe, label: "Home", featureStage: "GA" },
    {
      type: "FINANCIAL_PORTAL",
      Icon: Wallet,
      label: "Financial Portal",
      featureStage: "GA",
    },
    {
      type: "ANALYTICS",
      Icon: AlignStartHorizontal,
      label: "Anlytics & Insights",
      featureStage: "GA",
    },
    {
      type: "TRANSACTIONS",
      Icon: ChartBarIcon,
      label: "Transaction & Trends",
      featureStage: "GA",
    },
    {
      type: "FORECASTING",
      Icon: BadgeDollarSign,
      label: "Forecasting",
      featureStage: "PRIVATE BETA",
    },
    {
      type: "GOALS",
      Icon: Aperture,
      label: "Smart Budgeting",
      featureStage: "PRIVATE BETA",
    },
  ];

  if (
    profileType === "PROFILE_TYPE_USER" ||
    profileType === "PROFILE_TYPE_UNSPECIFIED"
  ) {
    sidebarCommonOptions.push({
      type: "GOALS",
      Icon: StickyNote,
      label: "Notes",
      featureStage: "PRIVATE BETA",
    });

    sidebarCommonOptions.push({
      type: "GOALS",
      Icon: AlignEndHorizontalIcon,
      label: "Actionable Insights",
      featureStage: "PRIVATE BETA",
    });

    sidebarCommonOptions.push({
      type: "GOALS",
      Icon: AlignEndVerticalIcon,
      label: "Financial Milestones",
      featureStage: "PRIVATE BETA",
    });
  } else if (profileType === "PROFILE_TYPE_BUSINESS") {
    sidebarCommonOptions.push({
      type: "ACCOUNTING",
      Icon: CandlestickChart,
      label: "Core Accounting",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "COMPLIANCE",
      Icon: BadgeDollarSign,
      label: "Compliance",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "GOALS",
      Icon: PlusCircleIcon,
      label: "Goals",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "ACCOUNTING",
      Icon: PlusCircleIcon,
      label: "Ledger Management & Analysis",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "ACCOUNTING",
      Icon: PlusCircleIcon,
      label: "Invoice & Expense Tracking",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "AI",
      Icon: PlusCircleIcon,
      label: "Anomaly Detection",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "AI",
      Icon: PlusCircleIcon,
      label: "Cash Flow Optimization",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "AI",
      Icon: PlusCircleIcon,
      label: "Business Stress Testing",
      featureStage: "BETA",
    });

    sidebarCommonOptions.push({
      type: "AI",
      Icon: PlusCircleIcon,
      label: "Impact Assessment",
      featureStage: "GA",
    });
  }

  return sidebarCommonOptions;
}
