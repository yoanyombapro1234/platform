import { CannyProvider, CannyFeedback } from "react-canny";
import React, { useEffect, useState } from "react";
import { Layout } from "src/layouts/layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Card, CardHeader, CardTitle } from "src/components/ui/card";
import { Spinner } from "src/components/spinner";
import {
  useUserAccount,
  useUserId,
  useAvatar,
} from "../../hooks/userSelectors";
import { useSSOToken } from "../../hooks/useSSOToken";

const featureRequestBoardToken = "963d21ce-6d1d-add1-472d-cf9cf75cc64a";
const feedbackBoardToken = "ec000d15-6137-9936-b426-e8d23d4cb37a";
const appId = "6550116ea9a3f2d9010f3379";

const TabContent: React.FC<{
  boardToken: string;
  ssoToken: string;
  user: {
    id: number | string;
    name: string;
    email: string;
    avatarURL: string;
  };
}> = ({ boardToken, ssoToken, user }) => (
  <CannyProvider appId={appId} user={user}>
    <CannyFeedback
      basePath="/feedback"
      boardToken={boardToken}
      ssoToken={ssoToken}
    />
  </CannyProvider>
);

export const FeedbackComponent: React.FC = () => {
  const userAccount = useUserAccount();
  const userId = useUserId();
  const avatar = useAvatar();
  const { currentToken, spinner } = useSSOToken(userAccount);

  if (
    userAccount?.username === undefined ||
    userAccount?.email === undefined ||
    userAccount === undefined
  ) {
    return null;
  }

  const email = userAccount.email!;
  const username = userAccount.username!;

  return (
    <Layout>
      {spinner}
      {currentToken && (
        <Tabs defaultValue="feedback" className="w-full">
          <TabsList>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
            <TabsTrigger value="feature-requests">Feature Requests</TabsTrigger>
          </TabsList>
          <TabsContent value="feedback">
            <TabContent
              boardToken={feedbackBoardToken}
              ssoToken={currentToken}
              user={{
                id: userId,
                name: username,
                email: email,
                avatarURL: avatar,
              }}
            />
          </TabsContent>
          <TabsContent value="feature-requests">
            <TabContent
              boardToken={featureRequestBoardToken}
              ssoToken={currentToken}
              user={{
                id: userId,
                name: username,
                email: email,
                avatarURL: avatar,
              }}
            />
          </TabsContent>
        </Tabs>
      )}
    </Layout>
  );
};
