import { Link } from "react-router-dom";
import { Logo } from "src/components/Logo";
import { ResetPasswordForm } from "src/components/form/reset-password-form";
import { Layout } from "src/layouts/layout";

const ResetPasswordPage: React.FC = () => {
  return (
    <Layout>
      <div className="pt-[5%] sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/financial-portal" aria-label="Home">
          <Logo />
        </Link>
        <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Change Password
        </h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-5 shadow sm:rounded-lg sm:px-12">
          {/** password reset form */}
          <ResetPasswordForm />
          <div>
            <div className="relative mt-10">
              <div
                className="absolute inset-0 flex items-center"
                aria-hidden="true"
              ></div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { ResetPasswordPage };
