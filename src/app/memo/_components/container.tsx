/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */

"use client";

import api from "@/service/api";
import { format } from "date-fns";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import CreateModal from "./create-modal";
interface IMemo {
  id: string;
  text: string;
  created_at: string;
}

export default function Container() {
  const config: any = null;

  const [isLoadingMemos, setIsLoadingMemos] = useState<boolean>(false);
  const [memos, setMemos] = useState<IMemo[]>([]);

  const [isOpenCreateModal, setIsOpenCreateModal] = useState<boolean>(false);

  const handleGetMemos = () => {
    setIsLoadingMemos(true);
    setMemos([]);

    api.get(`/memos/user/${config?.id}`).then((res) => {
      setMemos(res.data);
      setIsLoadingMemos(false);
    });
  };

  useEffect(() => {
    if (config?.id) {
      handleGetMemos();
    }
  }, [config?.id]);

  return (
    <>
      <section className="relative min-h-screen w-full bg-[#F2F2F2] pt-12">
        <div className="h-[72px] px-4">
          <div className="flex items-center justify-between">
            <p className="text-3xl font-semibold text-black">Memo</p>
            <button
              className="rounded-full bg-black p-2"
              onClick={() => setIsOpenCreateModal(true)}
            >
              <PlusIcon className="h-6 w-6 text-white" />
            </button>
          </div>
        </div>
        <div className="h-[calc(100vh-120px)] w-full">
          <div className="px-4 pb-16 pt-6">
            <div className="mb-8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <h4 className="text-base font-semibold text-black">Today</h4>
              </div>
              {memos?.map((item, index) => {
                return (
                  <div className="mb-2 rounded-2xl bg-white p-4" key={index}>
                    <p className="mb-2 text-base font-normal text-black">
                      {item.text}
                    </p>
                    <p className="text-xs font-normal text-black/25">
                      {format(new Date(item.created_at), "dd-MM-yyyy HH:mm")}
                    </p>
                  </div>
                );
              })}
              {memos?.length === 0 && !isLoadingMemos && (
                <div className="py-4">
                  <p className="text-center text-sm font-normal text-black">
                    Not Found
                  </p>
                </div>
              )}

              {isLoadingMemos && (
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
          handleGetMemos();
        }}
      />
    </>
  );
}
