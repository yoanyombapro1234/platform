import { LightBulbIcon } from "@heroicons/react/24/outline";
import {
  MelodyFinancialContext,
  UserAccountClass,
} from "@solomon-ai/component-library";
import { BrainCircuit, BrainCircuitIcon, BrainCog } from "lucide-react";
import { useState } from "react";
import { handler } from "src/chat-stream/stream";
import {
  ChatGPTMessage,
  ChatLine,
  LoadingChatLine,
} from "src/components/chat/chat-line";
import { Button } from "src/components/ui/button";
import { Card, CardTitle } from "src/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "src/components/ui/dialog";
import { ScrollArea } from "src/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "src/components/ui/sheet";
import { Switch } from "src/components/ui/switch";
import { Textarea } from "src/components/ui/textarea";
import { useToast } from "src/components/ui/use-toast";
import { PromptContext } from "src/lib/context-prompt";
import { MIXPANEL_EVENTS, mixPanelClient } from "src/lib/mixpanel";
import { eventNames } from "src/lib/mixpanel-events";
import { cn } from "src/lib/utils";
import {
  selectCurrentSocialProfile,
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialContext,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { useAppSelector } from "src/redux/store/hooks";

/**
 * The initial message that the assistant will say.
 * TODO: CONSOLIDATE THIS AND THE OTHER SOLOMON CHAT COMPONENT.
 * USE THE SOLOMON CHAT COMPONENT HERE. WE HAVE REPLICATED CODE RN
 */
const initialAnalyticMessage: ChatGPTMessage[] = [
  {
    role: "assistant",
    content: "Ask me anything about this data?",
  },
];

function InputMessage({ input, setInput, sendMessage }: any) {
  return (
    <div className="mt-6 flex clear-both">
      <Textarea
        aria-label="chat input"
        required
        className="min-w-0 flex-auto appearance-none rounded-md border border-zinc-900/10 bg-white px-3 py-[calc(theme(spacing.2)-1px)] shadow-md shadow-zinc-800/5 placeholder:text-zinc-400 focus:border-black focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:text-gray-600 sm:text-sm"
        value={input}
        placeholder="Ask Solomon AI ..."
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            sendMessage(input);
            setInput("");
          }
        }}
        onChange={(e) => {
          setInput(e.target.value);
        }}
      />
      <Button
        type="submit"
        className="ml-4 flex-none"
        onClick={() => {
          sendMessage(input);
          setInput("");
        }}
      >
        Ask
      </Button>
    </div>
  );
}
/**
 * This is the main layout for the Analytic AI card.
 *
 * @param children - The child components to render within this component.
 * @param className - The CSS classes to apply to the component.
 * @param context - The context for the AI to operate in.
 *
 * @example
 * ```
 * <AskMelodiyAILayout context={context}>
 *   <ChildComponent />
 * </AskMelodiyAILayout>
 * ```
 */
const AskMelodiyAILayout: React.FC<{
  children: React.ReactNode;
  className?: string;
  context: any | undefined;
  sampleQuestions: string[];
  enableGlobalContext?: boolean;
}> = ({
  children,
  className,
  context,
  sampleQuestions,
  enableGlobalContext = false,
}) => {
  /**
   * State variable for the messages in the chat.
   */
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialAnalyticMessage,
  );
  /**
   * A hook to show toast messages.
   */
  const { toast } = useToast();
  /**
   * State variable for the input in the chat.
   */
  const [input, setInput] = useState("");
  /**
   * State variable to handle loading states.
   */
  const [loading, setLoading] = useState(false);
  /**
   * User's profile information.
   */
  const profile = useAppSelector(selectCurrentSocialProfile);
  /**
   * State variable for the user's key.
   */
  const [userKey] = useState(profile.name);
  /**
   * State variable for the global financial context setting.
   */
  const [enableGlobalFinancialContext, setEnableGlobalFinancialContext] =
    useState<boolean>(enableGlobalContext);

  /**
   * User's ID.
   */
  const userId = useAppSelector(selectCurrentUserID);
  /**
   * User's financial context.
   */
  const financialContext = useAppSelector(selectUserFinancialContext);
  const userAccount = useAppSelector(selectCurrentUserAccount);

  /**
   * Function to send a message to the AI.
   *
   * @param message - The message to send.
   */
  const sendMessage = async (message: string) => {
    // increment the question asked metrics in mixpanel
    mixPanelClient.trackEventOfType(MIXPANEL_EVENTS.QUESTION_ASKED);

    setLoading(true);
    let questionContext: string = context ?? JSON.stringify(context).trim();
    const globalContext =
      financialContext ?? JSON.stringify(financialContext).trim();
    const promptGenerator = new PromptContext(financialContext, userAccount);
    let contextDrivenQuestion: string = "";

    if (enableGlobalFinancialContext) {
      if (questionContext !== undefined) {
        const ctx = {
          questionContext: context,
          globalContext: financialContext,
        };

        // use financial context
        contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
          message,
          ctx,
        );
      } else {
        // use financial context
        contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
          message,
          globalContext,
        );
      }
    } else {
      contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
        message,
        questionContext,
      );
    }

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];

    setMessages(newMessages);
    const last10messages = [
      ...newMessages.slice(-5),
      { role: "user", content: contextDrivenQuestion } as ChatGPTMessage,
    ]; // remember last 2 messages

    // TODO: wrap around a try catch block
    const data = await handler({
      last10messages: last10messages,
      user: userKey,
      financialContext: context,
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
    <div
      className={cn(
        "bg-white shadow-lg border-4 border-gray-50 rounded-2xl md:p-[3%]",
        className,
      )}
    >
      <div className="flex justify-end pb-1">
        <AskSolomon context={context} sampleQuestions={sampleQuestions} />
      </div>
      {children}
    </div>
  );
};

