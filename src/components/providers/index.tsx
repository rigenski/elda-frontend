"use client";

import { ConfigProvider, TConfig } from "@/store/config";
import { AppProgressBar } from "next-nprogress-bar";
import { usePathname } from "next/navigation";
import React from "react";
import Nav from "../nav";
import { Toaster } from "../sonner";

interface ProvidersProps {
  children: React.ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  const pathname = usePathname();
  const user: TConfig =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const isHome =
    pathname !== "/sign-in" &&
    pathname !== "/sign-up" &&
    pathname !== "/onboard" &&
    pathname !== "/chatbot";

  return (
    <ConfigProvider config={user}>
      <AppProgressBar
        height="4px"
        color={"#0D6BDC"}
        options={{ showSpinner: false }}
        shallowRouting
      />
      <Toaster position="top-center" richColors />
      {children}
      {isHome && <Nav />}
    </ConfigProvider>
  );
}
