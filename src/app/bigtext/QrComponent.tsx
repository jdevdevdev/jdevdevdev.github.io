import { useMemo } from "react";
import { renderSVG } from "uqr";
import styles from "./QrComponent.module.css";

export function QrComponent({ data }: { data: string }) {
  const svgDataUrl = useMemo(() => {
    const svgString = renderSVG(data);
    const base64Svg = btoa(svgString);
    const dataUrl = `data:image/svg+xml;base64,${base64Svg}`;
    return dataUrl;
  }, [data]);
  return (<div
    className={styles.QrComponent}
  >
    <img src={svgDataUrl} alt="QR Code" />
  </div>);
} 
