"use client";

import { cn } from "@/utils/classnames";
import {
  CircleUserIcon,
  ContactRoundIcon,
  HandHeartIcon,
  HomeIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Nav() {
  const pathname = usePathname();

  const isNavActive = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full">
        <div className="w-full bg-white p-4 shadow-[0_-2px_16px_0px_rgba(0,0,0,0.1)]">
          <div className="flex items-center justify-between">
            <Link href="/">
              <div className="flex flex-col items-center gap-1">
                <HomeIcon
                  className={cn(
                    "h-5 w-5 text-[#919191]",
                    isNavActive("/") && "text-[#0D6BDC]",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-semibold text-[#919191]",
                    isNavActive("/") && "text-[#0D6BDC]",
                  )}
                >
                  Home
                </p>
              </div>
            </Link>
            <Link href="/memo">
              <div className="flex flex-col items-center gap-1">
                <ContactRoundIcon
                  className={cn(
                    "h-5 w-5 text-[#919191]",
                    isNavActive("/memo") && "text-[#0D6BDC]",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-semibold text-[#919191]",
                    isNavActive("/memo") && "text-[#0D6BDC]",
                  )}
                >
                  Memo
                </p>
              </div>
            </Link>
            <div className="-mx-4 -mt-16">
              <Link href="/chatbot">
                <button className="h-16 w-16 rounded-full bg-[#4499FF] shadow">
                  <div className="flex items-center justify-center">
                    <Image
                      src="/assets/home/assist-icon.svg"
                      alt=""
                      width={240}
                      height={240}
                      className="h-6 w-6"
                    />
                  </div>
                </button>
              </Link>
            </div>
            <Link href="/guide">
              <div className="flex flex-col items-center gap-1">
                <HandHeartIcon
                  className={cn(
                    "h-5 w-5 text-[#919191]",
                    isNavActive("/guide") && "text-[#0D6BDC]",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-semibold text-[#919191]",
                    isNavActive("/guide") && "text-[#0D6BDC]",
                  )}
                >
                  Guide
                </p>
              </div>
            </Link>
            <Link href="/profile">
              <div className="flex flex-col items-center gap-1">
                <CircleUserIcon
                  className={cn(
                    "h-5 w-5 text-[#919191]",
                    isNavActive("/profile") && "text-[#0D6BDC]",
                  )}
                />
                <p
                  className={cn(
                    "text-xs font-semibold text-[#919191]",
                    isNavActive("/profile") && "text-[#0D6BDC]",
                  )}
                >
                  Profile
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
