import { Fragment } from "react";
import { Disclosure, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  FolderPlusIcon,
  PuzzlePieceIcon,
  QuestionMarkCircleIcon,
  RectangleGroupIcon,
  UserIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { cn, isAccountInViolation } from "src/lib/utils";
import { routes } from "src/constant/routes";
import { Link, useNavigate } from "react-router-dom";
import { useAppSelector } from "src/redux/store/hooks";
import {
  selectAuthenticated,
  selectCurrentSocialProfile,
  selectCurrentUserAccount,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import { LogoutButton } from "../button/logout-button";

import { Logo } from "src/components/Logo";
import { constants } from "src/constant/constants";
import { CreateGoalButton } from "../button/create-goal-button";
import { RocketIcon } from "lucide-react";
import { DeleteUserButton } from "../button/delete-user-button";
import { Button } from "../ui/button";

const navigation = [
  {
    name: "Financial Portal",
    href: routes.FINANCIALPORTAL,
    icon: PuzzlePieceIcon,
  },
  { name: "Ask Solomon", href: routes.HOME, icon: QuestionMarkCircleIcon },
  { name: "My Profile", href: routes.PROFILE, icon: UserIcon },
];

const Nav: React.FC<{}> = () => {
  const userProfile = useAppSelector(selectCurrentSocialProfile);
  const userAccount = useAppSelector(selectCurrentUserAccount);
  const financialProfile = useAppSelector(selectUserFinancialProfile);
  const isAuthenticated = useAppSelector(selectAuthenticated);
  const history = useNavigate();

  const valid =
    // financialProfile.link !== undefined &&
    // financialProfile.link.length > 0 &&
    financialProfile.stripeSubscriptions !== undefined && isAuthenticated;

  // do not show the navigation bar if the user has the following conditions
  // 1. user is not logged in
  // 2. user does not have a subscription
  // 3. user does not have a connected account
  const hasViolation = isAccountInViolation(userAccount, financialProfile);
  if (hasViolation && !valid) {
    return null;
  }

  return (
    <Disclosure as="nav" className="bg-white">
      {({ open }) => (
        <>
          <div className="px-2 mx-auto max-w-8xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                {/* Mobile menu button*/}
                <Disclosure.Button className="relative inline-flex items-center justify-center p-2 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                  <span className="absolute -inset-0.5" />
                  <span className="sr-only">Open main menu</span>
                  {open ? (
                    <XMarkIcon className="block w-6 h-6" aria-hidden="true" />
                  ) : (
                    <Bars3Icon className="block w-6 h-6" aria-hidden="true" />
                  )}
                </Disclosure.Button>
              </div>
              <div className="m-[3%] flex items-center justify-center flex-1 sm:items-stretch sm:justify-start">
                <div className="flex items-center flex-shrink-0 gap-2">
                  <Link to="/financial-portal" aria-label="Home">
                    <Logo />
                  </Link>
                </div>
                <div className="hidden sm:ml-6 sm:block">
                  <div className="flex justify-between flex-1 p-3 pt-4 space-x-4 rounded-2xl">
                    {navigation.map((item) => (
                      <Link
                        key={item.name}
                        to={item.href}
                        className={cn(
                          "flex flex-row gap-2 bg-white text-black rounded-md px-3 my-4 text-sm font-bold"
                        )}
                      >
                        <item.icon className="w-6 h-6" />
                        {item.name}
                      </Link>
                    ))}

                    <Button
                      className={cn(
                        "flex flex-row gap-2 bg-white text-black rounded-md px-3 m-2 text-sm font-bold"
                      )}
                      onClick={() => {
                        history(routes.USER_FEEDBACK_EXTERNAL_URL);
                      }}
                      variant={"ghost"}
                    >
                      <RectangleGroupIcon className="w-6 h-6" />
                      Feedback
                    </Button>

                    {/* <div className="flex flex-row justify-end gap-2 my-1">
                      <CreateGoalButton className="px-2 text-xs text-black" />
                    </div> */}
                  </div>
                </div>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                <button
                  type="button"
                  className="relative p-1 bg-white rounded-full text- hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="absolute -inset-1.5" />
                  <span className="sr-only">View notifications</span>
                </button>
                {/* <ConnectPlaidAccountButton
                  title={"Connect Another account"}
                  className="hidden font-bold text-black bg-white sm:block"
                /> */}

                {/* Profile dropdown */}
                <Menu as="div" className="relative ml-3">
                  <div>
                    <Menu.Button className="relative flex text-sm rounded-full bg-white-800 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="absolute -inset-1.5" />
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="w-8 h-8 rounded-full"
                        src={userProfile.profileImageUrl}
                        alt=""
                      />
                    </Menu.Button>
                  </div>
                  <Transition
                    as={Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute right-0 z-10 w-48 py-1 mt-2 origin-top-right bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                      <Menu.Item>
                        {({ active }) => (
                          <a
                            href={constants.PAYMENT_PORTAL_LINK}
                            className={cn(
                              active ? "bg-gray-100" : "",
                              "block px-4 py-2 text-sm text-gray-700 pb-5 font-bold"
                            )}
                          >
                            My Payment Portal
                          </a>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <Button
                            className={cn(
                              "flex flex-row gap-2 bg-white text-black rounded-md px-4 py-2 pb-5 text-sm font-bold"
                            )}
                            variant={"ghost"}
                            onClick={() => {
                              history(routes.USER_FEEDBACK_EXTERNAL_URL);
                            }}
                          >
                            <RectangleGroupIcon className="w-6 h-6" />
                            Feedback
                          </Button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          // <a
                          //   href="#"
                          //   className={cn(
                          //     active ? "bg-gray-100" : "",
                          //     "block px-4 py-2 text-sm text-gray-700"
                          //   )}
                          // >
                          //   Sign out
                          // </a>
                          <LogoutButton active={active} />
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <div className="py-2">
                            <DeleteUserButton active={active} />
                          </div>
                        )}
                      </Menu.Item>
                    </Menu.Items>
                  </Transition>
                </Menu>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={cn(
                    "flex flex-row gap-2 bg-black text-white block rounded-md px-3 py-2 text-base font-medium"
                  )}
                >
                  <item.icon className="w-6 h-6" />

                  {item.name}
                </Disclosure.Button>
              ))}
              {/* <ConnectPlaidAccountButton
                title={"Connect Another account"}
                className="justify-start w-full mx-auto text-base font-medium bg-black"
              /> */}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
};

export { Nav };
