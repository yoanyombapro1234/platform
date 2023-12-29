import { Logo } from "src/components/Logo";
import { ConnectPlaidAccountButtonMemoized } from "src/components/button/connect-plaid-account-button-v2";
import { selectUserFinancialProfile } from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

export const BankAccountConnectionPage = () => {
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const { profileType } = financialProfile;

  return (
    <div className="p-10 lg:p-20">
      <Logo />
      <section className="bg-white dark:bg-black">
        <div className="items-center max-w-screen-xl gap-8 px-4 py-8 mx-auto lg:grid lg:grid-cols-2 xl:gap-16 lg:py-16 lg:px-6 ">
          <div className="mb-6 text-gray-500 sm:text-lg">
            <div className="grid grid-cols-1">
              <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-gray-900 md:text-4xl dark:text-white">
                Connect Your financial Accounts
              </h2>
              <div>
                <ConnectPlaidAccountButtonMemoized
                  title={`Connect A Bank Account`}
                />
              </div>
            </div>
            <p className="mb-4 text-xl font-light text-black dark:text-gray-200"></p>
            <p className="mb-4 text-xl font-light text-black dark:text-gray-200">
              Connect all your financial accounts ranging from bank accounts to
              brokerages and experience a streamlined, holistic view of your
              financial world
            </p>
            <div className="grid gap-6 lg:grid-cols-1 dark:border-black sm:grid-cols-2">
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Safety & Security
                  </p>
                  <p className="font-light text-gray-500 dark:text-gray-200">
                    Your financial security is our top priority. We employ
                    state-of-the-art encryption and security measures to ensure
                    that your data is protected and remains confidential.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Real-time Insights
                  </p>
                  <p className="font-light text-gray-500 dark:text-gray-200">
                    Rather than manually entering transactions or updating
                    balances, Solomon-AI can provide real-time insights based on
                    the latest data from your bank account. This ensures you
                    always have the most up-to-date view of your finances.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Seamless Financial Planning
                  </p>
                  <p className="font-light text-gray-500 dark:text-gray-200">
                    Integrating your bank account allows Solomon-AI to factor in
                    your actual financial data when helping you set and achieve
                    financial goals, whether its saving for a big purchase,
                    investing for the future, or planning for retirement.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 shrink-0">
                  <svg
                    className="w-8 h-8 text-primary-600 dark:text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"></path>
                  </svg>
                </div>
                <div>
                  <p className="mb-1 text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
                    Proactive Alerts
                  </p>
                  <p className="font-light text-gray-500 dark:text-gray-200">
                    With a connected bank account, Solomon-AI can proactively
                    alert you to potential issues such as upcoming bills, low
                    balances, or unusual spending activity, helping you avoid
                    potential fees or financial pitfalls.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <img
            className="mx-auto mb-4 border sm:flex rounded-2xl"
            src="https://images.unsplash.com/photo-1589666564459-93cdd3ab856a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1887&q=80"
            alt="table professor illustration"
          />
        </div>
      </section>
    </div>
  );
};
