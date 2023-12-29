import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";
import { PlusCircle } from "lucide-react";
import { useAppSelector } from "src/redux/store/hooks";
import { selectUserFinancialProfile } from "src/redux/slice/authentication/AuthenticationSelector";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { ConnectPlaidAccountButtonMemoized } from "./button/connect-plaid-account-button-v2";

/**
 * Props interface for the AccountOverviewSummaryHeader component.
 */
interface IProps {
  /**
   * The title to display for the account overview.
   */
  title: string;
  /**
   * The title to display for the "Connect Another Account" button.
   */
  buttonTitle: string;
  /**
   * The total count of accounts to display.
   */
  count: number;
}

/**
 * AccountOverviewSummaryHeader component displays a header for the account overview.
 * It shows the title of the account overview and the "Connect Another Account" button.
 *
 * @param props - The props for the component.
 * @returns A React functional component.
 */
const AccountOverviewSummaryHeader: React.FC<IProps> = (props) => {
  const { title, buttonTitle, count } = props;

  return (
    <div className="flex flex-col p-5">
      <div className="flex flex-row justify-between">
        <h2 className="pb-5 ml-2 text-xl font-bold tracking-tight">
          {title} <span className="ml-5 text-xs"> ({count})</span>
        </h2>
        <AccountSheet buttonTitle={buttonTitle} />
      </div>

      <h2>
        {count === 0 ? (
          <>
            <h1 className="hidden mx-6 font-bold sm:block sm:text-xl md:text-s">
              Please Connect {title}.
            </h1>
            <h3 className="my-2 font-semibold mx-9 sm:text-xl md:text-sm">
              If you have already connected your accounts, we are fetching your
              data ! Hang tight :)
            </h3>
          </>
        ) : null}
      </h2>
    </div>
  );
};

/**
 * AccountSheet component displays the connected accounts in a sheet.
 * It shows the "Connect Another Account" button and a list of connected accounts.
 *
 * @param props - The props for the component.
 * @returns A React functional component.
 */
const AccountSheet: React.FC<{
  buttonTitle: string;
}> = (props) => {
  const { buttonTitle } = props;
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const { link } = financialProfile;
  const numberOfConnectedAccounts = link === undefined ? 0 : link.length;

  if (link === undefined || link.length === 0) {
    return (
      <Sheet>
        <SheetTrigger className="flex flex-row gap-2 p-3 m-2 font-bold border text-md rounded-2xl">
          <PlusCircle className="w-6 h-6" />
          Connect Another Account
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle className="text-2xl">
              Connected Accounts{" "}
              <span className="text-xs font-bold">
                ({numberOfConnectedAccounts})
              </span>
            </SheetTitle>
            <SheetDescription>
              <p className="text-lg text-black underline">
                Connected Institutions
              </p>
              <div className="grid grid-cols-1 gap-2 py-3 md:grid-cols-2">
                <Card className="p-3">
                  <CardHeader>
                    <CardTitle>
                      <p> No Accounts Connected </p>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </div>
              You have {numberOfConnectedAccounts} connected accounts on our
              platform. If you want to connect more accounts, please click on
              the button below
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <Sheet>
      <SheetTrigger className="flex flex-row gap-2 p-3 m-2 font-bold border text-md rounded-2xl">
        <PlusCircle className="w-6 h-6" />
        Connect Another Account
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle className="text-2xl">
            Connected Accounts{" "}
            <span className="text-xs font-bold">
              ({numberOfConnectedAccounts})
            </span>
          </SheetTitle>
          <SheetDescription>
            <p className="text-lg text-black underline">
              Connected Institutions
            </p>
            <div className="grid grid-cols-1 gap-2 py-3 md:grid-cols-2">
              {link.map((connectedLink, index) => (
                <Card key={index} className="p-3">
                  <CardHeader>
                    <CardTitle>
                      <p> {connectedLink.institutionName} </p>
                      <p
                        style={{
                          fontSize: "10px",
                        }}
                        className="font-bold leading-3"
                      >
                        {" "}
                        {connectedLink.newAccountsAvailable
                          ? "New Accounts Avalaible"
                          : "No New Accounts Available"}
                      </p>
                    </CardTitle>
                    {!connectedLink.shouldBeUpdated ? (
                      <></>
                    ) : (
                      <div
                        style={{
                          fontSize: "10px",
                        }}
                      >
                        <ConnectPlaidAccountButtonMemoized
                          title={`Need To Update Account (${connectedLink.institutionName})`}
                          linkId={Number(connectedLink.id)}
                        />
                      </div>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
            You have {numberOfConnectedAccounts} connected accounts on our
            platform. If you want to connect more accounts, please click on the
            button below
            <ConnectPlaidAccountButtonMemoized
              title={`Connect ${buttonTitle}`}
            />
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export { AccountOverviewSummaryHeader };
