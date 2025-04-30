"use client";

import { Button } from "@/components/ui/button";
import { Edit, PlusIcon, Trash2, View } from "lucide-react";
import React, { useState } from "react";
// import AddNewUserPopup from "./AddNewUserPopup";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
// import UpdateUserPopup from "./UpdateUserPopup";
// import CreatedSuccessfullyPopup from "../CreatedSuccessfullyPopup";
import { PAGE_SIZE } from "@/constant";
import {
  useAllUsersListQuery,
  useUserDetailsQuery,
  useUserPurchaseHistoryQuery,
  useUserCreditUsageQuery,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";

interface StateType {
  page: number;
  page_size: number;
}

const page = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  console.log("isModalOpen", isModalOpen);

  const [state, setState] = useState<StateType>({
    page: 1,
    page_size: PAGE_SIZE,
  });

  const [editUser, setEditUser] = useState({
    open: false,
    userId: null,
    tab: "User Details",
  });

  const editUserHadler = (user: any) => {
    setEditUser({
      open: true,
      userId: user?.id,
      tab: "User Details",
    });
  };

  const closeModal = () => {
    setEditUser({ open: false, userId: null, tab: "User Details" });
  };

  const { data, isLoading, error, isSuccess, isFetching } =
    useAllUsersListQuery(state);

  const { data: userDetails, isLoading: loadingDetails } = useUserDetailsQuery(
    editUser.userId!,
    { skip: !editUser.open }
  );
  console.log("🚀 ~ page ~ userDetails:", userDetails);
  // const { data: purchaseHistory, isLoading: loadingPurchase } =
  //   useUserPurchaseHistoryQuery(editUser.userId!, {
  //     skip: !editUser.open || editUser.tab !== "Purchase History",
  //   });
  const [customPurchaseUrl, setCustomPurchaseUrl] = useState("");

const { data: purchaseHistory, isLoading: loadingPurchase } = useUserPurchaseHistoryQuery(
  customPurchaseUrl || editUser.userId!,
  { skip: !editUser.open || editUser.tab !== "Purchase History" }
);

// Trigger refetch by changing the input
const refetchPurchaseHistory = (url: string) => {
  // Extract only the user ID part and page query (from your example)
  const newUrl = url.split("/purchase-history/")[1]; // e.g. "10/?page=2"
  setCustomPurchaseUrl(newUrl); // This should be accepted by your endpoint
};

  console.log("🚀 ~ page ~ purchaseHistory:", purchaseHistory);
  const { data: creditUsage, isLoading: loadingCredit } =
    useUserCreditUsageQuery(editUser.userId!, {
      skip: !editUser.open || editUser.tab !== "Credit Usage",
    });
  console.log("🚀 ~ page ~ creditUsage:", creditUsage);

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

  // const editUserHadler = (user: any) => {
  //   setEditUser((ps: any) => ({
  //     ...ps,
  //     open: !ps.open,
  //     user,
  //   }));
  // };

  return (
    <div className="flex flex-col flex-1">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />
      </ApiState>
      <div className="flex items-center mb-8">
        <div className="flex flex-col flex-1">
          <span className="font-medium text-[32px] leading-[130%] tracking-normal text-white mb-2">
            Create New User
          </span>
          <span className="text-[#8F9DAC] text-[16px] leading-[130%] font-normal">
            Create new user for your company.
          </span>
        </div>
        {/* <Button variant={"default"} onClick={() => setIsModalOpen(true)}>
          <span className="text-[14px] font-medium leading-7">
            Add New User
          </span>
          <PlusIcon className="w-[24px]" />
        </Button> */}
      </div>
      <div className="flex flex-col">
        <h3 className="text-white font-medium leading-[130%] text-[18px] tracking-normal mb-4 text-left">
          Users List
        </h3>
        <div className="w-full">
          <table className="w-full border-collapse text-white">
            <thead>
              <tr className="space-x-1 flex">
                <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Number
                </th>
                <th className="py-3 px-4 flex-1 font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                  Customer Name
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
                        201
                      </td>
                      <td className="flex-1">{ele?.username}</td>
                      <td className="min-w-fit">05/07/2024</td>
                      <td className="w-[92px] justify-center min-w-[92px] space-x-2">
                        {/* <button className="text-[#DE3140] hover:text-red-400">
                          <Trash2 className="w-[20px]" />
                        </button> */}
                        <button
                          onClick={editUserHadler.bind(null, ele)}
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
      {editUser.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-[#1E1E2E] p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-semibold">User Info</h2>
              <button onClick={closeModal} className="text-white text-xl">
                ✕
              </button>
            </div>

            {/* Tabs */}
            <div className="flex space-x-4 mb-4">
              {["User Details", "Purchase History", "Credit Usage"].map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setEditUser((prev) => ({ ...prev, tab }))}
                    className={`px-4 py-2 rounded-md ${
                      editUser.tab === tab
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {tab}
                  </button>
                )
              )}
            </div>

            {/* Tab content */}
            <div className="bg-gray-800 p-4 rounded-md text-white">
              {editUser.tab === "User Details" &&
                (loadingDetails ? (
                  <p>Loading user details...</p>
                ) : (
                  <div>
                    <p>
                      <strong>Username:</strong> {userDetails?.username}
                    </p>
                    <p>
                      <strong>Email:</strong> {userDetails?.email}
                    </p>
                    {/* Add more fields here */}
                  </div>
                ))}

              {/* {editUser.tab === "Purchase History" &&
                (loadingPurchase ? (
                  <p>Loading purchase history...</p>
                ) : (
                  <ul className="list-disc pl-4">
                    {purchaseHistory?.results?.map((item: any, i: number) => (
                      <li key={i}>{item?.credit_amount || "Purchase item"}</li>
                    ))}
                  </ul>
                ))} */}

              {editUser.tab === "Purchase History" &&
                (loadingPurchase ? (
                  <p className="text-white">Loading purchase history...</p>
                ) : (
                  <div className="space-y-4">
                    <table className="min-w-full table-auto border-collapse border border-gray-600">
                      <thead>
                        <tr className="bg-gray-700 text-white">
                          <th className="px-4 py-2 border border-gray-600 text-left">
                            #
                          </th>
                          <th className="px-4 py-2 border border-gray-600 text-left">
                            Credit Amount
                          </th>
                          <th className="px-4 py-2 border border-gray-600 text-left">
                            Created At
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {purchaseHistory?.results?.map(
                          (item: any, index: number) => (
                            <tr key={index} className="bg-gray-800 text-white">
                              <td className="px-4 py-2 border border-gray-600">
                                {index + 1}
                              </td>
                              <td className="px-4 py-2 border border-gray-600">
                                {item?.credit_amount}
                              </td>
                              <td className="px-4 py-2 border border-gray-600">
                                {new Date(item?.created_at).toLocaleDateString(
                                  "en-CA"
                                )}{" "}
                                {/* YYYY-MM-DD */}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </table>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center text-white">
                      <button
                        disabled={!purchaseHistory?.previous}
                        onClick={() => {
                          if (purchaseHistory?.previous) {
                            dispatch(
                              api.util.updateQueryData(
                                "getUserPurchaseHistory",
                                editUser.userId!,
                                (draft) => {
                                  Object.assign(draft, {}); // Clear current
                                }
                              )
                            );
                            refetchPurchaseHistory(purchaseHistory?.previous); // You’ll define this
                          }
                        }}
                        className={`px-3 py-1 rounded ${
                          purchaseHistory?.previous
                            ? "bg-blue-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Prev
                      </button>

                      <span>
                        Page{" "}
                        {Math.ceil(purchaseHistory?.results?.[0]?.index / 10) ||
                          1}
                      </span>

                      <button
                        disabled={!purchaseHistory?.next}
                        onClick={() => {
                          if (purchaseHistory?.next) {
                            dispatch(
                              api.util.updateQueryData(
                                "getUserPurchaseHistory",
                                editUser.userId!,
                                (draft) => {
                                  Object.assign(draft, {}); // Clear current
                                }
                              )
                            );
                            refetchPurchaseHistory(purchaseHistory?.next); // You’ll define this
                          }
                        }}
                        className={`px-3 py-1 rounded ${
                          purchaseHistory?.next
                            ? "bg-blue-600"
                            : "bg-gray-500 cursor-not-allowed"
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  </div>
                ))}

              {editUser.tab === "Credit Usage" &&
                (loadingCredit ? (
                  <p>Loading credit usage...</p>
                ) : (
                  <ul className="list-disc pl-4">
                    {creditUsage?.results?.map((item: any, i: number) => (
                      <li key={i}>{item?.usage || "Credit usage"}</li>
                    ))}
                  </ul>
                ))}
            </div>
          </div>
        </div>
      )}
      {/* <AddNewUserPopup
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      /> */}
      {/* <UpdateUserPopup
        isOpen={editUser.open}
        onClose={() => setEditUser((ps: any) => ({
          ...ps,
          open: false,
        }))}
        editUser={editUser.user}
      /> */}
    </div>
  );
};

export default page;
