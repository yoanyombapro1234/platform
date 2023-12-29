import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { routes } from "src/constant/routes";
import { useVerifyEmailMutation } from "src/redux/mutations/verify-user-account";
import { ProfileType } from "@solomon-ai/component-library";
import { useVerifyEmailV2Mutation } from "src/redux/mutations/verify-user-account-v2";

/**
 * Verfication page component extracts the user_id
 * from the url and sends a request to the server to verify the user
 *
 * @author Yoan Yomba
 *
 * @returns {*}
 */
const VerificationPage: React.FC = () => {
  const params = useParams();
  const userID = params.userID as string;
  const profileType = params.profileType as ProfileType;
  const [verified, setVerified] = React.useState<boolean>(false);

  const [verifyAccount] = useVerifyEmailV2Mutation();
  const navigate = useNavigate();

  useEffect(() => {
    // call api or anything
    const handleVerification = async () => {
      const isVerified = await verifyAccount({ userID, profileType }).unwrap();
      setVerified(isVerified);
    };

    handleVerification();

    return () => {
      // this now gets called when the component unmounts
    };
  }, [userID, verifyAccount]);

  if (userID === "0") {
    return (
      <div className="flex flex-1">
        <div className="container flex items-center lg:p-20">
          <p>
            Invalid UserID. Cannot Verify Account. Please contact support at
            admin@simfinii.com
          </p>
        </div>
      </div>
    );
  }

  if (verified === true) {
    navigate(routes.AUTHENTICATION);
  }

  // execute this code block if the verification process was unsuccessful
  return (
    <div className="container flex items-center lg:p-20 ">
      <h1>{FailedVerification()}</h1>
    </div>
  );
};

function FailedVerification() {
  return (
    <div>
      <p>
        Your account could not be verified. Please contact support at
        admin@simfinii.com
      </p>
    </div>
  );
}

export { VerificationPage };
