"use client";

import React, { useState } from "react";
import { Pencil, PlusIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  useGetPriceListsQuery,
  useDeletePriceMutation,
  useAddPriceMutation,
  useUpdatePriceMutation,
  useGetCompanyListQuery,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import { PAGE_SIZE } from "@/constant";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationEllipsis,
} from "@/components/ui/pagination";
import PageSizeSelector from "@/components/PageSizeSelector";

const PriceListPage = () => {
  const [state, setState] = useState({ page: 1, page_size: PAGE_SIZE });
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deletePriceId, setDeletePriceId] = useState<number | null>(null);

  const currentPage = state.page;
  const { data, isLoading, error, isSuccess, refetch, isFetching } =
    useGetPriceListsQuery({
      page: state.page,
      page_size: state.page_size,
    });

  const results = (data as any)?.results || [];
  const totalCount = (data as any)?.count || 0;

  const totalPages = Math.ceil(totalCount / state.page_size);

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

  const {
    data: comapnyList,
    isLoading: isCompanyListDataLoading,
    error: isCompanyListDataError,
    isSuccess: isCompanyListDataSuccess,
    refetch: isCompanyListDataRefetch,
  } = useGetCompanyListQuery({});

  const [createPrice] = useAddPriceMutation();
  const [updatePrice] = useUpdatePriceMutation();
  const [deletePrice] = useDeletePriceMutation();

  const [editPriceId, setEditPriceId] = useState<number | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    credit_amount: 0,
    price: "",
    company: "",
  });

  const handleOpenModal = (price: any = null) => {
    if (price) {
      setEditPriceId(price.id);
      setFormData({
        credit_amount: price.credit_amount,
        price: price.price,
        company: price.company,
      });
    } else {
      setEditPriceId(null);
      setFormData({ credit_amount: 0, price: "", company: "" });
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditPriceId(null);
    setFormData({ credit_amount: 0, price: "", company: "" });
  };

  const handleSubmit = async () => {
    const payload = {
      ...formData,
      credit_amount: Number(formData.credit_amount),
      price: parseFloat(formData.price).toFixed(2),
    };

    if (editPriceId) {
      await updatePrice({ id: editPriceId, ...payload });
    } else {
      await createPrice(payload);
    }
    handleCloseModal();
    refetch();
  };

  const handleDelete = async () => {
    if (deletePriceId === null) return;
    setDeleteLoading(true);
    try {
      await deletePrice(deletePriceId).unwrap();
      refetch();
    } catch (err) {
      console.error("Delete error", err);
    } finally {
      setDeleteLoading(false);
      setDeleteModalOpen(false);
      setDeletePriceId(null);
    }
  };

  return (
    <div className="p-4">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />

        <div className="flex items-center mb-8">
          <div className="flex flex-col flex-1">
            <span className="font-medium text-[32px] leading-[130%] tracking-normal text-white mb-2">
              Price List
            </span>
          </div>
          <Button onClick={() => handleOpenModal()}>
            <span className="text-[14px] font-medium leading-7">
              Add New Price
            </span>
            <PlusIcon className="w-[24px]" />
          </Button>
        </div>

        <div className="flex flex-col">
          <h3 className="text-white font-medium leading-[130%] text-[18px] tracking-normal mb-4 text-left">
            Price List
          </h3>

          <div className="w-full">
            <table className="w-full border-collapse text-white">
              <thead>
                <tr className="space-x-1 flex">
                  {/* <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                    Credit
                  </th> */}
                  <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                    Price
                  </th>
                  <th className="py-3 px-4 flex-1 font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                    Company
                  </th>
                  <th className="py-3 px-4 w-[90px] justify-center min-w-[90px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                    Default
                  </th>
                  <th className="py-3 px-4 w-[92px] justify-center min-w-[92px] font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px] text-center">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading || isFetching
                  ? [...Array(5)].map((_, index) => (
                      <tr
                        key={index}
                        className="flex space-x-1 animate-pulse *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                      >
                        {/* <td className="w-[90px]">
                          <div className="bg-gray-700 rounded-md h-6 w-16"></div>
                        </td> */}
                        <td className="w-[90px]">
                          <div className="bg-gray-700 rounded-md h-6 w-16"></div>
                        </td>
                        <td className="flex-1">
                          <div className="bg-gray-700 rounded-md h-6 w-28"></div>
                        </td>
                        <td className="w-[90px]">
                          <div className="bg-gray-700 rounded-md h-6 w-6"></div>
                        </td>
                        <td className="w-[92px] flex justify-center space-x-2">
                          <div className="bg-gray-700 rounded-md h-6 w-6"></div>
                        </td>
                      </tr>
                    ))
                  : (data as any)?.results?.map((price: any) => (
                      <tr
                        key={price.id}
                        className={`flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal ${
                          price.is_default ? "bg-[#2A3748] mt-2 rounded-lg" : ""
                        }`}
                      >
                        {/* <td className="w-[90px] justify-center">
                          {price.credit_amount}
                        </td> */}
                        <td className="w-[90px] justify-center">
                          ${price.price}
                        </td>
                        <td className="flex-1">
                          {price.company_details?.company_name || "-"}
                        </td>
                        <td className="w-[90px] justify-center">
                          {price.is_default ? "✅" : "❌"}
                        </td>
                        <td className="w-[92px] justify-center space-x-2">
                          {price.is_default == false && (
                            <>
                              <button
                                onClick={() => handleOpenModal(price)}
                                className="text-blue-400 hover:text-blue-600"
                              >
                                <Pencil className="w-[20px]" />
                              </button>
                              <button
                                onClick={() => {
                                  setDeletePriceId(price.id);
                                  setDeleteModalOpen(true);
                                }}
                                className="text-red-400 hover:text-red-600"
                              >
                                <Trash2 className="w-[20px]" />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <Pagination className="flex justify-center items-center mt-4">
            {totalPages > 1 && (
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
            )}
            <PageSizeSelector
              value={state.page_size}
              onChange={(newSize) => setState({ page: 1, page_size: newSize })}
            />
          </Pagination>
        </div>

        {modalOpen && (
          <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
            <DialogContent className="bg-black text-white">
              <DialogHeader>
                <DialogTitle>
                  {editPriceId ? "Edit Price" : "Add New Price"}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4 mt-4">
                {/* <Input
                  type="number"
                  placeholder="Credit Amount"
                  value={formData.credit_amount}
                  className="bg-gray-900 text-white placeholder-gray-400"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      credit_amount: Number(e.target.value),
                    }))
                  }
                /> */}
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Price (USD)"
                  value={formData.price}
                  className="bg-gray-900 text-white placeholder-gray-400"
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      price: e.target.value,
                    }))
                  }
                />
                {!editPriceId && (
                  <select
                    className="w-full p-2 rounded border border-gray-300 bg-gray-900 text-white"
                    value={formData.company || ""}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        company: e.target.value,
                      }))
                    }
                  >
                    <option value="">Select a company</option>
                    {(comapnyList as any[])?.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.company_name}
                      </option>
                    ))}
                  </select>
                )}
                <Button onClick={handleSubmit} className="w-full">
                  {editPriceId ? "Update Price" : "Create Price"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {deleteModalOpen && (
          <Dialog
            open={deleteModalOpen}
            onOpenChange={() => setDeleteModalOpen(false)}
          >
            <DialogContent className="bg-black text-white">
              <DialogHeader>
                <DialogTitle>Confirm Delete</DialogTitle>
              </DialogHeader>
              <div className="text-gray-300 mb-4">
                Are you sure you want to delete this price?
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  variant="secondary"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteLoading}
                  className="bg-gray-700 text-white hover:bg-gray-600"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  disabled={deleteLoading}
                  className="bg-red-500 hover:bg-red-600 text-white"
                >
                  {deleteLoading ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </ApiState>
    </div>
  );
};

export default PriceListPage;
