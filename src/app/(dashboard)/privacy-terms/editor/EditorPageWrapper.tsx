"use client";

import dynamic from "next/dynamic";

// Dynamically import the actual editor client component with ssr disabled
const EditorClient = dynamic(() => import("./EditorClient"), {
  ssr: false,
});

export default function EditorPageWrapper() {
  return <EditorClient />;
}
