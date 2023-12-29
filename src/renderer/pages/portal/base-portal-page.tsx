import { PortalLayout } from "src/layouts/portal-layout";
import { FinancialAnalyticsPortal } from "./financial-portal/financial-portal";
import { SetStateAction, useState } from "react";
import { SidebarOption } from "src/components/sidebar/financial-portal-sidebar";
import { AnalyticsAndInsightsPortal } from "./analytics-and-insights-portal/analytics-and-insights-portal";
import { TransactionPortal } from "./transactions-portal/transactions-portal";
import { HomePortal } from "./home/home-portal";
import { CreateGoalExperience } from "src/components/button/create-goal-button";
import { useAppSelector } from "src/redux/store/hooks";
import { selectCurrentUserAccount } from "src/redux/slice/authentication/AuthenticationSelector";
import { mixPanelClient } from "src/lib/mixpanel";

const BasePortalPage: React.FC = () => {
  const [selectedSidebarOption, setSelectedSidebarOption] =
    useState<SidebarOption>("HOME");
  const [goalState, setGoalState] = useState<boolean>(true);

  const userAccount = useAppSelector(selectCurrentUserAccount);

  mixPanelClient.trackViewFinancialDashboardFeatureEvent({
    userID: `${userAccount.userAccountID}`,
    time: new Date().toDateString(),
    metaData: {
      userName: `${userAccount.username}`,
      tags: `${userAccount.tags}`,
    },
  });

  return (
    <PortalLayout
      sidebarOptionCallback={setSelectedSidebarOption}
      selectedSidebarOption={selectedSidebarOption}
    >
      {selectedSidebarOption === "FINANCIAL_PORTAL" && (
        <FinancialAnalyticsPortal />
      )}
      {selectedSidebarOption === "ANALYTICS" && <AnalyticsAndInsightsPortal />}
      {selectedSidebarOption === "TRANSACTIONS" && <TransactionPortal />}
      {selectedSidebarOption === "HOME" && (
        <HomePortal showTransactions={true} />
      )}
    </PortalLayout>
  );
};

export { BasePortalPage };
