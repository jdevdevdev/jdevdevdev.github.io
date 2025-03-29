import React from "react";
import styles from "./LargeTextCharacterComponent.module.css";
type Props = {
  type: string,
  character: string,
  index: number,
  orientation?: string,
}
const styleMap: Record<string, string> = {
  "PrimaryDark": styles.PrimaryDark,
  "SecondaryDark": styles.SecondaryDark,
  "TertiaryDark": styles.TertiaryDark,
  "PrimaryLight": styles.PrimaryLight,
  "SecondaryLight": styles.SecondaryLight,
  "TertiaryLight": styles.TertiaryLight,
};
const LargeTextCharacterComponent: React.FC<React.PropsWithChildren<Props>> = ({
  type,
  character,
  index,
  orientation = "vertical"
}) => {
  return (
    <span
      key={index}
      className={[
        styles.LargeTextCharacterComponent,
        styles[orientation],
        styleMap[type] && styleMap[type]
      ].filter(item => item).join(" ")}
      attr-index={index}
    >
      {character}
    </span>
  );
};
export { LargeTextCharacterComponent };
