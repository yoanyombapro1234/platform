import { routes } from "src/constant/routes";
import { ProtectedRoute } from "./protected-routes";
import { Routes, Route } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ErrorFallbackPage } from "src/pages/boundary/error-boundary";
import { ChatPage } from "src/pages/chat/chat-page";
import InsightsPortal from "src/pages/portal/insights-portal";
import { FinancialAnalyticsPortal } from "src/pages/portal/financial-portal/financial-portal";
import { VerificationPage } from "src/pages/verification/verfication";
import { ResetPasswordPage } from "src/pages/password-reset/reset-password";
import {
  RequestBusinessPasswordResetPage,
  RequestConsumerPasswordResetPage,
} from "src/pages/password-reset/request-password-reset";
import RegistrationPage from "src/pages/registration/registration-page";
import { UserAccountsPaymentPage } from "src/pages/onboarding/payment/consumer-payment";
import { BankAccountConnectionPage } from "src/pages/onboarding/bankaccount-connection/bankaccount-connection";
import { EmailVerificationPage } from "src/pages/registration/EmailVerificationPage";
import { ConnectPlaidAccountButton } from "src/components/button/connect-plaid-account-button";
import { BankAccountOverviewPage } from "src/pages/account/account-page";
import { BasePortalPage } from "src/pages/portal/base-portal-page";
import { BusinessAccountsPaymentPage } from "src/pages/onboarding/payment/business-payment";
import { BusinessRegistrationPage } from "../pages/registration/business-registration-page";
import {
  BusinessLoginPage,
  ConsumerLoginPage,
} from "src/pages/authentication/login";
import { FeedbackComponent } from "src/components/feedback/feedback";
import { ConnectPlaidAccountButtonMemoized } from "src/components/button/connect-plaid-account-button-v2";
import { ProfilePage } from "src/pages/profile/profile";

/**
 * Global Routes component to define the routing configuration for the application.
 * @returns {JSX.Element} - JSX element representing the routing configuration.
 */
function GlobalRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Route for the authentication page */}
        <Route path={routes.AUTHENTICATION} element={<ConsumerLoginPage />} />
        <Route
          path={routes.BUSINESS_AUTHENTICATION}
          element={<BusinessLoginPage />}
        />

        <Route
          path={routes.EMAILVERIFICATION}
          element={<EmailVerificationPage />}
        />
        <Route
          path={routes.PLAID}
          element={
            <ConnectPlaidAccountButtonMemoized
              title={"Connect a new account"}
            />
          }
        />

        {/* Route for the verification page with a dynamic user ID */}
        <Route
          path="/verification/:userID/:profileType"
          element={<VerificationPage />}
        />
        <Route
          path={routes.REQUEST_PASSWORD_CHANGE}
          element={<RequestConsumerPasswordResetPage />}
        />
        <Route
          path={routes.BUSINESS_REQUEST_PASSWORD_CHANGE}
          element={<RequestBusinessPasswordResetPage />}
        />
        <Route path={routes.RESET_PASSWORD} element={<ResetPasswordPage />} />
        <Route
          path={routes.BUSINESS_REGISTRATION}
          element={<BusinessRegistrationPage />}
        />
        <Route path={routes.REGISTRATION} element={<RegistrationPage />} />

        <Route element={<ProtectedRoute />}>
          <Route
            path={routes.CONSUMER_PAYMENT}
            element={<UserAccountsPaymentPage />}
          />
          <Route
            path={routes.BUSINESS_PAYMENT}
            element={<BusinessAccountsPaymentPage />}
          />
          <Route
            path={routes.CONNECT_BANK_ACCOUNT}
            element={<BankAccountConnectionPage />}
          />

          {/* Default route when no specific route matches */}
          <Route path={"/"} element={<BasePortalPage />} />
          {/* Route for the chat page . note the task id is optional */}
          <Route path={`${routes.HOME}/:taskId?`} element={<ChatPage />} />
          <Route path={routes.PROFILE} element={<ProfilePage />} />
          {/* Route for the financial portal */}
          <Route path={routes.FINANCIALPORTAL} element={<BasePortalPage />} />
          {/* Route for the insights portal */}
          <Route path={routes.INSIGHTSPORTAL} element={<InsightsPortal />} />

          <Route
            path={routes.BANK_ACCOUNT_OVERVIEW}
            element={<BankAccountOverviewPage />}
          />

          <Route
            path={routes.USER_FEEDBACK_EXTERNAL_URL}
            element={<FeedbackComponent />}
          />
        </Route>

        {/* 
          Fallback route - This will be shown if no other route matches
          ref: https://blog.diogomartino.com/index.php/2021/11/22/how-to-create-a-fallback-route-in-react-router-6/
        */}
        <Route path="*" element={<ErrorFallbackPage />} />
        {/* 
          Note: The commented-out route for LandingPage is not used in the current configuration.
          If needed, uncomment and provide the corresponding LandingPage component.
        */}
        {/* <Route path={routes.LANDING} element={<LandingPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export { GlobalRoutes };
