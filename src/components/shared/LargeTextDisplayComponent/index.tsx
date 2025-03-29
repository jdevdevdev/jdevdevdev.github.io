import React, { useMemo } from "react";
import { LargeTextCharacterComponent } from "./LargeTextCharacterComponent";
import styles from "./index.module.css";
type Props = {
  text: string,
  orientation?: string,
  dimensions?: { clientHeight: number, clientWidth: number },
}
const typeMap: Record<string, string> = {
  "letter": "Primary",
  "digit": "Secondary",
  "special": "Tertiary",
  "other": "Tertiary"
};
const LargeTextDisplayComponent: React.FC<React.PropsWithChildren<Props>> = ({ text, orientation }) => {
  const fontSize = useMemo(() => {
    const fontSize = (100 / text.length) * 1.6;
    return {
      fontSize: orientation == "horizontal" ? `${fontSize}vh` : `${fontSize}vw`,
      viewportFontSize: orientation == "horizontal" ? "20vh" : "20vw"
    };
  }, [text, orientation]);

  const checkCharType = (char: string) => {
    if (/[a-zA-Z]/.test(char)) return "letter";
    if (/[0-9]/.test(char)) return "digit";
    if (/[!@#$%^&*(),.?":{}|<>`]/.test(char)) return "special";
    return "other";
  };

  const cacheValueArray = useMemo(
    () => [...text].map(
      (value, index) => (
        {
          value,
          index: index + 1,
          type: `${typeMap[checkCharType(value)]}${(index + 1) % 2 > 0 ? "Light" : "Dark"}`
        }
      )
    ),
    [text]
  );

  const inlineStyle: Record<string, string> = {
    "--maxFontSize": `${fontSize.fontSize}`,
    "--viewportFontSize": fontSize.viewportFontSize
  };
  return (<div
    className={styles.LargeTextDisplayComponent}
    style={inlineStyle}
  >
    {
      cacheValueArray.map((data) =>
        <LargeTextCharacterComponent
          key={data.index}
          index={data.index}
          character={data.value}
          type={data.type}
          orientation={orientation}
        />
      )
    }
  </div>);
};
export { LargeTextDisplayComponent };
