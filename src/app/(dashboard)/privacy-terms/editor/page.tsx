"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import CkEditor from "@/components/CkEditor";
import { useUpdatePrivacyMutation } from "@/redux/api/users.api";

const PrivacyEditorPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const type = searchParams.get("type");
  const id = searchParams.get("id");
  const initialData = searchParams.get("data");

  const data = searchParams.get("data") ?? "";
  const decodedHtml = decodeURIComponent(data);

  const [editorData, setEditorData] = useState<string>(initialData || "");
  const [updatePrivacy, { isLoading }] = useUpdatePrivacyMutation();

  const handleUpdate = async () => {
    try {
      await updatePrivacy({
        type,
        ...(type === "faq"
          ? { id, answer: editorData }
          : { value: editorData }),
      }).unwrap();
      router.push("/privacy-terms"); // Go back after update
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  return (
    <div className="p-6 min-h-screen bg-[#1A2230] text-white">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Edit {type?.replace("_", " ")}
        </h1>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
        >
          Back
        </button>
      </div>

      <div className="rounded border border-gray-600 overflow-hidden">
        <CkEditor
          editorData={editorData}
          setEditorData={setEditorData}
          handleOnUpdate={(data) => setEditorData(data)}
        />
      </div>

      <div className="mt-4 flex justify-end">
        <button
          disabled={isLoading}
          onClick={handleUpdate}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-white"
        >
          {isLoading ? "Updating..." : "Update"}
        </button>
      </div>
    </div>
  );
};

export default PrivacyEditorPage;
