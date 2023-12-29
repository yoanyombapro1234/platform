import clsx from "clsx";
import Balancer from "react-wrap-balancer";
import { ChatGPTMessage } from "src/lib-utils/Stream";
import { Mic, MicOff } from "lucide-react";
import { useEffect, useState } from "react";

// wrap Balancer to remove type errors :( - @TODO - fix this ugly hack
/* eslint-disable  @typescript-eslint/no-explicit-any */
const BalancerWrapper = (props: any) => <Balancer {...props} />;

// loading placeholder animation for the chat line
export const LoadingChatLine = () => (
  <div className="flex min-w-full px-4 py-5 animate-pulse sm:px-6">
    <div className="flex flex-grow space-x-3">
      <div className="flex-1 min-w-0">
        <p className="font-bold text-gray-900 text-xxl">
          <a href="#" className="hover:underline">
            Solomon AI
          </a>
        </p>
        <div className="pt-4 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="h-2 col-span-2 rounded bg-zinc-500"></div>
            <div className="h-2 col-span-1 rounded bg-zinc-500"></div>
          </div>
          <div className="h-2 rounded bg-zinc-500"></div>
        </div>
      </div>
    </div>
  </div>
);

// util helper to convert new lines to <br /> tags
const convertNewLines = (text: string) =>
  text.split("\n").map((line, i) => (
    <span key={i}>
      {line}
      <br />
    </span>
  ));

export function ChatLine({ role = "assistant", content }: ChatGPTMessage) {
  const [speechState, setSpeechState] = useState<
    "speaking" | "paused" | "stopped"
  >("stopped");
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceIndex, setSelectedVoiceIndex] = useState<number | null>(
    null,
  ); // Index of the selected voice

  useEffect(() => {
    if ("speechSynthesis" in window) {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      // Optionally, set a default voice. Here, we're setting the first voice as default.
      if (availableVoices.length > 0 && availableVoices[8]) {
        setSelectedVoiceIndex(8);
      }
    }
  }, []);

  const formatteMessage = convertNewLines(content);
  const msg = new SpeechSynthesisUtterance();
  msg.lang = "en-US";
  if (selectedVoiceIndex !== null && voices[selectedVoiceIndex]) {
    msg.voice = voices[selectedVoiceIndex];
    msg.pitch = 0.9;
    msg.rate = 0.6;
    msg.volume = 1;
  }

  const speechHandler = (data: string) => {
    switch (speechState) {
      case "stopped":
        msg.text = data;
        window.speechSynthesis.speak(msg);
        setSpeechState("speaking");
        break;
      case "speaking":
        window.speechSynthesis.pause();
        setSpeechState("paused");
        break;
      case "paused":
        window.speechSynthesis.resume();
        setSpeechState("speaking");
        break;
    }
  };

  if (!content) {
    return null;
  }

  return (
    <div
      className={
        role != "assistant" ? "float-right clear-both" : "float-left clear-both"
      }
    >
      <div className="float-right px-4 py-5 mb-5 bg-white border rounded-lg shadow-sm ring-1 ring-zinc-100 dark:text-gray-600 sm:px-6">
        <div className="flex space-x-3">
          <div className="flex-1 gap-4">
            <div className="flex flex-row gap-2">
              {role === "assistant" ? <p className="text-md">🤖</p> : ""}
              <p className="font-semibold text-gray-900 text-md">
                <a href="#" className="hover:underline">
                  {role == "assistant" ? "Solomon AI" : "You"}
                </a>
              </p>
              {role == "assistant" && (
                <div>
                  {speechState === "speaking" ? (
                    <MicOff
                      className="w-4 h-4 pt-1"
                      onClick={() => speechHandler(content)}
                    />
                  ) : speechState === "paused" ? (
                    <Mic
                      className="w-4 h-4 pt-1"
                      onClick={() => speechHandler(content)}
                    />
                  ) : (
                    <Mic
                      className="w-4 h-4 pt-1"
                      onClick={() => speechHandler(content)}
                    />
                  )}
                </div>
              )}
            </div>

            <p
              className={clsx(
                "text-sm",
                role == "assistant"
                  ? "font-base"
                  : "text-gray-400 dark:text-gray-600",
              )}
            >
              <BalancerWrapper>{formatteMessage}</BalancerWrapper>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
