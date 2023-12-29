import { PlusCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Dialog, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "src/lib/utils";
import { SmartGoal } from "@solomon-ai/component-library";
import { HeaderSectionSimple } from "../header-sections/header-section-simple";
import { Fragment, useState } from "react";
import { Label } from "../ui/label";
import { useAppSelector } from "src/redux/store/hooks";
import {
  selectBankAccounts,
  selectCurrentUserAccount,
  selectUserFinancialContext,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { toast } from "../ui/use-toast";
import NotificationComponent from "../notification/notifcation";
import { selectCurrentSocialProfile } from "../../redux/slice/authentication/AuthenticationSelector";
import { applicationEnvConfigs } from "src/env/client";
import { MultiStepSmartGoalForm } from "../form/create-smart-goal-form/CreateSmartGoalForm";

const goalQuotes: string[] = [
  `"Set your goals high, and don't stop until you get there." - Bo Jackson`,
  `"Your goals are the road maps that guide you and show you what is possible for your life." - Les Brown`,
  `"The future belongs to those who believe in the beauty of their dreams." - Eleanor Roosevelt`,
  `"Success is not final, failure is not fatal: It is the courage to continue that counts." - Winston Churchill`,
  `"A dream becomes a goal when action is taken toward its achievement." - Bo Bennett`,
  `"The greater danger for most of us lies not in setting our aim too high and falling short, but in setting our aim too low and achieving our mark." - Michelangelo`,
  `"You are never too old to set another goal or to dream a new dream." - C.S. Lewis`,
  `"Goals may give focus, but dreams give power." - John Maxwell`,
  `"The only limit to our realization of tomorrow will be our doubts of today." - Franklin D. Roosevelt`,
  `"Success is stumbling from failure to failure with no loss of enthusiasm." - Winston Churchill`,
  `"The journey of a thousand miles begins with one step." - Lao Tzu`,
  `"Believe you can, and you're halfway there." - Theodore Roosevelt`,
  `"You miss 100% of the shots you don't take." - Wayne Gretzky`,
  `"Don't watch the clock; do what it does. Keep going." - Sam Levenson`,
  `"The best way to predict the future is to create it." - Peter Drucker`,
  `"A goal without a plan is just a wish." - Antoine de Saint-Exupéry`,
  `"Dreams can become a reality when we possess a vision, a plan, and the courage to chase that vision relentlessly." - Walt Disney`,
  `"What you get by achieving your goals is not as important as what you become by achieving your goals." - Zig Ziglar`,
  `"Success is not the key to happiness. Happiness is the key to success. If you love what you are doing, you will be successful." - Albert Schweitzer`,
  `"Your time is limited, don't waste it living someone else's life." - Steve Jobs`,
];

const CreateGoalButton: React.FC<{
  className?: string;
}> = ({ className }) => {
  // if the goal feature is disabled just return null
  if (!applicationEnvConfigs.REACT_APP_FEATURE_FLAG_ENABLE_GOALS) {
    return null;
  }

  function getRandomGoalQuote(): string {
    const randomIndex = Math.floor(Math.random() * goalQuotes.length);
    return goalQuotes[randomIndex];
  }

  const quote = getRandomGoalQuote();
  const [openGoalCreation, setOpenGoalCreation] = useState(false);

  return (
    <Button
      variant={"ghost"}
      className={cn("flex flex-row gap-1 w-fit justify-start my-1", className)}
      onClick={() => {
        setOpenGoalCreation(!openGoalCreation);
      }}
    >
      <PlusCircle className="w-4 h-4 mr-1" />
      <Label className="font-bold">Create Goal</Label>
      <CreateGoalExperience
        open={openGoalCreation}
        setOpen={setOpenGoalCreation}
      />
    </Button>
  );
};

export const CreateGoalExperience: React.FC<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ open, setOpen }) => {
  function getRandomGoalQuote(): string {
    const randomIndex = Math.floor(Math.random() * goalQuotes.length);
    return goalQuotes[randomIndex];
  }

  const quote = getRandomGoalQuote();
  const bankAccounts = useAppSelector(selectBankAccounts);
  const userSocialProfile = useAppSelector(selectCurrentSocialProfile);
  const financialContext = useAppSelector(selectUserFinancialContext);
  const userAccount = useAppSelector(selectCurrentUserAccount);

  const callback = (goal: SmartGoal) => {
    setShowNotification(true);
    toast({
      title: "Successfuly Created Goal 🎉🎉🎉🎉",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          Lets Go!! 🎉🎉
        </pre>
      ),
    });
  };

  const [showNotification, setShowNotification] = useState(false);

  return (
    <>
      <Transition.Root show={open} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={setOpen}>
          <Transition.Child
            as={Fragment}
            enter="ease-in-out duration-500"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in-out duration-500"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 transition-opacity bg-gray-100 bg-opacity-95" />
          </Transition.Child>
          <div className="fixed inset-0" />

          <div className="fixed inset-0 overflow-hidden">
            <div className="absolute inset-0 overflow-hidden">
              <div className="fixed inset-y-0 right-0 flex max-w-full pl-10 pointer-events-none sm:pl-16">
                <Transition.Child
                  as={Fragment}
                  enter="transform transition ease-in-out duration-500 sm:duration-700"
                  enterFrom="translate-x-full"
                  enterTo="translate-x-0"
                  leave="transform transition ease-in-out duration-500 sm:duration-700"
                  leaveFrom="translate-x-0"
                  leaveTo="translate-x-full"
                >
                  <Dialog.Panel className="w-screen max-w-6xl pointer-events-auto">
                    {showNotification && (
                      <NotificationComponent
                        title="Successfuly Created Goal 🎉🎉🎉🎉"
                        message={"One step closer to your dreams"}
                        actions={undefined}
                      />
                    )}
                    <form className="flex flex-col h-full overflow-y-scroll bg-white shadow-xl">
                      <div className="flex-1">
                        {/* Header */}
                        <div className="px-4 py-6 bg-gray-50 sm:px-6">
                          <div className="flex items-start justify-between space-x-3">
                            <div className="space-y-1">
                              <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                                Dare to be great, one goal at a time
                              </Dialog.Title>
                              <p className="text-sm text-gray-500">
                                Create A Smart Goal With Solomon AI
                              </p>
                            </div>
                            <div className="flex items-center h-7">
                              <button
                                type="button"
                                className="relative text-gray-400 hover:text-gray-500"
                                onClick={() => setOpen(false)}
                              >
                                <span className="absolute -inset-2.5" />
                                <span className="sr-only">Close panel</span>
                                <XMarkIcon
                                  className="w-6 h-6"
                                  aria-hidden="true"
                                />
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Divider container */}
                        <div className="py-6 space-y-6 sm:space-y-0 sm:divide-y sm:divide-gray-200 sm:py-0">
                          {/* Project name */}
                          <HeaderSectionSimple
                            title={"Smart Goal With Solomon AI"}
                            description={quote}
                            theme={"dark"}
                            className="w-full py-5 border-0 rounded-none shadow-none sm:py-10"
                          />
                          <div className="p-5">
                            <MultiStepSmartGoalForm
                              callback={callback}
                              className="border-0 shadow-none"
                              bankAccounts={bankAccounts}
                              userName={userSocialProfile.name}
                              userProfileImage={
                                userSocialProfile.profileImageUrl
                              }
                              globalFinancialContext={financialContext}
                              userAccount={userAccount}
                              userId={""}
                              apiToken={""}
                              model={"gpt-3.5-turbo"}
                              temperature={0}
                              top_p={0}
                              frequency_penalty={0}
                              presence_penalty={0}
                              max_tokens={0}
                            />
                          </div>
                        </div>
                      </div>
                    </form>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  );
};

export { CreateGoalButton };
