"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { LargeTextInputComponent } from "./LargeTextInputComponent";
import { LargeButtonComponent } from "./LargeButtonComponent";
import { LargeTextDisplayComponent } from "@/components/shared/LargeTextDisplayComponent";
import { QrComponent } from "./QrComponent";
import { FullscreenModalComponent } from "./FullscreenModalComponent";
import styles from "./page.module.css";
export default function Page() {
  const [text, setText] = useState("");
  const [fullscreenContent, setFullscreenContent] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical" | undefined>("horizontal");
  const [isFullscreen, setFullscreen] = useState(false);
  
  useEffect(() => {
    const hash = decodeURI(window.location.hash) ?? "";
    setText(hash.replace(/^#/, ""));
  }, []);
  
  return (<div className={styles.page}>
    <div className={[styles.BigTextConfig, isFullscreen ? styles.hidden : undefined].filter(item => item).join(" ")}>
      <LargeTextInputComponent
        value={text}
        onChange={(data: string) => {
          setText(data);
        }}
      />
      <div className={styles["BigTextConfig--ButtonPanel"]}>
        <div className={styles["BigTextConfig--qr"]}>
          <LargeButtonComponent
            buttonType={"clear"}
            onClick={() => {
              setFullscreenContent("qrcode");
              setOrientation("vertical");
              setFullscreen(true);
            }}
          >
            <Image src="/qrcode.svg" alt="show qr code" width={100} height={100} />
          </LargeButtonComponent>
        </div>
        <div className={styles["BigTextConfig--bigtext"]}>
          <LargeButtonComponent
            buttonType={"clear"}
            onClick={() => {
              setFullscreenContent("text");
              setOrientation("vertical");
              setFullscreen(true);
            }}
          >
            <Image src="/fullscreen.svg" alt="fullscreen" width={100} height={100} />
          </LargeButtonComponent>
        </div>
        <div className={styles["BigTextConfig--delete"]}>
          <LargeButtonComponent
            onClick={() => {
              setText("");
            }}
          >
            <Image src="/trashcan.svg" alt="clear" width={100} height={100} />
          </LargeButtonComponent>
        </div>
      </div>
    </div>
    <FullscreenModalComponent
      isFullscreenValue={isFullscreen}
      orientation={orientation}
    >
      {fullscreenContent === "text" ?
        <LargeTextDisplayComponent
          orientation={orientation}
          text={text}
        />
        :
        <QrComponent
          data={`https://jdevdevdev.github.io/bigtextview#${text}`}
        />
      }
      <div
        className={
          orientation === "horizontal" ?
            styles["fullscreen--close-horizontal"] : styles["fullscreen--close-vertical"]
        }
      >
        <LargeButtonComponent
          buttonType={"clear"}
          onClick={() => {
            setFullscreen(false);
          }}
        >
          <Image src="/cross.svg" alt="close" width={100} height={100} />
        </LargeButtonComponent>
      </div>
    </FullscreenModalComponent>
  </div>);
};
