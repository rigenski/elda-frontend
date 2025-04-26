"use client";

import { useConfig } from "@/store/config";
import {
  DoorOpenIcon,
  MapPinIcon,
  SettingsIcon,
  UsersIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Container() {
  const router = useRouter();

  const { config } = useConfig()();

  const handleShareMyLocation = () => {
    const googleMapsUrl = `https://www.google.com/maps?q=${config?.latitude},${config?.longitude}`;

    navigator.clipboard.writeText(googleMapsUrl);
    toast.success("Location copied to clipboard");
  };

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
    }

    toast.success("Logged out successfully");

    router.push("/sign-in");
  };

  return (
    <section className="relative min-h-screen w-full bg-white pt-12">
      <div className="h-[72px] px-4">
        <div className="flex items-center justify-between">
          <p className="text-3xl font-semibold text-black">Profile</p>
        </div>
      </div>
      <div className="h-[calc(100vh-120px)] w-full">
        <div className="px-4 pb-16">
          <div className="flex flex-col items-center justify-center">
            <div className="mb-4">
              <div className="h-32 w-32 rounded-full border-2 border-[#0D6BDC] bg-white">
                <Image
                  src={"/assets/profile/pfp.jpeg"}
                  alt=""
                  width={480}
                  height={480}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
            </div>
            <h4 className="text-base font-semibold text-black">
              {config?.name ?? "-"}
            </h4>
            <p className="text-sm font-normal text-black/50">Grandma</p>
          </div>
          <div className="mb-8 mt-4 w-full border-t border-[#D9D9D9]"></div>
          <div className="flex flex-col gap-4">
            <button className="flex items-center justify-start gap-2 rounded-full bg-[#F3F3F3] px-8 py-4">
              <UsersIcon className="h-4 w-4 text-black/50" />
              <p className="text-sm font-normal text-black/50">Edit Profile</p>
            </button>
            <button
              className="flex items-center justify-start gap-2 rounded-full bg-[#F3F3F3] px-8 py-4"
              onClick={handleShareMyLocation}
            >
              <MapPinIcon className="h-4 w-4 text-black/50" />
              <p className="text-sm font-normal text-black/50">
                Share My Location
              </p>
            </button>
            <button className="flex items-center justify-start gap-2 rounded-full bg-[#F3F3F3] px-8 py-4">
              <SettingsIcon className="h-4 w-4 text-black/50" />
              <p className="text-sm font-normal text-black/50">Settings</p>
            </button>
            <button
              className="flex items-center justify-start gap-2 rounded-full bg-[#F3F3F3] px-8 py-4"
              onClick={handleLogout}
            >
              <DoorOpenIcon className="h-4 w-4 text-black/50" />
              <p className="text-sm font-normal text-black/50">Logout</p>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
