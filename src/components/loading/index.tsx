"use client";

import { AnimatePresence } from "motion/react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

interface LoadingProps {
  children: React.ReactNode;
}

export default function Loading({ children }: LoadingProps) {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev === 100) {
          return 0;
        }
        return prev + 4;
      });
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (progress === 100) {
      setIsLoading(false);
    }
  }, [progress]);

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.section
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed left-0 top-0 z-50 h-screen w-full bg-[#0D6BDC]"
          >
            <div className="h-full w-full bg-[url('/assets/loading/bg.png')] bg-[length:320px_auto] bg-right-bottom bg-no-repeat">
              <div className="flex h-full w-full items-center justify-center">
                <div className="-mt-48 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div>
                      <Image
                        src="/assets/loading/logo.svg"
                        alt="logo"
                        width={480}
                        height={480}
                        className="h-10 w-auto"
                      />
                    </div>
                    <h4 className="text-4xl font-bold text-white">Elda</h4>
                  </div>
                  <p className="text-center text-sm font-medium text-white">
                    Elda, Your Personal Assistant
                  </p>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
