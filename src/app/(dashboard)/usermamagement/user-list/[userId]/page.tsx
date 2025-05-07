"use client";

import { useParams } from "next/navigation";
import { useUserDetailsQuery } from "@/redux/api/users.api";
import { View } from "lucide-react";
import React, { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import ApiState from "@/components/ApiState";

const PAGE_SIZE = 5;

const UserListByCompany = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const {
    data: userDetails,
    isLoading,
    error,
    isSuccess,
    isFetching,
  } = useUserDetailsQuery(userId);
  const companyUsers = (userDetails as any)?.company || [];

  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(companyUsers.length / PAGE_SIZE);

  const paginatedUsers = companyUsers.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
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

  if (isLoading) {
    return (
      <div className="text-white">
        <h1 className="text-xl font-bold mb-4">Loading users...</h1>
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className="space-x-1 flex">
              {["Number", "User Name", "Email"].map((col, i) => (
                <th
                  key={i}
                  className="py-3 px-4 flex-1 font-medium text-[14px] bg-[#212B3EBF] rounded-[9px] text-left"
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, index) => (
              <tr
                key={index}
                className="flex space-x-1 animate-pulse *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal"
              >
                <td className="flex-1">
                  <div className="bg-gray-700 rounded-md h-6 w-16"></div>
                </td>
                <td className="flex-1">
                  <div className="bg-gray-700 rounded-md h-6 w-32"></div>
                </td>
                <td className="flex-1">
                  <div className="bg-gray-700 rounded-md h-6 w-24"></div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!(userDetails as any)?.user?.is_company_admin) {
    return <p className="text-white">This user is not a company admin.</p>;
  }

  return (
    <div className="text-white">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />
      </ApiState>
      <h1 className="text-xl font-bold mb-4">
        Users under {(userDetails as any)?.user.username}
      </h1>

      <div className="w-full overflow-x-auto">
        <table className="w-full border-collapse text-white">
          <thead>
            <tr className="space-x-1 flex">
              <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] flex font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                Number
              </th>
              <th className="py-3 px-4 flex-1 font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                User Name
              </th>
              <th className="py-3 px-4 min-w-max font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                Email
              </th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((ele: any, index: number) => (
                <tr
                  key={ele?.id}
                  className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal"
                >
                  <td className="w-[90px] justify-center min-w-[90px]">
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </td>
                  <td className="flex-1">{ele?.username}</td>
                  <td className="min-w-fit">{ele?.email}</td>
                </tr>
              ))
            ) : (
              <tr className="flex">
                <td
                  colSpan={4}
                  className="text-center py-4 text-[#8F9DAC] flex-1"
                >
                  No users found under this company.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <Pagination className="flex justify-center items-center mt-4">
        {totalPages > 1 && (
          <PaginationContent className="flex space-x-2 bg-[#1E1E2E] p-3 rounded-lg shadow-md">
            {/* Previous */}
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

            {/* Next */}
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
  );
};

export default UserListByCompany;
