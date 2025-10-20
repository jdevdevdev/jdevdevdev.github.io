"use client";
import React from "react";
import PdfViewer from "./PdfViewer";

export default function Page() {
  return (<div>
    <PdfViewer fileUrl={"/qr-test3.pdf"}></PdfViewer>
  </div>);
}
