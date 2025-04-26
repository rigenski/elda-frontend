"use client";

import api from "@/service/api";
import { useConfig } from "@/store/config";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function Container() {
  const router = useRouter();
  const form = useForm();

  const { setConfig } = useConfig()();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);

  const handleSubmit = () => {
    if (!form.watch("email")?.length || !form.watch("password")?.length) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    api
      .post("/auth/login", {
        email: form.watch("email"),
        password: form.watch("password"),
      })
      .then((res) => {
        setConfig(res.data.user);

        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(res.data.user));
        }

        toast.success("Login successful");

        router.push("/");
      })
      .catch(() => {
        toast.error("Invalid email or password");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <section className="h-screen w-full bg-[#0D6BDC] pt-12">
      <div className="flex h-full flex-col justify-end">
        <div>
          <div className="relative mb-4 p-4">
            <div className="relative z-20">
              <h2 className="mb-2 text-3xl font-bold text-white">Log In</h2>
              <p className="text-base text-white">
                Welcome back, log into your account!
              </p>
            </div>
            <div className="absolute -bottom-4 right-0 z-10">
              <div>
                <Image
                  src="/assets/auth/bg.png"
                  alt="logo"
                  width={480}
                  height={480}
                  className="h-auto w-[240px]"
                />
              </div>
            </div>
          </div>
          <div className="rounded-t-3xl bg-white px-4 pb-8 pt-8">
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-[#1C1B55]">
                  Email
                </label>
                <input
                  type="text"
                  className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
                  {...form.register("email")}
                />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-[#1C1B55]">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <input
                    type={isShowPassword ? "text" : "password"}
                    className="w-full rounded-md border border-gray-300 bg-[#F7F7F7] px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0D6BDC]"
                    {...form.register("password")}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <button onClick={() => setIsShowPassword(!isShowPassword)}>
                      {isShowPassword ? (
                        <EyeIcon className="h-5 w-5 text-[#ADADAD]" />
                      ) : (
                        <EyeOffIcon className="h-5 w-5 text-[#ADADAD]" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <button
                  className="w-full rounded-full bg-[#0D6BDC] px-8 py-4"
                  disabled={isLoading}
                  onClick={handleSubmit}
                >
                  <p className="text-base font-semibold text-white">Login</p>
                </button>
              </div>
              <div className="flex items-center justify-center gap-2">
                <p className="text-sm text-[#9797C9]">
                  Don&apos;t have an account?
                </p>
                <Link href="/sign-up">
                  <button className="text-sm font-medium text-[#1C1B55] underline">
                    Register
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
