import { PropsWithChildren } from "react";
import styles from "./page.module.css";

export default function Cell({ swapped, children }: PropsWithChildren<{ swapped?: boolean }>) {

  return (
    <div className={`${styles.cell} ${swapped ? styles.swapped : ''}`}>
      {children}
    </div>
  )
}
