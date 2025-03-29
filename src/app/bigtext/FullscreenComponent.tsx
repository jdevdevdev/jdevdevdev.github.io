import React, { useEffect, useRef } from "react";
import { useFullscreen } from "@/hooks/useFullscreen";
import styles from "./FullscreenComponent.module.css";
type Props = {
  orientation?: "vertical" | "horizontal",
  isFullscreenValue: boolean,
  updateFullscreenState: (param: boolean) => void
}
export const FullscreenComponent: React.FC<React.PropsWithChildren<Props>> = ({
  orientation = "vertical",
  isFullscreenValue = false,
  updateFullscreenState,
  children
}) => {
  const isInitialMount = useRef(true);
  const { fullscreenRef, isFullscreen: internalIsFullscreen, enterFullscreen, exitFullscreen } = useFullscreen();

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    if (isFullscreenValue) {
      enterFullscreen();
    } else {
      exitFullscreen();
    }
  }, [isFullscreenValue, enterFullscreen, exitFullscreen]);

  useEffect(() => {
    if (isInitialMount.current) {
      return;
    }
    updateFullscreenState(internalIsFullscreen);
  }, [internalIsFullscreen, updateFullscreenState]);

  useEffect(() => {
    isInitialMount.current = false;
  }, []);
  return (
    <div
      className={
        [
          orientation == "horizontal" && styles["fullscreen-horizontal"],
          !internalIsFullscreen && styles.hidden,
          styles.fullscreen
        ].join(" ")
      }
      ref={fullscreenRef}
    >
      {internalIsFullscreen && children}
    </div>
  );
};
