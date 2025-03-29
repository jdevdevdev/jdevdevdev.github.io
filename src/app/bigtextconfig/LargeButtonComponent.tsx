import React from "react";
import styles from "./LargeButtonComponent.module.css";
type Props = {
  onClick?: () => void,
  buttonType?: "clear" | string
}
const LargeButtonComponent: React.FC<React.PropsWithChildren<Props>>  = ({ children, buttonType, onClick } ) => {
  return (<button
    className={buttonType ? styles[buttonType] : undefined}
    onClick={onClick}
  >
    {children}
  </button>);
};
export { LargeButtonComponent };