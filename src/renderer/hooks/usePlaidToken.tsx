import {
  FinancialUserProfileType,
  PlaidInitiateTokenUpdateRequestClass,
  PlaidLinkRequestClass,
} from "@solomon-ai/component-library";
import { useState, useEffect } from "react";
import { useLinkTokenMutation } from "src/redux/mutations/initiate-link-token-exchange";
import { useUpdateLinkTokenMutation } from "src/redux/mutations/update-link-token";

export const usePlaidToken = (
  linkId: number | undefined,
  currentUserId: string,
  username: string,
  email: string,
  profileType: FinancialUserProfileType
) => {
  const [currentToken, setCurrentToken] = useState<string>("");
  const [getLinkToken] = useLinkTokenMutation();
  const [updateLinkToken] = useUpdateLinkTokenMutation();

  useEffect(() => {
    const createOrUpdateToken = async () => {
      let token: string;
      if (linkId !== undefined) {
        // Update token logic
        // here we are to update the link hence no need to go through token exchange
        const request: PlaidInitiateTokenUpdateRequestClass = {
          userId: currentUserId!,
          linkId: linkId.toString(),
          profileType: profileType,
        };

        // Assuming updateLinkToken returns a response with a linkToken field
        const response = await updateLinkToken(request).unwrap();
        token = response.linkToken;
      } else {
        const req: PlaidLinkRequestClass = {
          userId: currentUserId,
          fullName: username ? username : "",
          email: email ? email : "",
          phoneNumber: "",
          profileType: profileType,
        };

        const response = await getLinkToken(req).unwrap();
        token = response.linkToken;
      }
      setCurrentToken(token);
    };

    if (currentUserId) {
      createOrUpdateToken();
    }
  }, [linkId, currentUserId, getLinkToken, updateLinkToken]);

  return currentToken;
};