export const AskSolomon: React.FC<{
  className?: string;
  context: any;
  sampleQuestions: string[];
}> = ({ className, context, sampleQuestions }) => {
  /**
   * State variable for the messages in the chat.
   */
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialAnalyticMessage,
  );
  /**
   * A hook to show toast messages.
   */
  const { toast } = useToast();
  /**
   * State variable for the input in the chat.
   */
  const [input, setInput] = useState("");
  /**
   * State variable to handle loading states.
   */
  const [loading, setLoading] = useState(false);
  /**
   * User's profile information.
   */
  const profile = useAppSelector(selectCurrentSocialProfile);
  /**
   * State variable for the user's key.
   */
  const [userKey] = useState(profile.name);
  /**
   * State variable for the global financial context setting.
   */
  const [enableGlobalFinancialContext, setEnableGlobalFinancialContext] =
    useState<boolean>(false);

  /**
   * User's ID.
   */
  const userId = useAppSelector(selectCurrentUserID);
  /**
   * User's financial context.
   */
  const financialContext = useAppSelector(selectUserFinancialContext);
  const userAccount = useAppSelector(selectCurrentUserAccount);

  /**
   * Function to send a message to the AI.
   *
   * @param message - The message to send.
   */
  const sendMessage = async (message: string) => {
    // increment the question asked metrics in mixpanel
    mixPanelClient.trackEventOfType(eventNames.ASK_SOLOMON_AI_ACTION_EVENT, {
      userID: userAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${userAccount.username}`,
        tags: `${userAccount.tags}`,
      },
    });

    setLoading(true);
    let questionContext: string = context ?? JSON.stringify(context).trim();
    const globalContext =
      financialContext ?? JSON.stringify(financialContext).trim();
    const promptGenerator = new PromptContext(financialContext, userAccount);
    let contextDrivenQuestion: string = "";

    if (enableGlobalFinancialContext) {
      // use financial context
      contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
        message,
        globalContext,
      );
    } else {
      contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
        message,
        questionContext,
      );
    }

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];

    setMessages(newMessages);
    const last10messages = [
      ...newMessages.slice(-5),
      { role: "user", content: contextDrivenQuestion } as ChatGPTMessage,
    ]; // remember last 2 messages

    // TODO: wrap around a try catch block
    const data = await handler({
      last10messages: last10messages,
      user: userKey,
      financialContext: context,
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
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="border-2 border-gray-200 shadow-sm w-fit"
        >
          <BrainCircuitIcon className="h-6 w-6 bg-white text-black font-bold rounded-md p-1" />
          <p className="font-semibold p-2 text-md"> Tell Me More About This</p>
        </Button>
      </SheetTrigger>
      <SheetContent className="p-5 border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:min-w-[40%] md:p-20 overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Ask Solomon AI</SheetTitle>
          <SheetDescription>
            Your personal financial copilot with the power of a financial
            planning team
          </SheetDescription>
          <div className="grid gap-4 py-4">
            <ScrollArea className="flex flex-col w-full  ">
              {messages.map(({ content, role }, index) => (
                <ChatLine key={index} role={role} content={content} />
              ))}
              {loading && <LoadingChatLine />}{" "}
              <div>
                {" "}
                {initialAnalyticMessage.length < 2 && (
                  <>
                    <span className="mx-auto flex flex-grow text-gray-600 dark:text-gray-300 clear-both">
                      Type a message to start the conversation
                    </span>
                    <div className="flex items-center space-x-2 py-3">
                      <Switch
                        id="terms"
                        className="rounded-full"
                        onClick={() => {
                          setEnableGlobalFinancialContext(
                            !enableGlobalFinancialContext,
                          );
                        }}
                      />
                      <label
                        htmlFor="terms"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable Financial Global Context
                      </label>
                    </div>
                  </>
                )}
              </div>
            </ScrollArea>
          </div>
        </SheetHeader>

        <SheetFooter className="w-fit flex items-center justify-center z-10">
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              {sampleQuestions.map((question, index) => (
                <Card
                  className="p-2 rounded-lg shadow-md bg-white flex flex-row gap-1"
                  key={index}
                >
                  <div className="p-2 rounded-lg">
                    <BrainCog className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle
                    className="text-xs py-1"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </CardTitle>
                </Card>
              ))}
            </div>
            <InputMessage
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
            />
            <p className="text-xs p-2 font-bold">
              Solomon AI may produce inaccurate information about people,
              places, or facts.{" "}
            </p>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export const AskSolomonDialog: React.FC<{
  className?: string;
  context: any;
  sampleQuestions: string[];
  userName: string;
  globalFinancialContext: MelodyFinancialContext;
  userAccount: UserAccountClass;
}> = ({
  className,
  context,
  sampleQuestions,
  userName,
  globalFinancialContext,
  userAccount,
}) => {
  /**
   * State variable for the messages in the chat.
   */
  const [messages, setMessages] = useState<ChatGPTMessage[]>(
    initialAnalyticMessage,
  );

  /**
   * State variable for the input in the chat.
   */
  const [input, setInput] = useState("");
  /**
   * State variable to handle loading states.
   */
  const [loading, setLoading] = useState(false);

  /**
   * State variable for the global financial context setting.
   */
  const [enableGlobalFinancialContext, setEnableGlobalFinancialContext] =
    useState<boolean>(false);

  /**
   * Function to send a message to the AI.
   *
   * @param message - The message to send.
   */
  const sendMessage = async (message: string) => {
    // increment the question asked metrics in mixpanel
    mixPanelClient.trackEventOfType(eventNames.ASK_SOLOMON_AI_ACTION_EVENT, {
      userID: userAccount.userAccountID,
      time: new Date().toDateString(),
      metaData: {
        userName: `${userAccount.username}`,
        tags: `${userAccount.tags}`,
      },
    });

    setLoading(true);
    let questionContext: string = context ?? JSON.stringify(context).trim();
    const globalContext =
      globalFinancialContext ?? JSON.stringify(globalFinancialContext).trim();
    const promptGenerator = new PromptContext(
      globalFinancialContext,
      userAccount,
    );
    let contextDrivenQuestion: string = "";

    if (enableGlobalFinancialContext) {
      // use financial context
      contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
        message,
        globalContext,
      );
    } else {
      contextDrivenQuestion = promptGenerator.getFinancialContextBasedPrompt(
        message,
        questionContext,
      );
    }

    const newMessages = [
      ...messages,
      { role: "user", content: message } as ChatGPTMessage,
    ];

    setMessages(newMessages);
    const last10messages = [
      ...newMessages.slice(-5),
      { role: "user", content: contextDrivenQuestion } as ChatGPTMessage,
    ]; // remember last 2 messages

    // TODO: wrap around a try catch block
    const data = await handler({
      last10messages: last10messages,
      user: userName,
      financialContext: context,
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
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost">
          <BrainCircuit className="h-6 w-6 bg-white text-black font-bold rounded-md p-1" />
        </Button>
      </DialogTrigger>
      <DialogContent
        className={cn(
          "p-5 h-[32rem] max-w-3xl border-4 border-gray-200 rounded-2xl flex flex-col justify-between md:p-20 overflow-y-auto",
          className,
        )}
      >
        <div className="grid gap-4 py-4 h-fit ">
          <ScrollArea className="flex flex-col w-full">
            {messages.map(({ content, role }, index) => (
              <ChatLine key={index} role={role} content={content} />
            ))}
            {loading && <LoadingChatLine />}{" "}
            <div>
              {" "}
              {initialAnalyticMessage.length < 2 && (
                <>
                  <span className="mx-auto flex flex-grow text-gray-600 dark:text-gray-300 clear-both">
                    Type a message to start the conversation
                  </span>
                  <div className="flex items-center space-x-2 py-3">
                    <Switch
                      id="terms"
                      className="rounded-full"
                      onClick={() => {
                        setEnableGlobalFinancialContext(
                          !enableGlobalFinancialContext,
                        );
                      }}
                    />
                    <label
                      htmlFor="terms"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Enable Financial Global Context
                    </label>
                  </div>
                </>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="w-fit flex items-center justify-center z-10">
          <div className="w-full flex flex-col">
            <div className="grid grid-cols-2 gap-2">
              {sampleQuestions.map((question, index) => (
                <Card
                  className="p-2 rounded-lg shadow-md bg-white flex flex-row gap-1"
                  key={index}
                >
                  <div className="p-2 rounded-lg">
                    <BrainCog className="h-6 w-6 text-black" />
                  </div>
                  <CardTitle
                    className="text-xs py-1"
                    onClick={() => setInput(question)}
                  >
                    {question}
                  </CardTitle>
                </Card>
              ))}
            </div>
            <InputMessage
              input={input}
              setInput={setInput}
              sendMessage={sendMessage}
            />
            <p className="text-xs p-2 font-bold">
              Solomon AI may produce inaccurate information about people,
              places, or facts.{" "}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { AskMelodiyAILayout };
