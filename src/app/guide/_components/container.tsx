"use client";

import api from "@/service/api";
import { useConfig } from "@/store/config";
import { format } from "date-fns";
import { EllipsisIcon, PlusIcon, TimerIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateModal from "./create-modal";

interface IReminder {
  id: string;
  created_at: string;
  userid: string;
  reminder_time: string;
  title: string;
}

interface ISchedule {
  id: string;
  created_at: string;
  userid: string;
  time: string;
  repeating_day: string[] | null;
  starting_date: string;
  title: string;
}

export default function Container() {
  const { config } = useConfig()();

  const [isLoadingSchedules, setIsLoadingSchedules] = useState<boolean>(false);
  const [reminders, setReminders] = useState<IReminder[]>([]);
  const [schedules, setSchedules] = useState<ISchedule[]>([]);

  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

  const handleGetSchedules = () => {
    setIsLoadingSchedules(true);
    setReminders([]);
    setSchedules([]);

    api.get(`/schedules/user/${config?.id}`).then((res) => {
      setReminders(res.data?.reminders);
      setSchedules(res.data?.schedules);
      setIsLoadingSchedules(false);
    });
  };

  useEffect(() => {
    if (config?.id) {
      handleGetSchedules();
    }
  }, [config?.id]);

  return (
    <>
      <section className="relative min-h-screen w-full bg-[#F2F2F2] pt-12">
        <div className="h-[72px] px-4">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-black">Guide</p>

            <button
              className="rounded-full bg-black p-2"
              onClick={() => setIsOpenCreateModal(true)}
            >
              <PlusIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-120px)] w-full rounded-t-3xl bg-white">
          <div className="px-4 pb-16 pt-6">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="text-base font-semibold text-black">
                  Reminder Overview
                </h4>
              </div>
              {reminders?.map((item, index) => {
                return (
                  <div
                    className="mb-2 rounded-2xl bg-[#147FFF] p-4"
                    key={index}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="mb-8 flex items-center justify-between gap-2">
                        <p className="text-base font-normal text-white">
                          {item?.title ?? "-"}
                        </p>
                        <button>
                          <EllipsisIcon className="h-6 w-6 text-white" />
                        </button>
                      </div>
                      <div className="flex justify-start">
                        <div className="flex items-center gap-2 rounded-full bg-white/10 p-1 pr-4">
                          <div className="rounded-full border border-white p-1">
                            <TimerIcon className="h-4 w-4 text-white" />
                          </div>
                          <p className="text-xs font-normal text-white">
                            {format(new Date(item?.reminder_time), "HH:mm") ??
                              "-"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
              {reminders?.length === 0 && !isLoadingSchedules && (
                <div className="py-4">
                  <p className="text-center text-sm font-normal text-black">
                    Not Found
                  </p>
                </div>
              )}
              {isLoadingSchedules && (
                <div className="py-4">
                  <p className="text-center text-sm font-normal text-black">
                    Loading...
                  </p>
                </div>
              )}
            </div>
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="text-base font-semibold text-black">
                  Upcoming Schedule
                </h4>
              </div>
              {schedules?.map((item, index) => {
                return (
                  <div
                    className="mb-2 rounded-2xl bg-[#D1D1D1] p-4"
                    key={index}
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div className="mb-8 flex items-center justify-between gap-2">
                        <p className="text-base font-normal text-black">
                          {item?.title ?? "-"}
                        </p>
                        <button>
                          <EllipsisIcon className="h-6 w-6 text-black" />
                        </button>
                      </div>
                      <div className="mb-2 flex justify-start">
                        <div className="flex items-center gap-2 rounded-full bg-white/25 p-1 pr-4">
                          <div className="rounded-full border border-black p-1">
                            <TimerIcon className="h-4 w-4 text-black" />
                          </div>
                          <p className="text-xs font-normal text-black">
                            {format(
                              new Date(`1970-01-01T${item?.time}`),
                              "HH:mm",
                            ) ?? "-"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-start gap-2">
                        {item?.repeating_day?.map((item, index) => {
                          return (
                            <div
                              className="flex items-center gap-2 rounded-full bg-white/25 px-4 py-2"
                              key={index}
                            >
                              <p className="text-xs font-normal text-black">
                                {item ?? "-"}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
              {schedules?.length === 0 && !isLoadingSchedules && (
                <div className="py-4">
                  <p className="text-center text-sm font-normal text-black">
                    Not Found
                  </p>
                </div>
              )}
              {isLoadingSchedules && (
                <div className="py-4">
                  <p className="text-center text-sm font-normal text-black">
                    Loading...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CreateModal
        isOpen={isOpenCreateModal}
        onClose={() => {
          setIsOpenCreateModal(false);
          handleGetSchedules();
        }}
      />
    </>
  );
}
