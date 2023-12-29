import { XMarkIcon } from "@heroicons/react/20/solid";
import { Card } from "../ui/card";
import { Button } from "../ui/button";

export default function NotificationBanner({
  bgColor = "bg-black",
  textColor = "text-white",
  position = "fixed",
  message = "",
  link = "",
  ...props
}) {
  return (
    <Card
      className={`flex items-center justify-between gap-x-6 ${bgColor} px-6 py-2.5`}
      {...props}
    >
      <p className={`text-sm leading-6 ${textColor}`}>
        <a href={link}>
          <strong className="font-semibold">{message}</strong>
          <svg
            viewBox="0 0 2 2"
            className="mx-2 inline h-1.5 w-1.5 fill-current animate-ping"
            aria-hidden="true"
          >
            <circle cx={1} cy={1} r={1} />
          </svg>
        </a>
      </p>
      <Button
        type="button"
        className="-m-3 flex-none p-3 focus-visible:outline-offset-[-4px] bg-black"
      >
        <span className="sr-only text-black">Dismiss</span>
        <XMarkIcon className={`h-5 w-5 ${textColor}`} aria-hidden="true" />
      </Button>
    </Card>
  );
}
