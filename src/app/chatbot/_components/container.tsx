/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import api from "@/service/api";
import { ArrowLeftIcon, SendIcon, XIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useSpeechRecognition } from "react-speech-kit";
import { toast } from "sonner";

interface IMessage {
  id: number;
  message: string;
  sender: "user" | "elda";
}

export default function Container() {
  const form = useForm();

  const listRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // @ts-ignore
      form.setValue("message", result);
    },
  });

  const handleGetMessages = (message: string, sender: "user" | "elda") => {
    setMessages([
      ...messages,
      {
        id: messages.length ? messages.length + 1 : 1,
        message: form.watch("message"),
        sender: "user",
      },
      {
        id: messages.length ? messages.length + 1 : 1,
        message: message,
        sender: sender,
      },
    ]);

    if (sender === "elda") {
      form.setValue("message", "");
    }
  };

  const handleSubmit = () => {
    if (!form.watch("message")?.length) {
      toast.error("Please enter a message");
      return;
    }

    setIsLoading(true);
    const body = {
      text: form.watch("message"),
    };

    api
      .post("/api/process-speech", body)
      .then((res) => {
        setIsLoading(false);
        handleGetMessages(res?.data?.message, "elda");
      })
      .catch(() => {
        toast.error("Sorry, something went wrong");
        setIsLoading(false);
      });
  };

  useEffect(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <section className="h-screen w-full bg-white">
      <div className="flex items-center gap-2 bg-white px-2 pb-2 pt-12">
        <Link href="/">
          <button className="p-2">
            <ArrowLeftIcon className="h-5 w-5 text-black" />
          </button>
        </Link>
        <h4 className="text-base font-semibold text-black">AI Assistance</h4>
      </div>
      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center justify-center">
          <div className="h-32 w-32 rounded-full border-2 border-[#0D6BDC] bg-white">
            <video
              src="/assets/onboard/elda-moving.mp4"
              autoPlay
              muted
              loop
              className="h-full w-full rounded-full object-cover"
            />
          </div>
        </div>
        <div
          className="mt-12 h-[380px] w-full"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            ref={listRef}
            className="h-full overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-col gap-4">
              <div className="flex justify-start">
                <div className="flex max-w-[85%] items-start gap-2">
                  <div>
                    <Image
                      src="/assets/onboard/bot.svg"
                      alt="profile"
                      width={240}
                      height={240}
                      className="h-8 min-h-8 w-8 min-w-8"
                    />
                  </div>
                  <div className="rounded-lg rounded-tl-none bg-[#F7F7F7] p-4">
                    <p className="text-xs font-medium leading-5 text-black">
                      Hello, how can I help you today?
                    </p>
                  </div>
                </div>
              </div>
              {messages?.map((item, index) => {
                if (item.sender === "user") {
                  return (
                    <div className="flex justify-end" key={index}>
                      <div className="flex max-w-[85%] items-start gap-2">
                        <div className="rounded-lg rounded-tr-none bg-[#147FFF]/10 p-4">
                          <p className="text-xs font-medium leading-5 text-[#147FFF]">
                            {item?.message}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div className="flex justify-start" key={index}>
                    <div className="flex max-w-[85%] items-start gap-2">
                      <div>
                        <Image
                          src="/assets/onboard/bot.svg"
                          alt="profile"
                          width={240}
                          height={240}
                          className="h-8 min-h-8 w-8 min-w-8"
                        />
                      </div>
                      <div className="rounded-lg rounded-tl-none bg-[#F7F7F7] p-4">
                        <p className="text-xs font-medium leading-5 text-black">
                          {item?.message}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full">
        <div className="w-full p-4 pb-8">
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              className="text-normal w-full rounded-full border border-gray-300 bg-[#F7F7F7] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
              placeholder="Type to message elda... "
              {...form.register("message")}
              disabled={isLoading}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
            <button
              disabled={isLoading}
              onClick={() => {
                if (listening) {
                  stop();
                }

                if (!form.watch("message")?.length && !listening) {
                  listen({ lang: "en-US" });
                  return;
                }

                handleSubmit();
              }}
            >
              {listening ? (
                <div className="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full bg-[#0D6BDC]">
                  <XIcon className="h-5 min-h-5 w-5 min-w-5 text-white" />
                </div>
              ) : !form.watch("message")?.length ? (
                <Image
                  src="/assets/onboard/btn-voice.svg"
                  alt="mic"
                  width={240}
                  height={240}
                  className="h-10 min-h-10 w-10 min-w-10"
                />
              ) : (
                <div className="flex h-10 min-h-10 w-10 min-w-10 items-center justify-center rounded-full bg-[#0D6BDC]">
                  <SendIcon className="h-5 min-h-5 w-5 min-w-5 text-white" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
