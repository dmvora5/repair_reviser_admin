"use client";

import { PlusIcon, View } from "lucide-react";
import React, { useState, useEffect } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { useRouter } from "next/navigation";
import { PAGE_SIZE } from "@/constant";
import {
  useAllUsersListQuery,
  useUserDetailsQuery,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import { PAGE_ROUTES } from "@/constant/routes";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import PageSizeSelector from "@/components/PageSizeSelector";

interface StateType {
  page: number;
  page_size: number;
  user_type: "company" | "individual";
  search?: string;
}

const page = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"company" | "individual">(
    "company"
  );

  const [searchQuery, setSearchQuery] = useState("");

  const [state, setState] = useState<StateType>({
    page: 1,
    page_size: PAGE_SIZE,
    user_type: "company",
    search: "",
  });

  useEffect(() => {
    setState((prev) => ({
      ...prev,
      user_type: activeTab,
      page: 1,
    }));
  }, [activeTab]);

  useEffect(() => {
    const debounce = setTimeout(() => {
      setState((prev) => ({
        ...prev,
        search: searchQuery,
        page: 1,
      }));
    }, 500);

    return () => clearTimeout(debounce);
  }, [searchQuery]);

  const [editUser, setEditUser] = useState({
    open: false,
    userId: null,
  });

  const editUserHadler = (user: any) => {
    setEditUser({
      open: true,
      userId: user?.id,
    });
  };

  const closeModal = () => {
    setEditUser({ open: false, userId: null });
  };

  const { data, isLoading, error, isSuccess, isFetching } =
    useAllUsersListQuery(state);

  const { data: userDetails, isLoading: loadingDetails } = useUserDetailsQuery(
    editUser.userId!,
    {
      skip: !editUser.open,
    }
  );

  const totalPages = Math.ceil(((data as any)?.count || 0) / state.page_size);
  const currentPage = state.page;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setState((prev: any) => ({ ...prev, page: newPage }));
    }
  };

  const renderPaginationNumbers = () => {
    if (totalPages <= 1) return [];

    const maxPagesToShow = 5;
    const pageNumbers: (number | string)[] = [];

    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
    } else {
      pageNumbers.push(1);
      if (currentPage > 3) pageNumbers.push("...");
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pageNumbers.push(i);
      if (currentPage < totalPages - 2) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  const filteredData = (data as any)?.results || [];

  return (
    <div className="flex flex-col flex-1">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />
      </ApiState>

      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex flex-col">
          <span className="font-medium text-[32px] leading-[130%] tracking-normal text-white mb-2">
            Users List
          </span>
          <span className="text-[#8F9DAC] text-[16px] leading-[130%] font-normal">
            All Users List
          </span>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="flex justify-between items-center mb-4">
        <Tabs
          defaultValue="company"
          value={activeTab}
          onValueChange={(val: any) => setActiveTab(val)}
        >
          <TabsList className="bg-[#1E1E2E]">
            <TabsTrigger value="company">Company Users</TabsTrigger>
            <TabsTrigger value="individual">Individual Users</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by username or email..."
          className="w-[300px] bg-[#1E1E2E] border-none text-white"
        />
      </div>

      {/* Table */}
      <div className="flex flex-col">
        <h3 className="text-white font-medium leading-[130%] text-[18px] tracking-normal mb-4 text-left">
          Users List
        </h3>
        <div className="w-full">
          <table className="w-full border-collapse text-white">
            <thead>
              <tr className="space-x-1 flex">
                <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Id
                </th>
                <th className="py-3 px-4 flex-1 font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Customer Email
                </th>
                <th className="py-3 px-4 min-w-max font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Created On
                </th>
                <th className="py-3 px-4 w-[92px] justify-center min-w-[92px] font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px] text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {isFetching ? (
                [...Array(5)].map((_, index) => (
                  <tr
                    key={index}
                    className="flex space-x-1 animate-pulse *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                  >
                    <td className="flex-1">
                      <div className="bg-gray-700 rounded-md h-6 w-32"></div>
                    </td>
                    <td className="min-w-[176px]">
                      <div className="bg-gray-700 rounded-md h-6 w-20"></div>
                    </td>
                    <td className="min-w-[176px]">
                      <div className="bg-gray-700 rounded-md h-6 w-24"></div>
                    </td>
                    <td className="w-[92px] justify-center min-w-[92px] flex items-center space-x-2">
                      <div className="bg-gray-700 rounded-md h-6 w-6"></div>
                    </td>
                  </tr>
                ))
              ) : filteredData.length === 0 ? (
                <tr className="flex justify-center text-white w-full py-8">
                  <td colSpan={4} className="text-center text-gray-400 py-6">
                    No users found.
                  </td>
                </tr>
              ) : (
                filteredData.map((ele: any) => (
                  <tr
                    key={ele?.id}
                    className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                  >
                    <td className="w-[90px] justify-center min-w-[90px]">
                      {ele?.id}
                    </td>
                    <td className="flex-1">{ele?.email}</td>
                    <td className="min-w-fit">05/07/2024</td>
                    <td className="w-[92px] justify-center min-w-[92px] space-x-2">
                      <button
                        onClick={editUserHadler.bind(null, ele)}
                        className="text-[#62ee21] hover:text-green-400"
                      >
                        <View className="w-[20px]" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <Pagination className="flex justify-center items-center mt-4">
          {totalPages > 1 && (
            <PaginationContent className="flex space-x-2 bg-[#1E1E2E] p-3 rounded-lg shadow-md">
              <PaginationItem>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-400"
                      : "bg-gray-800 hover:bg-gray-600 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
              </PaginationItem>

              {renderPaginationNumbers().map((page, index) => (
                <PaginationItem key={index}>
                  {page === "..." ? (
                    <PaginationEllipsis className="px-4 py-2 text-gray-400" />
                  ) : (
                    <button
                      className={`px-4 py-2 rounded-md font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 hover:bg-gray-600 text-gray-300"
                      }`}
                      onClick={() => handlePageChange(page as number)}
                    >
                      {page}
                    </button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <button
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-400"
                      : "bg-gray-800 hover:bg-gray-600 text-white"
                  }`}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          )}
          <PageSizeSelector
            value={state.page_size}
            onChange={(newSize) =>
              setState({ ...state, page: 1, page_size: newSize })
            }
          />
        </Pagination>
      </div>

      {editUser.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1E1E2E] p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">User Info</h2>
              <button onClick={closeModal} className="text-white text-xl">
                ✕
              </button>
            </div>
            <div className="bg-gray-800 p-4 rounded-md text-white space-y-2 mb-6">
              {loadingDetails ? (
                <p>Loading user details...</p>
              ) : (
                <>
                  <p>
                    <strong>Username:</strong>{" "}
                    {(userDetails as any)?.user?.username}
                  </p>
                  <p>
                    <strong>Email:</strong> {(userDetails as any)?.user?.email}
                  </p>
                  <p>
                    <strong>Role:</strong>{" "}
                    {(userDetails as any)?.user?.is_company_admin
                      ? "Company Admin"
                      : "User"}
                  </p>
                </>
              )}
            </div>

            {!loadingDetails && (
              <div className="grid grid-cols-2 gap-4">
                {(userDetails as any)?.user?.is_company_admin && (
                  <button
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                    onClick={() =>
                      router.push(`${PAGE_ROUTES.USERLIST}/${editUser.userId}`)
                    }
                  >
                    Go to Users List
                  </button>
                )}
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() =>
                    router.push(
                      `${PAGE_ROUTES.PURCHASEHISTORY}/${editUser.userId}`
                    )
                  }
                >
                  View Purchase History
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() =>
                    router.push(`${PAGE_ROUTES.CREDITUSAGE}/${editUser.userId}`)
                  }
                >
                  View Credit Usage
                </button>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                  onClick={() =>
                    router.push(`${PAGE_ROUTES.JOBLIST}/${editUser.userId}`)
                  }
                >
                  View Job List
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default page;
