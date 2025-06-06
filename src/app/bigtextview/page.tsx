"use client";
import React, { useEffect, useState } from "react";
import { LargeTextDisplayComponent } from "@/components/shared/LargeTextDisplayComponent"; 
import styles from "./page.module.css";

export default function Page() {
  const [text, setText] = useState("");

  useEffect(() => {
    const hash = decodeURI(window.location.hash) ?? "";
    setText(hash.replace(/^#/, ""));
  }, []);

  return(<div className={styles.BigTextView}>
    <LargeTextDisplayComponent
      orientation={"vertical"}
      text={text}
    />
  </div>);
}