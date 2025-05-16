"use client";

import React, { useState } from "react";
import { useGetPrivacyListQuery } from "@/redux/api/users.api";
import ApiState from "@/components/ApiState";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

interface PrivacyListType {
  privacy_text: string;
  terms_condition_text: string;
  f_a_q: { id: string; title: string; description: string }[];
}

const Editor: React.FC = () => {
  const router = useRouter();
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

  const handleEditClick = (type: string, item: any) => {
    const id = item.id || type;
    const data = item.description || item;

    const queryParams = new URLSearchParams({
      type,
      id,
      data: data,
    });

    router.push(`/privacy-terms/editor?${queryParams.toString()}`);
  };

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
                  {isLoading || isFetching ? (
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
          </div>
        </ApiState>
      </div>
    </>
  );
};

export default Editor;
