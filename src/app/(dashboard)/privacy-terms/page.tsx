"use client";

import React, { useState } from "react";
import CkEditor from "@/components/CkEditor";
import {
  useGetPrivacyListQuery,
  useUpdatePrivacyMutation,
} from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import { Pencil } from "lucide-react";

interface PrivacyListType {
  privacy_text: string;
  terms_condition_text: string;
  f_a_q: { id: string; title: string; description: string }[];
}

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

  const [updatePrivacy, { isLoading: isUpdatePrivacyLoading }] =
    useUpdatePrivacyMutation();

  const [editorData, setEditorData] = useState<string>("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingType, setEditingType] = useState<string | null>(null); // 'privacy', 'terms', 'faq'
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOnUpdate = (editor: string, field: string): void => {
    if (field === "description") {
      setEditorData(editor);
    }
  };

  const handleEditClick = (type: string, item: any) => {
    setEditingType(type);
    setEditingId(item.id || type); // Fallback for static texts
    setEditorData(item.description || item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setEditingType(null);
    setEditorData("");
  };

  const handleUpdate = async () => {
    console.log("Updated content:", editorData);
    console.log("Updating record ID or Type:", editingId, editingType);

    try {
      // if (editingType === "faq") {
      //   // Update a specific FAQ item
      //   await updatePrivacy({
      //     type: "faq",
      //     id: editingId, // required to identify which FAQ item
      //     answer: editorData,
      //   }).unwrap();
      // } else {
      // Update static fields like privacy_text or terms_condition_text
      await updatePrivacy({
        type: editingType, // "privacy_text" or "terms_condition_text"
        value: editorData,
      }).unwrap();
      // }

      // Reset after successful update
      setEditingId(null);
      setEditingType(null);
    } catch (err) {
      console.error("Update failed", err);
      // Optional: show error toast or alert
    }
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <>
      <div className="p-4">
        <ApiState isSuccess={isSuccess} error={error}>
          <ApiState.Error />
          <ApiState.ArthorizeCheck />

          <div className="flex items-center mb-8">
            <div className="flex flex-col flex-1">
              <span className="font-medium text-[32px] leading-[130%] tracking-normal text-white mb-2">
                PRIVACY AND TERMS
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="w-full">
              <table className="w-full border-collapse text-white">
                <thead>
                  <tr className="space-x-1 flex">
                    <th className="py-3 px-4 w-[200px] min-w-[200px] items-center flex font-medium text-[14px] leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                      Title
                    </th>
                    <th className="py-3 px-4 flex-1 font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px]">
                      Description
                    </th>
                    <th className="py-3 px-4 w-[92px] justify-center min-w-[92px] font-medium text-[14px] items-center flex leading-[130%] tracking-normal text-white bg-[#212B3EBF] rounded-[9px] min-h-[48px] text-center">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {/* Skeleton Loaders */}
                  {isFetching ? (
                    [...Array(5)].map((_, index) => (
                      <tr
                        key={index}
                        className="flex space-x-1 animate-pulse *:px-4 *:border-b *:border-[#162332] *:min-h-[56px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                      >
                        <td className="w-[200px]">
                          <div className="bg-gray-700 rounded-md h-6 w-32"></div>
                        </td>
                        <td className="flex-1">
                          <div className="bg-gray-700 rounded-md h-6 w-48"></div>
                        </td>
                        <td className="w-[92px] flex justify-center space-x-2">
                          <div className="bg-gray-700 rounded-md h-6 w-6"></div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <React.Fragment key="static">
                      {/* Static Privacy Text */}
                      <tr
                        key="privacy"
                        className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                      >
                        <td className="w-[200px]">Privacy Policy</td>
                        <td className="flex-1">
                          <div
                            className="text-sm line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: privacyList?.privacy_text || "",
                            }}
                          />
                        </td>
                        <td className="w-[92px] justify-center space-x-2">
                          <button
                            onClick={() =>
                              handleEditClick(
                                "privacy_text",
                                privacyList?.privacy_text
                              )
                            }
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Pencil className="w-[20px]" />
                          </button>
                        </td>
                      </tr>

                      {/* Static Terms and Conditions */}
                      <tr
                        key="terms"
                        className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                      >
                        <td className="w-[200px]">Terms & Conditions</td>
                        <td className="flex-1">
                          <div
                            className="text-sm line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: privacyList?.terms_condition_text || "",
                            }}
                          />
                        </td>
                        <td className="w-[92px] justify-center space-x-2">
                          <button
                            onClick={() =>
                              handleEditClick(
                                "terms_condition_text",
                                privacyList?.terms_condition_text
                              )
                            }
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Pencil className="w-[20px]" />
                          </button>
                        </td>
                      </tr>

                      {/* FAQs */}
                      <tr
                        key="faq"
                        className="flex space-x-1 *:py-3 *:px-4 *:border-b *:border-[#162332] *:min-h-[48px] *:items-center *:flex *:text-[#8F9DAC] *:text-[14px] *:font-normal *:leading-[130%] *:tracking-normal"
                      >
                        <td className="w-[200px]">FAQ</td>
                        <td className="flex-1">
                          <div
                            className="text-sm line-clamp-3"
                            dangerouslySetInnerHTML={{
                              __html: privacyList?.f_a_q || "",
                            }}
                          />
                        </td>
                        <td className="w-[92px] justify-center space-x-2">
                          <button
                            onClick={() =>
                              handleEditClick("faq", privacyList?.f_a_q)
                            }
                            className="text-blue-400 hover:text-blue-600"
                          >
                            <Pencil className="w-[20px]" />
                          </button>
                        </td>
                      </tr>
                    </React.Fragment>
                  )}
                </tbody>
              </table>
            </div>

            {/* CKEditor Area */}
            {isModalOpen && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="bg-[#1A2230] p-6 rounded-md w-[90%] max-w-3xl shadow-lg relative">
                  <h3 className="text-white font-medium text-[18px] mb-4">
                    Edit Description
                  </h3>

                  <CkEditor
                    editorData={editorData}
                    setEditorData={setEditorData}
                    handleOnUpdate={handleOnUpdate}
                  />

                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                      onClick={handleCloseModal}
                    >
                      Cancel
                    </button>
                    <button
                      className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      onClick={async () => {
                        await handleUpdate();
                        handleCloseModal(); // close modal after update
                      }}
                    >
                      Update
                    </button>
                  </div>

                  {/* Optional: Close Icon */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-3 right-3 text-white hover:text-red-500"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        </ApiState>
      </div>
    </>
  );
};

export default Editor;
