// Importing required packages and components
import { FC, ReactNode, SetStateAction } from "react";
import { MainNav } from "src/components/nav/main-nav";
import { Search } from "src/components/search";
import { SidebarOption } from "src/components/sidebar/financial-portal-sidebar";
import { Layout } from "src/layouts/layout";
import { selectUserFinancialProfile } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

// Defining options for the Portal Layout
const OPTIONS = {
  OVERVIEW: "OVERVIEW",
};

/**
 * The PortalLayout component is a functional component that structures the main portal layout of the application.
 * It includes the TeamSwitcher, MainNav and Search components along with the provided children components.
 *
 * @param props - An object containing the children components to be rendered within this layout.
 * @returns The PortalLayout component
 */
const PortalLayout: FC<{
  children?: ReactNode;
  sidebarOptionCallback?: React.Dispatch<React.SetStateAction<SidebarOption>>;
  selectedSidebarOption?: SidebarOption;
}> = (props) => {
  const { children } = props;

  return (
    <Layout
      sidebarCallback={props.sidebarOptionCallback}
      selectedSidebarOption={props.selectedSidebarOption}
    >
      {/* <div className="md:hidden"></div> */}
      <div className="flex-col md:flex">
        <div className="flex h-16 items-center px-4">
          {/* <TeamSwitcher /> */}
          {/* <MainNav className="mx-6" /> */}
        </div>
        <div className="flex-1 space-y-4">{children}</div>
      </div>
    </Layout>
  );
};

export { PortalLayout, OPTIONS };
