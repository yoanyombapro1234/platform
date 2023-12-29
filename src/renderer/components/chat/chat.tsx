import React, { useState } from "react";
import { ChatGPTMessage, ChatLine, LoadingChatLine } from "./chat-line";
import {
  selectCurrentUserAccount,
  selectCurrentSocialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { BrainCog, GripIcon } from "lucide-react";
import { Switch } from "src/components/ui/switch";
import { SelectGroup, SelectLabel } from "src/components/ui/select";
import { Card, CardTitle } from "src/components/ui/card";

import { useAppSelector } from "src/redux/store/hooks";
import { Button } from "../ui/button";
import { handler } from "src/chat-stream/stream";
import { PromptContext } from "src/lib/context-prompt";

import { ScrollArea } from "src/components/ui/scroll-area";
import Toast from "../warning-toast";
import { cn } from "src/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";

// default first message to display in UI (not necessary to define the prompt)
export const initialMessages: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Hi! I am Solomon AI. Ask me anything related to your finances!",
  },
];

function InputMessage({ input, setInput, sendMessage, setToast }: any) {
  return (
    <div className="flex clear-both mt-6">
      <textarea
        aria-label="chat input"
        required
        className="text-xs md:text-sm min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 sm:text-xs"
        value={input}
        placeholder="Ask Solomon AI ..."
        rows={4}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            try {
              sendMessage(input);
            } catch (err) {
              setToast(
                <Toast
                  show={true}
                  message={`Experiencing problem given how many accounts you have ! Ask questions against a diffferent account! `}
                  autoHideDuration={3000}
                  key={Date.now().toString()}
                />,
              );
            }
            setInput("");
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <Button
        type="submit"
        className="flex-none ml-4"
        onClick={() => {
          try {
            sendMessage(input);
          } catch (err) {
            setToast(
              <Toast
                show={true}
                message={`Experiencing problem given how many accounts you have ! Ask questions against a diffferent account! `}
                autoHideDuration={3000}
                key={Date.now().toString()}
              />,
            );
          }
          setInput("");
        }}
      >
        Ask
      </Button>
    </div>
  );
}

/*
  Todo: Have a base financial context class that all other contexts can inherit from 

  Maybe
*/

/*
  Context types allows any other 
*/
type ContextTypes = {
  contextName: string;
  context: any;
};

type ChatProps = {
  baseContext: ContextTypes;
  sampleQuestions: string[];
  secondaryContext?: ContextTypes[];
  className?: string;
};

const initialAnalyticMessage: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Ask me anything about this data?",
  },
];

