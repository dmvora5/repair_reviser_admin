"use client";

import { useParams } from "next/navigation";
import { useState } from "react";
import { useUserPurchaseHistoryQuery } from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import { format } from "date-fns";
import { PAGE_SIZE } from "@/constant";

const UserPurchaseHistory = () => {
  const params = useParams();
  const userId = params?.userId as string;

  const [state, setState] = useState({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const { data, isLoading, error, isSuccess } = useUserPurchaseHistoryQuery({
    userId,
    page: state.page,
    page_size: state.page_size,
  });

  const results = (data as any)?.results || [];
  const totalCount = (data as any)?.count || 0;
  const totalPages = Math.ceil(totalCount / state.page_size);
  const currentPage = state.page;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setState((prev) => ({ ...prev, page: newPage }));
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

  return (
    <div className="text-white">
      <h1 className="text-xl font-bold mb-4">User Purchase History</h1>

      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />

        <div className="w-full overflow-x-auto">
          <table className="w-full border-collapse text-white">
            <thead>
              <tr className="space-x-1 flex">
                <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] flex font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                  No.
                </th>
                <th className="py-3 px-4 flex-1 font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                  Credit Amount
                </th>
                <th className="py-3 px-4 flex-1 font-medium text-[14px] bg-[#212B3EBF] rounded-[9px]">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                [...Array(PAGE_SIZE)].map((_, index) => (
                  <tr
                    key={index}
                    className="flex space-x-1 animate-pulse *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px]"
                  >
                    <td className="w-[90px] justify-center min-w-[90px] flex">
                      <div className="bg-gray-700 rounded-md h-5 w-5 mx-auto" />
                    </td>
                    <td className="flex-1">
                      <div className="bg-gray-700 rounded-md h-5 w-24" />
                    </td>
                    <td className="flex-1">
                      <div className="bg-gray-700 rounded-md h-5 w-28" />
                    </td>
                  </tr>
                ))
              ) : results.length > 0 ? (
                results.map(
                  (
                    item: { credit_amount: number; created_at: string },
                    index: number
                  ) => (
                    <tr
                      key={index}
                      className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px]"
                    >
                      <td className="w-[90px] justify-center min-w-[90px] flex">
                        {(currentPage - 1) * PAGE_SIZE + index + 1}
                      </td>
                      <td className="flex-1">{item.credit_amount}</td>
                      <td className="flex-1">
                        {format(new Date(item.created_at), "yyyy-MM-dd")}
                      </td>
                    </tr>
                  )
                )
              ) : (
                <tr className="flex">
                  <td
                    colSpan={3}
                    className="text-center py-4 text-[#8F9DAC] flex-1"
                  >
                    No purchase history found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination className="flex justify-center items-center mt-4">
            <PaginationContent className="flex space-x-2 bg-[#1E1E2E] p-3 rounded-lg shadow-md">
              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === 1
                      ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-400"
                      : "bg-gray-800 hover:bg-gray-600 text-white"
                  }`}
                >
                  Previous
                </button>
              </PaginationItem>

              {renderPaginationNumbers().map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === "..." ? (
                    <PaginationEllipsis className="px-4 py-2 text-gray-400" />
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-4 py-2 rounded-md font-semibold transition-all ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "bg-gray-800 hover:bg-gray-600 text-gray-300"
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-4 py-2 rounded-md transition-all ${
                    currentPage === totalPages
                      ? "opacity-50 cursor-not-allowed bg-gray-700 text-gray-400"
                      : "bg-gray-800 hover:bg-gray-600 text-white"
                  }`}
                >
                  Next
                </button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </ApiState>
    </div>
  );
};

export default UserPurchaseHistory;
