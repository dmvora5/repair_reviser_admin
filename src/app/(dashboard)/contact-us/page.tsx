"use client";

import { View } from "lucide-react";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { PAGE_SIZE } from "@/constant";
import {
  useGetContactUsListQuery,
  useUpdateContactUsMutation,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";

interface StateType {
  page: number;
  page_size: number;
}

const page = () => {
  const [state, setState] = useState<StateType>({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const { data, isLoading, error, isSuccess, isFetching } =
    useGetContactUsListQuery(state);

  const [updateContactUs] = useUpdateContactUsMutation();

  console.log("data", data);

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

  const handleUpdate = async (id: string | number) => {
    try {
      await updateContactUs({ id }).unwrap();
      // Optionally show success toast here
    } catch (error) {
      console.error("Failed to update contact", error);
      // Optionally show error toast here
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />
      </ApiState>
      <div className="flex items-center mb-8">
        <div className="flex flex-col flex-1">
          <span className="font-medium text-[32px] leading-[130%] tracking-normal text-white mb-2">
            Contact US
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="w-full">
          <table className="w-full border-collapse text-white">
            <thead>
              <tr className="space-x-1 flex">
                <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Name
                </th>
                <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Email
                </th>
                <th className="py-3 px-4 flex-1 font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Message
                </th>
                <th className="py-3 px-4 min-w-max font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Created On
                </th>
                <th className="py-3 px-4 w-[92px] justify-center min-w-[92px] font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px] text-center">
                  Action
                </th>
              </tr>
            </thead>
            {/* <tbody>
              {isFetching
                ? // Loading Skeleton Rows
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
                : ((data as any)?.results || []).map((ele: any) => (
                    <tr
                      key={ele?.id}
                      className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                    >
                      <td className="w-[90px] justify-center min-w-[90px]">
                        {ele?.name}
                      </td>
                      <td className="flex-1">{ele?.email}</td>
                      <td className="min-w-fit">{ele?.message}</td>
                      <td className="min-w-fit">{ele?.created_at}</td>
                      <td className="w-[92px] justify-center min-w-[92px] space-x-2">
                        <button
                          onClick={editUserHadler.bind(null, ele)}
                          className="text-[#62ee21] hover:text-green-400"
                        >
                          <View className="w-[20px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody> */}
            <tbody>
              {isFetching
                ? [...Array(5)].map((_, index) => (
                    <tr
                      key={index}
                      className="flex space-x-1 animate-pulse *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                    >
                      <td className="w-[90px] justify-center min-w-[90px]">
                        <div className="bg-gray-700 rounded-md h-5 w-24"></div>
                      </td>
                      <td className="flex-1">
                        <div className="bg-gray-700 rounded-md h-5 w-40"></div>
                      </td>
                      <td className="min-w-fit flex-1">
                        <div className="bg-gray-700 rounded-md h-5 w-48"></div>
                      </td>
                      <td className="min-w-fit">
                        <div className="bg-gray-700 rounded-md h-5 w-32"></div>
                      </td>
                      <td className="w-[92px] justify-center min-w-[92px] flex items-center space-x-2">
                        <div className="bg-gray-700 rounded-md h-5 w-6"></div>
                      </td>
                    </tr>
                  ))
                : ((data as any)?.results || []).map((ele: any) => (
                    <tr
                      key={ele?.id}
                      className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                    >
                      <td className="w-[90px] justify-center min-w-[90px]">
                        {ele?.name}
                      </td>
                      <td className="flex-1">{ele?.email}</td>
                      <td className="flex-1">{ele?.message}</td>
                      <td className="min-w-fit">{ele?.created_at}</td>
                      <td className="w-[92px] justify-center min-w-[92px] flex items-center space-x-2">
                        <button
                          onClick={() => handleUpdate(ele?.id)}
                          className="text-[#62ee21] hover:text-green-400"
                        >
                          <View className="w-[20px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
            </tbody>
          </table>
        </div>
        <Pagination className="flex justify-center items-center mt-4">
          {totalPages > 1 && (
            <PaginationContent className="flex space-x-2 bg-[#1E1E2E] p-3 rounded-lg shadow-md">
              {/* Previous Button */}
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

              {/* Page Numbers */}
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

              {/* Next Button */}
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
        </Pagination>
      </div>
    </div>
  );
};

export default page;
