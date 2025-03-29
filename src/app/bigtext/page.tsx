"use client";
import React, { useState } from "react";
import Image from "next/image";
import { LargeTextInputComponent } from "./LargeTextInputComponent";
import { LargeButtonComponent } from "./LargeButtonComponent";
import { LargeTextDisplayComponent } from "./LargeTextDisplayComponent";
import { QrComponent } from "./QrComponent";
import { FullscreenComponent } from "./FullscreenComponent";
import styles from "./page.module.css";
export default function Page() {
  const [text, setText] = useState("");
  const [fullscreenContent, setFullscreenContent] = useState("");
  const [orientation, setOrientation] = useState("horizontal");
  const [isFullscreen, setFullscreen] = useState(false);
  return (<div className={styles.page}>
    <LargeTextInputComponent
      value={text}
      onChange={(data: string) => {
        setText(data);
      }}
    />
    <LargeButtonComponent
      onClick={() => {
        setFullscreenContent("qrcode");
        setOrientation("vertical");
        setFullscreen(true);
      }}
    >
      <Image src="/qrcode.svg" alt="show qr code" width={100} height={100} />
    </LargeButtonComponent>
    <LargeButtonComponent
      onClick={() => {
        setText("");
      }}
    >
      <Image src="/trashcan.svg" alt="clear" width={100} height={100} />
    </LargeButtonComponent>
    <LargeButtonComponent
      onClick={() => {
        setFullscreenContent("text");
        setOrientation("vertical");
        setFullscreen(true);
      }}
    >
      <Image src="/fullscreen.svg" alt="fullscreen" width={100} height={100} />
    </LargeButtonComponent>
    <FullscreenComponent
      isFullscreenValue={isFullscreen}
      updateFullscreenState={setFullscreen}
    >
      <div>
        {fullscreenContent === "text" ?
          <LargeTextDisplayComponent
            orientation={orientation}
            text={text}
          />
          :
          <QrComponent
            data={text}
          />
        }
        {/*<button
          onClick={() => {
            setFullscreen(false);
          }}
        >
          Exit
        </button>*/}
      </div>
    </FullscreenComponent>
  </div>);
};
