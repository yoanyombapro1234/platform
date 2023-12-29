import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { cn } from "src/lib/utils";
import { Button } from "../ui/button";
import { useState } from "react";
import Toast from "../warning-toast";
import { useTriggerSyncEventMutation } from "src/redux/mutations/trigger-sync-event";
import { useAppSelector } from "src/redux/store/hooks";
import {
  selectCurrentUserAccount,
  selectCurrentUserID,
  selectUserFinancialProfile,
} from "src/redux/slice/authentication/AuthenticationSelector";
import {
  FinancialAccountType,
  PollAsyncTaskExecutionRequestClass,
  TaskState,
  TriggerSyncRequestClass,
} from "@solomon-ai/component-library";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { toast } from "../ui/use-toast";
import { usePollAsyncTaskStatusQuery } from "src/redux/queries/async-task/poll-async-task-execution-status";
import React from "react";
import NotificationBanner from "../banner/notification-banner";
import { Spinner } from "../spinner";

const TriggerSyncButton: React.FC<{
  className?: string;
  linkId: string;
  financialAccountType: FinancialAccountType;
}> = ({ className, linkId, financialAccountType }) => {
  const [triggerSyncOperation] = useTriggerSyncEventMutation();
  const [taskId, setTaskId] = useState<string | null>(null);

  const userProfile = useAppSelector(selectCurrentUserAccount);
  const currentUserId = useAppSelector(selectCurrentUserID);
  const financialProfile = useAppSelector(selectUserFinancialProfile);

  const triggerSyncHandler = async () => {
    try {
      const request = {
        userId: currentUserId,
        linkId: linkId,
        financialAccountType: financialAccountType,
        profileType: financialProfile.profileType!,
      };

      const response = await triggerSyncOperation(request).unwrap();

      // extract the task id from the response
      const { taskId } = response;
      setTaskId(taskId);

      toast({
        title: "Successfuly Triggered A Sync Operation 🎉🎉🎉🎉",
        description: (
          <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
            Wait while your data syncs!
          </pre>
        ),
      });
    } catch (err) {
      toast({
        title: `Failed to trigger sync event :( err: ${err}`,
      });
    }
  };

  // show the trigger button if task id is null
  if (taskId === null) {
    return (
      <Button
        className={cn("flex flex-row gap-1 my-3 rounded-lg", className)}
        onClick={triggerSyncHandler}
        variant={"outline"}
      >
        <ArrowPathIcon className="inline-block w-5 h-5 mr-1" />
        <span className="font-bold cursor-pointer">Trigger Sync</span>
      </Button>
    );
  } else {
    return <AsyncTaskPoller taskId={taskId} interval={15000} />;
  }
};

const AsyncTaskPoller: React.FC<{
  taskId: string;
  interval: number;
  onSuccessCallback?: () => void;
}> = ({ taskId, interval, onSuccessCallback }) => {
  const [poll, setPoll] = useState<boolean>(true);
  // Note: we poll every 3 seconds
  const [pollingInterval, setPollingInterval] = React.useState(interval);

  const req = new PollAsyncTaskExecutionRequestClass({
    taskId: taskId,
  });

  const { data, error, isLoading, isFetching, refetch } =
    usePollAsyncTaskStatusQuery(req, {
      pollingInterval,
    });

  const callback = (status: TaskState) => {
    if (status === "TASK_STATE_COMPLETED") {
      setPollingInterval(0);
      setPoll(false);

      if (onSuccessCallback) {
        onSuccessCallback();
      }
    }
  };

  return (
    <div
      style={{
        float: "left",
        textAlign: "center",
        ...(isFetching ? { background: "#e6ffe8" } : {}),
      }}
    >
      {error ? (
        <>
          {toast({
            title: `Failed to trigger sync event due to error :( err: ${error}`,
          })}
        </>
      ) : isLoading ? (
        <>
          {" "}
          <Spinner /> Loading..
        </>
      ) : data ? (
        <>
          <AsyncTaskStatusBanner taskState={data.status} callback={callback} />
        </>
      ) : (
        "No Data"
      )}
    </div>
  );
};

const AsyncTaskStatusBanner: React.FC<{
  taskState: TaskState;
  callback: (status: TaskState) => void;
}> = ({ taskState, callback }) => {
  let message = "";

  switch (taskState) {
    case "TASK_STATE_ACTIVE":
      message = "Your data is still syncing";
      break;
    case "TASK_STATE_PENDING":
      message = "Your date has not started syncing yet";
      break;
    case "TASK_STATE_SCHEDULED":
      message = "Scheduled to be synced";
      break;
    case "TASK_STATE_COMPLETED":
      message = "Sync Completed";
      break;
    case "TASK_STATE_FAILED":
      message = "Sync Failed";
      break;
    default:
      message = "Sync Failed";
      break;
  }

  React.useEffect(() => {
    callback(taskState);
  }, [taskState]);

  return (
    <div className="flex flex-row gap-1 my-3">
      <NotificationBanner message={message} />
    </div>
  );
};

export { TriggerSyncButton, AsyncTaskPoller };
