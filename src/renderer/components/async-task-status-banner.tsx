import XMarkIcon from "@heroicons/react/20/solid/XMarkIcon";
import React, { Component, useEffect } from "react";
import { useDispatch } from "react-redux";
import { cn } from "src/lib/utils";

interface AsyncTaskStatusBannerProps {
  className?: string;
  taskId: string;
}

export const AsyncTaskStatusBanner: React.FC<AsyncTaskStatusBannerProps> = ({
  className,
  taskId,
}) => {
  const dispatch = useDispatch();

  // return if the task id is empty
  if (taskId === "") {
    return null;
  }

  useEffect(() => {
    // Start polling
    const interval = setInterval(() => {
      // here we query the backend to see if the task has completed
      // and if it has the banner should outline that success has been achieved
      // to do this, we need to set a value to a global variable indicating
      // batch operation is completed
      //
      // dispatch(checkTaskStatus(taskId));
      //
      // const handleAddTask = () => {
      //   dispatch(addAsyncTask({ taskstatus: "In Progress", taskid: "task1" }));
      // };
    }, 5000); // Poll every 5 seconds

    // Clean up the interval on unmount
    return () => clearInterval(interval);
  }, [dispatch]);

  return (
    <div
      className={cn(
        "flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1",
        className
      )}
    >
      <p className="text-sm leading-6 text-white">
        <a href="#">
          <strong className="font-semibold">GeneriCon 2023</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-0.5 w-0.5 fill-current"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
          Join us in Denver from June 7 – 9 to see what’s coming next&nbsp;
          <span aria-hidden="true">&rarr;</span>
        </a>
      </p>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          className="-m-3 p-3 focus-visible:outline-offset-[-4px]"
        >
          <span className="sr-only">Dismiss</span>
          <XMarkIcon className="h-5 w-5 text-white" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};