/*
  Base chat component that accepts financial context and sample questions
  should convert any to a class type that all contexts can inherit from 
*/
function Chat({
  baseContext,
  sampleQuestions,
  secondaryContext,
  className,
}: ChatProps) {
  const [messages, setMessages] = useState<ChatGPTMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const profile = useAppSelector(selectCurrentSocialProfile);
  const [userKey] = useState(profile.name);
  const userAccount = useAppSelector(selectCurrentUserAccount);
  const [currentContext, setCurrentContext] =
    useState<ContextTypes>(baseContext);
  const [toast, setToast] = useState<React.ReactElement | null>();
  const sendMessage = async (message: string) => {
    setLoading(true);
    const promptGenerator = new PromptContext(
      currentContext.context,
      userAccount,
    );

    // emit mixpanel metrics
    mixPanelClient.trackEventOfType(eventNames.ASK_SOLOMON_AI_ACTION_EVENT, {
      userID: userAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${userAccount.username}`,
        tags: `${userAccount.tags}`,
      },
    });

    const contextDrivenQuestion =
      promptGenerator.getFinancialContextBasedPrompt(message);

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];

    setMessages(newMessages);
    const last10messages = [
      ...newMessages.slice(-2),
      { role: "user", content: contextDrivenQuestion } as ChatGPTMessage,
    ]; // remember last 2 messages

    // TODO: wrap around a try catch block
    const data = await handler({
      last10messages: last10messages,
      user: userKey,
      financialContext: baseContext.context,
    });
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;

    let lastMessage = "";

    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);

      lastMessage = lastMessage + chunkValue;

      setMessages([
        ...newMessages,
        { role: "assistant", content: lastMessage } as ChatGPTMessage,
      ]);

      setLoading(false);
    }
  };

  return (
    <div className={cn(className)}>
      {toast}
      <div className="top-0 left-0 w-full">
        <EmbeddedContextPickerComponent
          className="flex justify-end "
          messages={initialAnalyticMessage}
          selectedContext={currentContext}
          setContextCallback={setCurrentContext}
          baseContext={baseContext}
          contextFamily={secondaryContext ?? []}
        />
      </div>
      <div className={"max-w-screen px-2 flex flex-col"}>
        {/** This is the picker that enables the user to switch between embedded context */}
        <div className="grid gap-4 py-4">
          <ScrollArea className="flex flex-col w-full">
            {messages.map(({ content, role }, index) => (
              <ChatLine key={index} role={role} content={content} />
            ))}
            {loading && <LoadingChatLine />}
            <div>
              {" "}
              {initialMessages.length < 2 && (
                <>
                  <span className="flex flex-grow clear-both mx-auto text-xs text-black dark:text-gray-300">
                    Type a message to start the conversation
                  </span>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col justify-end md:min-h-[350px]">
          <div className="z-10 flex items-center justify-center w-fit">
            <div className="flex flex-col w-full">
              <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                {sampleQuestions.map((question, index) => (
                  <Card
                    className="flex flex-row gap-1 p-2 bg-white rounded-lg shadow-md"
                    key={index}
                  >
                    <div className="p-1">
                      <BrainCog className="w-6 h-6 text-white bg-black rounded-full" />
                    </div>
                    <p
                      className="text-xs md:text-sm"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </p>
                  </Card>
                ))}
              </div>
              <InputMessage
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                setToast={setToast}
              />
              <p className="p-2 text-xs font-bold">
                Solomon AI may produce inaccurate information about people,
                places, or facts.{" "}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const EmbeddedContextPickerComponent: React.FC<{
  className?: string;
  messages: ChatGPTMessage[];
  selectedContext: ContextTypes;
  setContextCallback: (context: ContextTypes) => void;
  baseContext: ContextTypes;
  contextFamily: ContextTypes[];
}> = ({
  className,
  messages,
  selectedContext,
  baseContext,
  contextFamily,
  setContextCallback,
}) => {
  const [toast, setToast] = useState<React.ReactElement | null>();

  return (
    <div className={className}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="flex flex-row gap-2 text-black bg-white border">
            <GripIcon className="w-6 h-6" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="p-3">
              Tell me what to account for when answering your questions
            </AlertDialogTitle>
            <AlertDialogDescription>
              <SelectGroup>
                <SelectLabel>
                  {" "}
                  {initialAnalyticMessage.length < 2 && (
                    <>
                      <span className="flex flex-grow clear-both mx-auto text-gray-800 dark:text-gray-800">
                        Pick an option below to get started ! If you dont pick
                        anything you can still ask questions against your
                        general finances ! Please pick only one option at a time
                      </span>
                      {selectedContext && (
                        <span className="flex flex-grow clear-both mx-auto my-3 font-bold text-black text-l dark:text-black">
                          Selected: {selectedContext.contextName}
                        </span>
                      )}
                    </>
                  )}
                  {contextFamily?.map((secondaryContext) => (
                    <div
                      key={secondaryContext.contextName}
                      className="flex items-center py-3 space-x-2"
                    >
                      <Switch
                        id="terms"
                        className="rounded-full"
                        onClick={() => {
                          if (
                            selectedContext.contextName !==
                              baseContext.contextName ||
                            (selectedContext.contextName !==
                              secondaryContext.contextName &&
                              selectedContext.contextName !==
                                baseContext.contextName)
                          ) {
                            setContextCallback(baseContext);
                          } else {
                            if (
                              Object.keys(secondaryContext.context).length === 0
                            ) {
                              setToast(
                                <Toast
                                  show={true}
                                  message={`${secondaryContext.contextName} are not connected ! `}
                                  autoHideDuration={3000}
                                  key={Date.now().toString()}
                                />,
                              );
                            }
                            setContextCallback(secondaryContext);
                          }
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Ask questions against {secondaryContext.contextName}
                      </label>
                    </div>
                  ))}
                </SelectLabel>
              </SelectGroup>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export { InputMessage, Chat };
export type { ContextTypes, ChatProps };
