import React from "react";
import styles from "./FullscreenModalComponent.module.css";
type Props = {
  orientation?: "vertical" | "horizontal",
  isFullscreenValue: boolean,
}
export const FullscreenModalComponent: React.FC<React.PropsWithChildren<Props>> = ({
  orientation = "vertical",
  isFullscreenValue = false,
  children
}) => {
  return (
    <div
      className={
        [
          orientation == "horizontal" && styles["fullscreen-horizontal"],
          !isFullscreenValue && styles.hidden,
          styles.fullscreen
        ].join(" ")
      }
    >
      {isFullscreenValue && children}
    </div>
  );
};
