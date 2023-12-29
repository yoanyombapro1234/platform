//Importing required packages and components
import { FC, ReactNode } from "react";
import { Nav } from "src/components/nav/nav";
import {
  FinancialPortalSidebar,
  SidebarOption,
} from "src/components/sidebar/financial-portal-sidebar";
import { cn } from "src/lib/utils";
import {
  selectAuthenticated,
  selectOnboardingStatus,
  selectUsername,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";
import React from "react";
import { ConnectNewIntegration } from "src/components/integrations/integrations";

/**
 * The Layout component is a functional component that provides a general layout to the application.
 * This layout contains the navigation bar and the provided children components.
 * The navigation bar is displayed only if the user is authenticated.
 *
 * @param props - An object containing the children components to be rendered within this layout and an optional className.
 * @returns The Layout component
 */
const Layout: FC<{
  children: ReactNode;
  className?: string;
  sidebarCallback?: React.Dispatch<React.SetStateAction<SidebarOption>>;
  selectedSidebarOption?: SidebarOption;
  enableSidebar?: boolean;
}> = ({
  children,
  className,
  sidebarCallback,
  selectedSidebarOption,
  enableSidebar = false,
}) => {
  // useSelector hook to extract data from Redux Store, checking if the user is authenticated from the authentication selector
  const isAuthenticated = useAppSelector(selectAuthenticated);
  const isOnboarded = useAppSelector(selectOnboardingStatus);
  const currentUsername = useAppSelector(selectUsername);

  return (
    <div>
      {isAuthenticated && (
        <>
          <Nav />
          <div className="px-[5%] py-[2%] max-w-[95%]">
            <ConnectNewIntegration username={currentUsername} />
          </div>
        </>
      )}
      <div
        className={cn(
          "w-screen min-h-full min-w-full md:p-2 sm:p-4 lg:p-8 xl:p-10",
          className
        )}
      >
        {enableSidebar ||
        (selectedSidebarOption !== undefined &&
          sidebarCallback !== undefined) ? (
          <div className="border-t">
            <div className="bg-background">
              <div className="md:grid md:grid-cols-4">
                <FinancialPortalSidebar
                  selectedOption={selectedSidebarOption}
                  setSelectedOption={sidebarCallback}
                  className="col-span-1 hidden md:block md:px-10 md:max-w-sm"
                />
                <div className="col-span-3 md:p-5 w-full">{children}</div>
              </div>
            </div>
          </div>
        ) : (
          <div className="md:p-5">{children}</div>
        )}
      </div>
    </div>
  );
};

export { Layout };
