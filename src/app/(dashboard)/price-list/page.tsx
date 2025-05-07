"use client";

import React, { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
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

const PriceListPage = () => {
  const router = useRouter();
  const { data, isLoading, error, isSuccess, refetch } = useGetPriceListsQuery(
    {}
  );
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

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this price?")) {
      await deletePrice(id);
      refetch();
    }
  };

  return (
    <div className="p-4">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />
      </ApiState>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white">Price List</h2>
        <Button onClick={() => handleOpenModal()}>Add New Price</Button>
      </div>

      <div className="bg-gray-800 rounded-md p-4 text-white">
        <table className="w-full table-auto border-collapse">
          <thead>
            <tr className="text-left bg-[#212B3EBF]">
              <th className="px-4 py-2">Credit</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Company</th>
              <th className="px-4 py-2">Default</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-4">
                  Loading...
                </td>
              </tr>
            ) : (
              (data as any)?.results?.map((price: any) => (
                <tr key={price.id} className="border-b border-[#162332]">
                  <td className="px-4 py-2">{price.credit_amount}</td>
                  <td className="px-4 py-2">${price.price}</td>
                  <td className="px-4 py-2">
                    {price.company_details?.company_name || "-"}
                  </td>
                  <td className="px-4 py-2">
                    {price.is_default ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => handleOpenModal(price)}
                      className="text-blue-400 hover:text-blue-600"
                    >
                      <Pencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(price.id)}
                      className="text-red-400 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {modalOpen && (
        <Dialog open={modalOpen} onOpenChange={handleCloseModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editPriceId ? "Edit Price" : "Add New Price"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <Input
                type="number"
                placeholder="Credit Amount"
                value={formData.credit_amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    credit_amount: Number(e.target.value),
                  }))
                }
              />
              <Input
                type="number"
                step="0.01"
                placeholder="Price (USD)"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    price: e.target.value,
                  }))
                }
              />
              {/* {!editPriceId && (
                <Input
                  type="number"
                  placeholder="company"
                  value={formData.company}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      company: e.target.value,
                    }))
                  }
                />
              )} */}
              {!editPriceId && (
                <select
                  className="w-full p-2 rounded border border-gray-300 bg-white text-black"
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
    </div>
  );
};

export default PriceListPage;
