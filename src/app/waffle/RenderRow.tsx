import { PropsWithChildren } from "react";
import styles from "./page.module.css";

export const RenderRow = ({ children }: PropsWithChildren) => {
  return <div className={styles.boardRow}>{children}</div>;
};