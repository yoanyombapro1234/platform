import { UserAuthForm } from "src/components/form/login-form";
import { Layout } from "src/layouts/layout";

import { Logo } from "src/components/Logo";
import { Link } from "react-router-dom";
import {
  FinancialUserProfileType,
  ProfileType,
} from "@solomon-ai/component-library";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "src/components/ui/tabs";
import { cn } from "src/lib/utils";

const ConsumerLoginPage: React.FC = () => {
  return (
    <Tabs defaultValue="account" className="h-[100%] min-w-screen">
      <Layout className="p-2">
        <Link to="/financial-portal" aria-label="Home">
          <Logo />
        </Link>{" "}
        <TabsList className="rounded-md shadow-md w-fit">
          <TabsTrigger value="business" className="m-5">
            For Small Businesses
          </TabsTrigger>
          <TabsTrigger value="account" className="m-5">
            For Solo Entrepreneurs
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="account"
          className="bg-gray-50 rounded-2xl md:p-[4%] text-black md:shadow-md md:border-2 w-full"
        >
          <LoginPage
            profileType={"PROFILE_TYPE_USER"}
            financialUserProfileType="FINANCIAL_USER_PROFILE_TYPE_USER"
            title="Helping you make the most of your money as a solo entrepreneur"
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-black"
          />
        </TabsContent>
        <TabsContent
          value="business"
          className="bg-gray-50 rounded-2xl md:p-[4%] text-black md:shadow-md md:border-2 w-full"
        >
          <LoginPage
            profileType={"PROFILE_TYPE_BUSINESS"}
            financialUserProfileType="FINANCIAL_USER_PROFILE_TYPE_BUSINESS"
            title="The power of a financial planning team at your fingertips"
            className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-black"
          />
        </TabsContent>
      </Layout>
    </Tabs>
  );
};

const BusinessLoginPage: React.FC = () => {
  return (
    <LoginPage
      profileType={"PROFILE_TYPE_BUSINESS"}
      financialUserProfileType="FINANCIAL_USER_PROFILE_TYPE_BUSINESS"
    />
  );
};

/**
 * LoginPage component to render the login page.
 * @returns {JSX.Element} - The JSX element representing the LoginPage component.
 */
const LoginPage: React.FC<{
  profileType: ProfileType;
  financialUserProfileType: FinancialUserProfileType;
  title?: string;
  className?: string;
}> = ({ profileType, financialUserProfileType, title, className }) => {
  return (
    <div>
      <div className="pt-[15%] sm:mx-auto sm:w-full sm:max-w-md md:pt-[5%]">
        <h1
          className={cn(
            "text-4xl font-extrabold text-center text-white leading-20",
            className
          )}
        >
          {profileType === "PROFILE_TYPE_BUSINESS"
            ? "Small Business"
            : "Solo Entrepreneur"}
        </h1>
        <h2 className="mt-6 text-xl font-bold leading-9 tracking-tight text-center ">
          {title || "The power of a financial planning team at your fingertips"}
        </h2>
      </div>
      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6 py-12 bg-white border shadow-md rounded-2xl sm:px-12">
          {/* User authentication form */}
          <UserAuthForm
            profileType={profileType}
            financialUserProfileType={financialUserProfileType}
            className="text-black"
          />
          <div>
            <div className="relative mt-10">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              >
                <div className="w-full border-t border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { BusinessLoginPage, ConsumerLoginPage };
