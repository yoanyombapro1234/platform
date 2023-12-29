import React, { useState } from "react";
import {
  ChevronsUpDown,
  Wallet2Icon,
  WalletCardsIcon,
  PlusIcon,
} from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { ConnectPlaidAccountButtonMemoized } from "../button/connect-plaid-account-button-v2";

interface ConnectNewIntegrationProps {
  username: string;
}

const IntegrationHeader: React.FC = () => {
  return (
    <div className="flex items-center px-4">
      <h4 className="text-lg font-semibold">Data Integrations</h4>
      <Badge className="ml-2 py-1" variant={"default"}>
        Beta Mode
      </Badge>
      <CollapsibleTrigger asChild>
        <Button variant="ghost" size="sm" className="w-9 p-0">
          <ChevronsUpDown className="h-4 w-4 border-0" />
          <span className="sr-only">Toggle</span>
        </Button>
      </CollapsibleTrigger>
    </div>
  );
};

const IntegrationCardContent: React.FC = () => {
  return (
    <CardContent className="md:flex md:flex-col md:m-[4%] md:pt-[10%] md:items-center md:justify-center">
      <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl">
        Effortless Financial Management
      </h1>
      <p className="leading-7 [&:not(:first-child)]:mt-6">
        Seamlessly Integrate Any Supported Financial Integration For Effortless
        And Automated Financial Management
      </p>
    </CardContent>
  );
};

const IntegrationCard: React.FC = () => {
  return (
    <Card>
      <IntegrationCardContent />
    </Card>
  );
};

const ConnectIntegrationButton: React.FC = () => {
  return (
    <div className="flex flex-row gap-2 pt-[2%] max-w-[90%]">
      <Button
        variant={"outline"}
        className="text-md rounded-2xl flex flex-1 gap-1"
      >
        <PlusIcon className="w-5 h-5 font-base text-black m-1" />
        <p className="text-md text-dark font-bold pt-1"> Accounting </p>
      </Button>
      <ConnectPlaidAccountButtonMemoized>
        <PlusIcon className="w-5 h-5 font-base text-black m-1" />
        <p className="text-md text-dark font-bold pt-1"> Banking </p>
      </ConnectPlaidAccountButtonMemoized>
    </div>
  );
};

const SupportedIntegrations: React.FC = () => {
  const supportedIntegrations = [
    "ClearBooks",
    "QuickBooks",
    "Sage",
    "Xero",
    "Zoho",
    "FreeAgent",
    "Dynamics365 Business Central",
    "Moneybird",
    "Oracle Netsuite",
    "Sage Intacct",
    "Wave",
    "Workday",
    "Xero",
  ];

  const supportedBankingIntegrations: string[] = [
    "JP Morgan Chase",
    "Bank Of America",
    "Wells Fargo",
    "US Bank",
    "PNC Bank",
    "And More...",
  ];

  return (
    <div>
      <p className="font-bold text-xl p-[4%]">Supported Integrations</p>
      <Tabs defaultValue="accounting" className="flex flex-col gap-3">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="accounting">
            <WalletCardsIcon className="w-5 h-5 font-base text-black m-1" />
            <p className="text-md text-dark font-semibold pt-1">
              {" "}
              Accounting Integrations{" "}
            </p>
          </TabsTrigger>
          <TabsTrigger value="banking">
            <Wallet2Icon className="w-5 h-5 font-base text-black m-1" />
            <p className="text-md text-dark font-semibold pt-1">
              {" "}
              Banking Integrations{" "}
            </p>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="banking" className="border rounded-2xl p-[3%]">
          <div className="flex flex-wrap gap-2">
            {supportedBankingIntegrations.map((item, idx) => (
              <Badge key={idx} variant={"outline"} className="p-2">
                <p className="text-sm text-dark font-bold"> {item} </p>
              </Badge>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="accounting" className="border rounded-2xl p-[3%]">
          <div className="flex flex-wrap gap-2">
            {supportedIntegrations.map((item, idx) => (
              <Badge key={idx} variant={"outline"} className="p-2">
                <p className="text-sm text-dark font-bold"> {item} </p>
              </Badge>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

const ConnectNewIntegration: React.FC<ConnectNewIntegrationProps> = ({
  username,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="w-fit space-y-2"
    >
      <IntegrationHeader />
      <CollapsibleContent className="space-y-2 grid grid-cols-4 gap-2">
        <IntegrationCard />
        <Card className="rounded-2xl shadow-sm py-[5%] col-span-3">
          <CardContent className="pt-[2%]">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <div className="flex flex-col gap-2 pt-[2%]">
                  <p className="text-md text-dark font-bold">
                    {" "}
                    Connect a supported financial integration{" "}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Easily Connect Your Accounts with Our Supported
                    Integrations!
                  </p>
                </div>
                <ConnectIntegrationButton />
              </div>
              <SupportedIntegrations />
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { ConnectNewIntegration };
