"use client";

import { Button } from "@/components/ui/button";
import { PAGE_ROUTES } from "@/constant/routes";
import { Eye, EyeOff, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import Image from "next/image";
import React, { useRef } from "react";

interface LogOutPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const LogOutPopup: React.FC<LogOutPopupProps> = ({
  isOpen,
  onClose,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Close modal when clicking outside of it
  const handleClickOutside = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };


  const logOut = async () => {
    await signOut({
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}`,
    });
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={handleClickOutside} // Handle outside click
    >
      <div
        ref={modalRef}
        className="bg-[#060A0E] text-white px-[48px] py-[30px] rounded-[20px] w-[501px] min-w-[501px] modelGradientBorder"
      >
        {/* Header */}
        <div className="flex justify-center flex-col items-center mb-8 text-center">
          <span className="w-[50px] bg-[#0C141C] h-[50px] min-w-[50px] flex justify-center items-center rounded-[6px] mb-4">
            <LogOut className="w-[20px] text-[#DE3140]" />
          </span>
          <h2 className="text-[24px] font-medium leading-[130%] tracking-normal mb-3 text-white">
            Are You Sure?
          </h2>
          <span className="text -[#8F9DAC] font-normal text-[16px] leading-[20px] tracking-normal ">
            Please make sure you want to log out.
          </span>
        </div>

        {/* Form */}
        <div className="flex flex-row gap-6 w-full">
          <Button type="submit" variant="outline" className="w-full" onClick={onClose}>
            No
          </Button>
          <Button onClick={logOut} type="submit" className="auth-button">
            Yes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LogOutPopup;
