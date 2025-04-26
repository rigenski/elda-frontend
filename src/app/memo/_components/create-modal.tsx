/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import api from "@/service/api";
import { useConfig } from "@/store/config";
import { cn } from "@/utils/classnames";
import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CreateModal({ isOpen, onClose }: CreateModalProps) {
  const form = useForm();

  const { config } = useConfig()();

  const handleCreateMemo = () => {
    if (!form.watch("text")) {
      toast.error("Please enter a memo");
      return;
    }

    const body = {
      text: form.watch("text"),
      userid: config?.id,
    };

    api
      .post("/memos", body)
      .then(() => {
        toast.success("Memo created successfully");
        form.setValue("text", "");
        onClose();
      })
      .catch(() => {
        toast.error("Failed to create memo");
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
          <h4 className="text-xl font-semibold text-black">Create Memo</h4>
          <button onClick={onClose}>
            <XIcon className="h-6 w-6 text-black" />
          </button>
        </div>
        <div className="p-4">
          <div className="flex flex-col gap-4">
            <textarea
              placeholder="Type your memo here..."
              className="w-full rounded-lg border border-[#D9D9D9] p-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
              rows={10}
              {...form.register("text")}
            />
            <button
              className="rounded-2xl bg-[#0D6BDC] px-8 py-4"
              onClick={handleCreateMemo}
            >
              <p className="text-sm font-semibold text-white">Save</p>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
