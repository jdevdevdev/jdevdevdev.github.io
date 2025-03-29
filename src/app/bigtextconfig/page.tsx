"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LargeTextInputComponent } from "./LargeTextInputComponent";
import { LargeButtonComponent } from "./LargeButtonComponent";
import { LargeTextDisplayComponent } from "@/components/shared/LargeTextDisplayComponent";
import { QrComponent } from "./QrComponent";
import { FullscreenComponent } from "./FullscreenComponent";
import styles from "./page.module.css";
export default function Page() {
  const [text, setText] = useState("");
  const [fullscreenContent, setFullscreenContent] = useState("");
  const [orientation, setOrientation] = useState<"horizontal" | "vertical" | undefined>("horizontal");
  const [isFullscreen, setFullscreen] = useState(false);
  return (<div className={styles.page}>
    <div className={styles.BigTextConfig}>
      <LargeTextInputComponent
        value={text}
        onChange={(data: string) => {
          setText(data);
        }}
      />
      <div>
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
        <LargeButtonComponent
          buttonType={"clear"}
          onClick={() => {
            setText("");
          }}
        >
          <Image src="/trashcan.svg" alt="clear" width={100} height={100} />
        </LargeButtonComponent>
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
    </div>
    <FullscreenComponent
      isFullscreenValue={isFullscreen}
      updateFullscreenState={setFullscreen}
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
    </FullscreenComponent>
  </div>);
};
