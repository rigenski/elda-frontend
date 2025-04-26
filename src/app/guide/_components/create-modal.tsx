/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";

import api from "@/service/api";
import { cn } from "@/utils/classnames";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const REPEATING_DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const form = useForm();

  const config: any = null;

  const handleCreateSchedule = () => {
    if (
      !form.watch("title") ||
      !form.watch("starting_date") ||
      !form.watch("time")
    ) {
      toast.error("Please enter a memo");
      return;
    }

    const repeatingDays = REPEATING_DAYS.filter((_, index) =>
      form.watch(`repeating_day.${index}`),
    );

    const body = {
      userid: config?.id,
      title: form.watch("title"),
      ...(repeatingDays.length > 0
        ? {
            time: form.watch("time"),
            repeating_day: repeatingDays,
            starting_date: form.watch("starting_date"),
          }
        : {
            reminder_time: `${form.watch("starting_date")} ${form.watch("time")}`,
          }),
    };

    api
      .post(repeatingDays.length > 0 ? "/schedules" : "/reminder", body)
      .then(() => {
        toast.success("Schedule created successfully");
        form.setValue("title", "");
        form.setValue("time", "");
        form.setValue("repeating_day", "");
        form.setValue("reminder_time", "");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to create schedule");
      });
  };

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: isOpen ? "5%" : "100%" }}
      transition={{ ease: "backInOut", duration: 0.5 }}
      className={cn(
        "fixed left-0 top-0 h-screen w-full rounded-t-3xl bg-white shadow-[0_-2px_16px_0px_rgba(0,0,0,0.1)]",
      )}
    >
      <div className="relative h-full w-full">
        <div className="flex items-center justify-between gap-4 p-4">
          <h4 className="text-xl font-semibold text-black">Create Guide</h4>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-black" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1C1B55]">
                Title
              </label>
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
                {...form.register("title")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1C1B55]">
                Starting Date
              </label>
              <input
                type="date"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
                {...form.register("starting_date")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1C1B55]">
                Time
              </label>
              <input
                type="time"
                className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
                {...form.register("time")}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-[#1C1B55]">
                Repeating Day
              </label>
              <div className="flex flex-wrap gap-4">
                {REPEATING_DAYS.map((item, index) => {
                  return (
                    <div className="flex items-center gap-2" key={index}>
                      <input
                        type="checkbox"
                        {...form.register(`repeating_day.${index}`)}
                      />
                      <p className="text-sm font-normal text-[#1C1B55]">
                        {item}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
            <button
              className="rounded-2xl bg-[#0D6BDC] px-8 py-4"
              onClick={handleCreateSchedule}
            >
              <p className="text-sm font-semibold text-white">Save</p>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
