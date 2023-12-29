import React, { Fragment, useState } from "react";
import { Dialog, Disclosure, Popover, Transition } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import { cn } from "src/lib/utils";
import { Button } from "../ui/button";

export type NavigationItem = {
  name: string;
  description?: string;
  href: string;
  icon: React.ForwardRefExoticComponent<
    Omit<React.SVGProps<SVGSVGElement>, "ref"> & {
      title?: string | undefined;
      titleId?: string | undefined;
    } & React.RefAttributes<SVGSVGElement>
  >;
  current: boolean | undefined;
};

export interface HeaderWithStackedFlyoutMenuProps {
  products: NavigationItem[];
  callsToAction: NavigationItem[];
  logoSrc: string;
  headerTitle?: string;
  dropdownTitle?: string;
  headerOptions?: NavigationItem[];
  headerActionButtonTitle?: string;
  headerActionButtonHandler?: () => void;
}

const HeaderWithStackedFlyoutMenu: React.FC<
  HeaderWithStackedFlyoutMenuProps
> = (props) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        {/* Logo */}
        <div className="flex lg:flex-1">
          <a href="#" className="-m-1.5 p-1.5">
            <img
              className="h-8 w-auto"
              src={props.logoSrc}
              alt={props.headerTitle || "Your Company"}
            />
          </a>
        </div>
        {/* Desktop Navigation */}
        <Popover.Group className="hidden lg:flex lg:gap-x-12">
          <DropDown
            items={props.products}
            dropdownTitle={props.dropdownTitle ?? ""}
          />
          {/* Other Header Options */}
          {props.headerOptions &&
            props.headerOptions.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                {item.name}
              </a>
            ))}
        </Popover.Group>
        {/* Header Action Button */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <Button
            onClick={props.headerActionButtonHandler}
            className="text-sm font-semibold leading-6 text-white"
          >
            {props.headerActionButtonTitle}
          </Button>
        </div>
        {/* Mobile Navigation */}
        <MobileNavigation
          {...props}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </nav>
    </header>
  );
};

interface DropDownProps {
  items: NavigationItem[];
  dropdownTitle: string;
}

const DropDown: React.FC<DropDownProps> = ({ items, dropdownTitle }) => {
  return (
    <Popover className="relative">
      {/* Your JSX code related to the product dropdown */}
      <Popover.Button className="flex items-center gap-x-1 text-sm font-semibold leading-6 text-gray-900">
        {dropdownTitle}
        <ChevronDownIcon
          className="h-5 w-5 flex-none text-gray-400"
          aria-hidden="true"
        />
      </Popover.Button>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-200"
        enterFrom="opacity-0 translate-y-1"
        enterTo="opacity-100 translate-y-0"
        leave="transition ease-in duration-150"
        leaveFrom="opacity-100 translate-y-0"
        leaveTo="opacity-0 translate-y-1"
      >
        <Popover.Panel className="absolute -left-8 top-full z-10 mt-3 w-screen max-w-md overflow-hidden rounded-3xl bg-white shadow-lg ring-1 ring-gray-900/5">
          <div className="p-4">
            {items.map((item) => (
              <div
                key={item.name}
                className="group relative flex items-center gap-x-6 rounded-lg p-4 text-sm leading-6 hover:bg-gray-50"
              >
                <div className="flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                  <item.icon
                    className="h-6 w-6 text-gray-600 group-hover:text-indigo-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex-auto">
                  <a
                    href={item.href}
                    className="block font-semibold text-gray-900"
                  >
                    {item.name}
                    <span className="absolute inset-0" />
                  </a>
                  <p className="mt-1 text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Popover.Panel>
      </Transition>
      {/* Rest of the JSX for dropdown */}
    </Popover>
  );
};

interface MobileNavigationProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  products: NavigationItem[];
  callsToAction: NavigationItem[];
  logoSrc: string;
  headerTitle?: string;
  headerOptions?: NavigationItem[];
  headerActionButtonTitle?: string;
  headerActionButtonHandler?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = (props) => {
  // Extract props for clarity
  const {
    mobileMenuOpen,
    setMobileMenuOpen,
    products,
    callsToAction,
    logoSrc,
    headerTitle,
    headerOptions,
    headerActionButtonTitle,
    headerActionButtonHandler,
  } = props;

  return (
    <Dialog
      as="div"
      className="lg:hidden"
      open={mobileMenuOpen}
      onClose={() => setMobileMenuOpen(false)}
    >
      <div className="fixed inset-0 z-10" />
      <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-white px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
        <div className="flex items-center justify-between">
          <a href="#" className="-m-1.5 p-1.5">
            <span className="sr-only">{headerTitle}</span>
            <img className="h-8 w-auto" src={logoSrc} alt={headerTitle} />
          </a>
          <button
            type="button"
            className="-m-2.5 rounded-md p-2.5 text-gray-700"
            onClick={() => setMobileMenuOpen(false)}
          >
            <span className="sr-only">Close menu</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-6 flow-root">
          <div className="-my-6 divide-y divide-gray-500/10">
            {/* Your Products and Other Navigation Links Here */}
            {/* Other JSX for mobile nav */}
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  <Disclosure as="div" className="-mx-3">
                    {({ open }) => (
                      <>
                        <Disclosure.Button className="flex w-full items-center justify-between rounded-lg py-2 pl-3 pr-3.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50">
                          Product
                          <ChevronDownIcon
                            className={cn(
                              open ? "rotate-180" : "",
                              "h-5 w-5 flex-none",
                            )}
                            aria-hidden="true"
                          />
                        </Disclosure.Button>
                        <Disclosure.Panel className="mt-2 space-y-2">
                          {[...products, ...callsToAction].map((item) => (
                            <Disclosure.Button
                              key={item.name}
                              as="a"
                              href={item.href}
                              className="block rounded-lg py-2 pl-6 pr-3 text-sm font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                            >
                              {item.name}
                            </Disclosure.Button>
                          ))}
                        </Disclosure.Panel>
                      </>
                    )}
                  </Disclosure>
                  {headerOptions &&
                    headerOptions.map((item) => (
                      <a
                        key={item.name}
                        href={item.href}
                        className="block rounded-lg py-2 pl-3 pr-4 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
                      >
                        {item.name}
                      </a>
                    ))}
                </div>
                <div className="py-6">
                  <Button
                    onClick={props.headerActionButtonHandler}
                    className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-white hover:bg-gray-50"
                  >
                    {props.headerActionButtonTitle}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Dialog.Panel>
    </Dialog>
  );
};

export default HeaderWithStackedFlyoutMenu;
