import { ProfileType } from "@solomon-ai/component-library";
import { Link } from "react-router-dom";
import { Logo } from "src/components/Logo";
import { RequestPasswordResetForm } from "src/components/form/request-password-reset-form";
import { Layout } from "src/layouts/layout";

const RequestConsumerPasswordResetPage: React.FC = () => {
  return <RequestPasswordResetPage profileType={"PROFILE_TYPE_USER"} />;
};

const RequestBusinessPasswordResetPage: React.FC = () => {
  return <RequestPasswordResetPage profileType={"PROFILE_TYPE_BUSINESS"} />;
};

const RequestPasswordResetPage: React.FC<{
  profileType: ProfileType;
}> = ({ profileType }) => {
  return (
    <Layout>
      <div className="pt-[15%] sm:mx-auto sm:w-full sm:max-w-md md:pt-[5%]">
        <Link to="/financial-portal" aria-label="Home">
          <Logo />
        </Link>
        <h2 className="mt-6 text-2xl font-bold leading-9 tracking-tight text-center text-gray-900">
          Please Provide Your Email
        </h2>
        <p className="mt-6 text-sm leading-9 tracking-tight text-center text-gray-900">
          A password reset link will be emailed to you. Please check your spam
          folder as well !
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6 py-5 m-1 bg-white border shadow rounded-2xl sm:px-12">
          {/** password reset form */}
          <RequestPasswordResetForm profileType={profileType} />
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

export { RequestBusinessPasswordResetPage, RequestConsumerPasswordResetPage };
