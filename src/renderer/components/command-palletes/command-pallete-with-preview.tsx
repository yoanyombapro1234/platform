/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import React, { Fragment, useState } from "react";
import { Combobox, Dialog, Transition } from "@headlessui/react";
import { MagnifyingGlassIcon } from "@heroicons/react/20/solid";
import {
  ChartPieIcon,
  RocketLaunchIcon,
  UsersIcon,
} from "@heroicons/react/24/outline";
import { ChevronRightIcon } from "@heroicons/react/20/solid";
import { cn } from "src/lib/utils";
import { Transaction } from "@solomon-ai/component-library";
import { Badge } from "../ui/badge";

export const CommandPalletterWithPreview: React.FC<{
  transactions: Transaction[];
}> = ({ transactions }) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);
  const [selectedTransaction, setSelectedTransaction] = useState(
    transactions[0]
  );

  const filteredTransactions =
    query === ""
      ? []
      : transactions.filter((txn) => {
          return (
            txn.merchantName &&
            txn.merchantName.toLowerCase().includes(query.toLowerCase())
          );
        });

  const recent =
    transactions.length > 5 ? transactions.slice(0, 5) : transactions;

  return (
    <Transition.Root
      show={open}
      as={Fragment}
      afterLeave={() => setQuery("")}
      appear
    >
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-25 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 w-screen overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="mx-auto max-w-3xl transform divide-y divide-gray-100 overflow-hidden rounded-xl bg-white shadow-2xl ring-1 ring-black ring-opacity-5 transition-all">
              <Combobox
                value={selectedTransaction}
                onChange={setSelectedTransaction}
              >
                {({ activeOption }) => (
                  <>
                    <div className="relative">
                      <MagnifyingGlassIcon
                        className="pointer-events-none absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <Combobox.Input
                        className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm"
                        placeholder="Search for people..."
                        onChange={(event) => setQuery(event.target.value)}
                      />
                    </div>

                    {(query === "" || filteredTransactions.length > 0) && (
                      <Combobox.Options
                        as="div"
                        static
                        hold
                        className="flex transform-gpu divide-x divide-gray-100"
                      >
                        <div
                          className={cn(
                            "max-h-96 min-w-0 flex-auto scroll-py-4 overflow-y-auto px-6 py-4",
                            activeOption !== undefined && "sm:h-96"
                          )}
                        >
                          {query === "" && (
                            <h2 className="mb-4 mt-2 text-xs font-semibold text-gray-500">
                              Recent searches
                            </h2>
                          )}
                          <div className="-mx-2 text-sm text-gray-700">
                            {(query === "" ? recent : filteredTransactions).map(
                              (txn) => (
                                <Combobox.Option
                                  as="div"
                                  key={txn.id}
                                  value={txn}
                                  className={({ active }) =>
                                    cn(
                                      "flex cursor-default select-none items-center rounded-md p-2",
                                      active && "bg-gray-100 text-gray-900"
                                    )
                                  }
                                >
                                  {({ active }) => (
                                    <>
                                      <RocketLaunchIcon className="h-6 w-6 flex-none rounded-full" />
                                      <span className="ml-3 flex-auto truncate">
                                        {txn.merchantName}
                                      </span>
                                      {active && (
                                        <ChevronRightIcon
                                          className="ml-3 h-5 w-5 flex-none text-gray-400"
                                          aria-hidden="true"
                                        />
                                      )}
                                    </>
                                  )}
                                </Combobox.Option>
                              )
                            )}
                          </div>
                        </div>

                        <ActiveOptionDetails
                          activeOption={activeOption as Transaction}
                        />
                      </Combobox.Options>
                    )}

                    {query !== "" && filteredTransactions.length === 0 && (
                      <div className="px-6 py-14 text-center text-sm sm:px-14">
                        <UsersIcon
                          className="mx-auto h-6 w-6 text-gray-400"
                          aria-hidden="true"
                        />
                        <p className="mt-4 font-semibold text-gray-900">
                          No people found
                        </p>
                        <p className="mt-2 text-gray-500">
                          We couldn’t find anything with that term. Please try
                          again.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

const ActiveOptionDetails: React.FC<{
  activeOption: Transaction | null;
}> = ({ activeOption }) => {
  if (activeOption === null) {
    return null;
  }

  return (
    <div className="hidden h-96 w-1/2 flex-none flex-col divide-y divide-gray-100 overflow-y-auto sm:flex">
      <div className="flex-none p-6 text-center">
        <ChartPieIcon className="mx-auto h-16 w-16 rounded-full" />

        <p className="text-sm leading-6 text-gray-500">
          ${activeOption.amount}
        </p>
      </div>
      <div className="flex flex-auto flex-col justify-between p-6">
        <dl className="grid grid-cols-1 gap-x-6 gap-y-3 text-sm text-gray-700">
          <dt className="col-end-1 font-semibold text-gray-900">
            Authorized Date
          </dt>
          <dd>{activeOption.authorizedDate}</dd>
          <dt className="col-end-1 font-semibold text-gray-900">Merchant</dt>
          <dd className="truncate">
            <p className="text-black font-bold leading-6">
              {activeOption.merchantName}
            </p>
          </dd>
          <dt className="col-end-1 font-semibold text-gray-900">Categories</dt>
          <dd className="truncate flex flex-wrap gap-2">
            {activeOption.categories &&
              activeOption.categories.map((category) => (
                <Badge className="text-white">{category}</Badge>
              ))}
          </dd>
        </dl>
      </div>
    </div>
  );
};

export default ActiveOptionDetails;
