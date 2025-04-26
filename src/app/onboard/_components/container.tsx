/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import api from "@/service/api";
import { SendIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { IQuestion, ONBOARD_QUESTIONS } from "../_consts";
import { useSpeechRecognition } from "react-speech-kit";

interface IMessage {
  id: number;
  message: string;
  type: "user" | "bot";
  field: string;
}

export default function Container() {
  const form = useForm();
  const router = useRouter();

  const listRef = useRef<HTMLDivElement>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(1);
  const [location, setLocation] = useState<{
    lat: number | null;
    lon: number | null;
  }>({ lat: null, lon: null });
  const [currentQuestion, setCurrentQuestion] = useState<IQuestion | null>(
    null,
  );
  const [messages, setMessages] = useState<IMessage[]>([]);

  const { listen, listening, stop } = useSpeechRecognition({
    onResult: (result) => {
      // @ts-ignore
      form.setValue("message", result);
    },
  });

  const handleRegister = () => {
    const userRegister = JSON.parse(
      typeof window !== "undefined"
        ? (localStorage.getItem("user-register") ?? "{}")
        : "{}",
    );

    const age = messages.find((item) => item.field === "age");
    const gender = messages.find((item) => item.field === "gender");
    const medication = messages.find((item) => item.field === "medication");
    const emergency = messages.find((item) => item.field === "emergency");
    const habits = messages.find((item) => item.field === "habits");
    const important_notes = messages.find(
      (item) => item.field === "important_notes",
    );

    const body = {
      name: userRegister?.name,
      email: userRegister?.email,
      password: userRegister?.password,
      age: age?.message,
      gender: gender?.message,
      medication: medication?.message,
      emergency: emergency?.message,
      habits: habits?.message,
      important_notes: important_notes?.message,
      latitude: location?.lat,
      longitude: location?.lon,
    };

    if (userRegister) {
      api
        .post("/auth/register", body)
        .then(() => {
          if (typeof window !== "undefined") {
            localStorage.removeItem("user-register");
          }

          toast.success("Register successfully");

          router.push("/sign-in");
        })
        .catch(() => {
          toast.error("Sorry, something went wrong");
        });
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);

    if (!form.getValues("message")?.length) {
      toast.error("Please enter a message");

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      return;
    }

    setMessages([
      ...messages,
      {
        id: messages.length + 1,
        message: form.watch("message"),
        type: "user",
        field: currentQuestion?.field ?? "",
      },
    ]);
    form.setValue("message", "");

    setTimeout(() => {
      if (progress === ONBOARD_QUESTIONS?.length) {
        return;
      }

      setProgress(progress + 1);
      setIsLoading(false);
    }, 1000);
  };

  useEffect(() => {
    const question = ONBOARD_QUESTIONS?.[progress - 1];

    setCurrentQuestion(question);
    setMessages([
      ...messages,
      {
        id: question?.id,
        message: question?.question,
        type: "bot",
        field: "",
      },
    ]);
  }, [progress]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }

    if (messages?.length === ONBOARD_QUESTIONS?.length * 2) {
      handleRegister();
    }
  }, [messages]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        });
      });
    }
  }, []);

  return (
    <section className="h-screen w-full bg-white pt-12">
      <div className="px-4 pb-8">
        <div>
          <div className="h-2 w-full rounded-full bg-[#D9D9D9]"></div>
          <div
            className="-mt-2 h-2 w-1/3 rounded-full bg-[#0D6BDC]"
            style={{
              width: `${(progress / ONBOARD_QUESTIONS?.length) * 100}%`,
            }}
          ></div>
        </div>
        <div className="mt-8 flex items-center justify-center">
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
          className="mt-12 h-[380px] w-full overflow-hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div
            ref={listRef}
            className="h-full overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <div className="flex flex-col gap-4">
              {messages?.map((item, index) => {
                if (item.type === "user") {
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
          {currentQuestion?.isOption ? (
            <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
              {currentQuestion?.options?.map((item, index) => {
                return (
                  <button
                    className="group rounded-full border border-[#147FFF] bg-white px-4 py-2 hover:bg-[#147FFF]"
                    onClick={() => {
                      form.setValue("message", item);
                      handleSubmit();
                    }}
                    key={index}
                  >
                    <p className="text-sm font-normal text-[#147FFF] group-hover:text-white">
                      {item?.charAt(0).toUpperCase() + item?.slice(1)}
                    </p>
                  </button>
                );
              })}
            </div>
          ) : null}
          <div className="flex w-full items-center gap-2">
            <input
              type="text"
              className="text-normal w-full rounded-full border border-gray-300 bg-[#F7F7F7] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
              placeholder="Type to message elda... "
              {...form.register("message")}
              disabled={isLoading || currentQuestion?.isOption}
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
