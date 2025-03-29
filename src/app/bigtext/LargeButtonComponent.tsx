import React from "react";
type Props = {
  onClick?: () => void
}
const LargeButtonComponent: React.FC<React.PropsWithChildren<Props>>  = ({ children, onClick } ) => {
  return (<button onClick={onClick}>
    {children}
  </button>);
};
export { LargeButtonComponent };