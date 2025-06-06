"use client";

import LogOutPopup from "@/components/LogOutPopup";
import { PAGE_ROUTES } from "@/constant/routes";
import { CircleDollarSign, Columns4, UserCog, LogOut } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const MENUS = [
  {
    name: "User Management",
    path: PAGE_ROUTES.DASHBOARD,
    icon: <UserCog size={18} />,
  },
  {
    name: "Price List",
    path: PAGE_ROUTES.PRICELIST,
    icon: <CircleDollarSign size={18} />,
  },
  {
    name: "Privacy and Terms",
    path: PAGE_ROUTES.PRIVACYANDTERMS,
    icon: <Columns4 size={18} />,
  },
  {
    name: "Contact Us",
    path: PAGE_ROUTES.CONTACTUS,
    icon: <Columns4 size={18} />,
  },
];

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname(); // Get current route
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const menuItems2: {
    name: string;
    icon: React.JSX.Element;
    path?: string;
    onClick?: () => void;
  }[] = [
    {
      name: "Log Out",
      onClick: () => setIsLogoutOpen(true), // Open popup when clicked
      icon: <LogOut size={18} />,
    },
  ];

  return (
    <div className="p-6 bg-black min-h-screen flex flex-row overflow-hidden gap-8">
      <aside className="w-[250px] min-w-[250px] bg-[#0B1219] rounded-[16px] flex flex-col px-4 pt-4">
        <div className="flex pl-3 mb-[30px]">
          <Link href="/">
            <Image src="/Logo.svg" width={164} height={50} alt="Logo" />
          </Link>
        </div>

        <ul className="space-y-3 overflow-y-auto flex flex-col flex-grow scrollbar-hide">
          {MENUS.map((item) => (
            <li key={item.path}>
              <Link
                href={item.path}
                className={`flex min-h-[48px] px-3 rounded-[5px] items-center gap-3 font-medium text-[14px] leading-5 ${
                  pathname === item.path
                    ? "bg-[#DE3140] text-white"
                    : "text-[#8F9DAC] hover:bg-[#DE3140] hover:text-white"
                }`}
              >
                {item.icon} {item.name}
              </Link>
            </li>
          ))}
        </ul>

        <ul className="space-y-3 overflow-y-auto flex flex-col flex-grow scrollbar-hide">
          {menuItems2.map((item) => (
            <li key={item.name}>
              {item.path ? (
                <Link
                  href={item.path}
                  className={`flex min-h-[48px] px-3 rounded-[5px] items-center gap-3 font-medium text-[14px] leading-5 ${
                    pathname === item.path
                      ? "bg-[#DE3140] text-white"
                      : "text-[#8F9DAC] hover:bg-[#DE3140] hover:text-white"
                  }`}
                >
                  {item.icon} {item.name}
                </Link>
              ) : (
                <button
                  onClick={item.onClick}
                  className="flex w-full min-h-[48px] px-3 rounded-[5px] items-center gap-3 font-medium text-[14px] leading-5 text-[#8F9DAC] hover:bg-[#DE3140] hover:text-white"
                >
                  {item.icon} {item.name}
                </button>
              )}
            </li>
          ))}
        </ul>
      </aside>
      <main className="flex-1 flex flex-col overflow-y-auto h-full scrollbar-hide max-h-[calc(100vh-48px)]">
        {children}
      </main>
      {isLogoutOpen && (
        <LogOutPopup
          isOpen={isLogoutOpen}
          onClose={() => setIsLogoutOpen(false)}
        />
      )}
    </div>
  );
};

export default DashboardLayout;
