"use client";

import React, { useEffect, useRef, useState } from "react";
import CkEditor from "@/components/CkEditor";
import {
  useGetPrivacyListQuery,
  useUpdatePrivacyMutation,
  useGetFAQListQuery,
  useCreateFAQMutation,
  useUpdateFAQMutation,
  useDeleteFAQMutation,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import { Pencil } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";

interface PrivacyListType {
  privacy_text: string;
  terms_condition_text: string;
  f_a_q: { id: string; title: string; description: string }[];
}

const LoadingOverlay = () => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
    <div className="text-white text-lg">Loading...</div>
  </div>
);

const Editor: React.FC = () => {
  const {
    data: privacyList,
    isLoading,
    error,
    isSuccess,
    refetch,
    isFetching,
  } = useGetPrivacyListQuery({}) as {
    data: PrivacyListType | undefined;
    isLoading: boolean;
    error: any;
    isSuccess: boolean;
    refetch: () => void;
    isFetching: boolean;
  };

  const {
    data: faqData,
    isLoading: isFaqLoading,
    refetch: refetchFaq,
  } = useGetFAQListQuery({});

  const [updatePrivacy, { isLoading: isUpdatePrivacyLoading }] =
    useUpdatePrivacyMutation();
  const [createFAQ] = useCreateFAQMutation();
  const [updateFAQ] = useUpdateFAQMutation();
  const [deleteFAQ] = useDeleteFAQMutation();

  const [editorData, setEditorData] = useState<string>("");
  const [editingType, setEditingType] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tabLoading, setTabLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("privacy_text");
  const [faqList, setFaqList] = useState<any[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [savingIndex, setSavingIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [imageLoadingIndex, setImageLoadingIndex] = useState<number | null>(
    null
  );

  useEffect(() => {
    if (faqData && Array.isArray(faqData)) {
      setFaqList(faqData);
    }
  }, [faqData]);

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      setEditorData(editor);
    }
  };

  const handleEditClick = (type: string, value: any, id?: string) => {
    setEditingType(type);
    setEditorData(value);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingType(null);
    setEditorData("");
  };

  const handleUpdate = async () => {
    try {
      await updatePrivacy({
        type: editingType, // "privacy_text", "terms_condition_text", or "f_a_q"
        value: editorData, // Direct value for all types
      }).unwrap();
      handleCloseModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleTabChange = (value: string) => {
    setTabLoading(true);
    setActiveTab(value);
    setTimeout(() => setTabLoading(false), 300);
  };

  const handleFaqChange = (
    index: number,
    field: "title" | "description" | "img",
    value: string | File
  ) => {
    setFaqList((prevFaqList) => {
      const updated = [...prevFaqList];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleFaqSave = async (index: number) => {
    try {
      setSavingIndex(index);
      const faq = faqList[index];
      const formData = new FormData();

      formData.append("title", faq.title);
      formData.append("description", faq.description);
      if (faq.img instanceof File) {
        formData.append("img", faq.img);
      } else if (!faq.img) {
        // Send explicit null to indicate image should be removed
        formData.append("img", "");
      }

      if (faq.id) {
        await updateFAQ({ id: faq.id, body: formData }).unwrap();
      } else {
        await createFAQ(formData).unwrap();
      }

      refetchFaq();
      setExpandedFaq(null);
      setSavingIndex(null);
    } catch (err) {
      console.error("FAQ save error:", err);
      setSavingIndex(null);
    }
  };

  const handleFaqDelete = async (index: number) => {
    const faq = faqList[index];
    try {
      if (faq.id) {
        await deleteFAQ(faq.id).unwrap();
      }
      refetchFaq();
      setExpandedFaq(null);
    } catch (err) {
      console.error("FAQ delete error:", err);
    }
  };

  return (
    <div className="p-6">
      <ApiState isSuccess={isSuccess} error={error}>
        <ApiState.Error />
        <ApiState.ArthorizeCheck />

        <div className="mb-6">
          <h1 className="text-white text-3xl font-semibold mb-2">
            Privacy & Terms Management
          </h1>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="privacy_text">Privacy Policy</TabsTrigger>
            <TabsTrigger value="terms_condition_text">
              Terms & Conditions
            </TabsTrigger>
            <TabsTrigger value="f_a_q">FAQs</TabsTrigger>
          </TabsList>

          {/* Privacy Policy Tab */}
          <TabsContent value="privacy_text">
            <div className="bg-[#1A2230] p-4 rounded-md text-white">
              <Button
                onClick={() =>
                  handleEditClick("privacy_text", privacyList?.privacy_text)
                }
                className="mb-4"
                variant="secondary"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit Privacy Policy
              </Button>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: privacyList?.privacy_text || "",
                }}
              />
            </div>
          </TabsContent>

          {/* Terms & Conditions Tab */}
          <TabsContent value="terms_condition_text">
            <div className="bg-[#1A2230] p-4 rounded-md text-white">
              <Button
                onClick={() =>
                  handleEditClick(
                    "terms_condition_text",
                    privacyList?.terms_condition_text
                  )
                }
                className="mb-4"
                variant="secondary"
              >
                <Pencil className="w-4 h-4 mr-2" /> Edit Terms & Conditions
              </Button>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html: privacyList?.terms_condition_text || "",
                }}
              />
            </div>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="f_a_q">
            <div className="bg-[#1A2230] p-4 rounded-md text-white">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold mb-0">
                  Frequently Asked Questions
                </h2>
                <Button
                  className="mb-0"
                  onClick={() =>
                    setFaqList((prev) => [
                      ...prev,
                      { title: "", description: "", img: "", isNew: true },
                    ])
                  }
                >
                  + Add New FAQ
                </Button>
              </div>

              {faqList.map((faq: any, index: number) => (
                <div
                  key={index}
                  className="border border-gray-600 rounded mb-3 overflow-hidden"
                >
                  {/* Header - Click to Expand */}
                  <div
                    onClick={() =>
                      setExpandedFaq((prev) => (prev === index ? null : index))
                    }
                    className="bg-[#2C3442] px-4 py-3 cursor-pointer flex justify-between items-center"
                  >
                    <span className="font-medium">
                      {faq.title || `Title ${index + 1}`}
                    </span>
                    <span>{expandedFaq === index ? "▲" : "▼"}</span>
                  </div>

                  {/* Expandable Edit Section */}
                  {expandedFaq === index && (
                    <div className="bg-[#1A2230] px-4 py-4">
                      <div className="mb-3">
                        <label className="block text-sm mb-1">Question:</label>
                        <input
                          className="w-full bg-[#2C3442] border border-gray-600 text-white px-3 py-2 rounded"
                          type="text"
                          value={faq.title}
                          onChange={(e) =>
                            handleFaqChange(index, "title", e.target.value)
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm mb-1">Answer:</label>
                        <textarea
                          rows={3}
                          className="w-full bg-[#2C3442] border border-gray-600 text-white px-3 py-2 rounded"
                          value={faq.description}
                          onChange={(e) =>
                            handleFaqChange(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                        />
                      </div>

                      <div className="mb-3">
                        <label className="block text-sm mb-1">Image:</label>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          className="text-white"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              handleFaqChange(index, "img", file); // Save the File object
                            }
                          }}
                        />
                        {faq.img && (
                          <div className="mt-2">
                            <div className="relative w-40 h-auto inline-block">
                              <img
                                src={
                                  faq.img instanceof File
                                    ? URL.createObjectURL(faq.img)
                                    : faq.img
                                }
                                alt={`FAQ ${index + 1}`}
                                className="w-full h-auto rounded border border-gray-500 block"
                              />
                              <button
                                onClick={() => {
                                  handleFaqChange(index, "img", "");
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = "";
                                  }
                                }}
                                className="absolute top-1 right-1 bg-black bg-opacity-70 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-opacity-90 z-50"
                                title="Remove Image"
                                type="button"
                              >
                                ✕
                              </button>
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="flex justify-end">
                        <Button
                          onClick={() => handleFaqSave(index)}
                          disabled={savingIndex === index}
                        >
                          {savingIndex === index ? "Saving..." : "Save"}
                        </Button>
                        <Button
                          variant="destructive"
                          className="ml-2"
                          onClick={() => handleFaqDelete(index)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Modal with CKEditor */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center px-2 sm:px-4">
            <div className="bg-[#1A2230] p-4 sm:p-6 rounded-md w-full max-w-3xl shadow-lg relative max-h-[91vh] overflow-y-auto">
              <h3 className="text-white font-medium text-lg sm:text-xl mb-4">
                Edit Content
              </h3>

              <CkEditor
                editorData={editorData}
                setEditorData={setEditorData}
                handleOnUpdate={handleOnUpdate}
              />

              <div className="mt-4 flex flex-col sm:flex-row justify-end sm:space-x-3 space-y-3 sm:space-y-0">
                <Button
                  variant="secondary"
                  onClick={handleCloseModal}
                  className="w-full sm:w-auto"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleUpdate}
                  disabled={isUpdatePrivacyLoading}
                  className="w-full sm:w-auto"
                >
                  {isUpdatePrivacyLoading ? "Updating..." : "Update"}
                </Button>
              </div>

              <button
                onClick={handleCloseModal}
                className="absolute top-2 sm:top-3 right-2 sm:right-3 text-white hover:text-red-500 text-xl"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {/* Global Loading Overlay */}
        {(isLoading ||
          isFetching ||
          tabLoading ||
          isUpdatePrivacyLoading ||
          isFaqLoading) && <LoadingOverlay />}
      </ApiState>
    </div>
  );
};

export default Editor;
