import snackBarStyles from "./SnackBar.module.scss";
import { CSSTransition } from "react-transition-group";
import { ReactElement, useState, useEffect } from "react";
import cn from "classnames";

interface SnackBarProps {
  children: ReactElement;
  showSnackBar: boolean;
  snackBarType: "success" | "error" | "info";
}

export default function SnackBar({ children, showSnackBar, snackBarType }: SnackBarProps) {
  const [show, setShow] = useState(false);

  return (
    <div className={snackBarStyles.snackBarComp}>
      <CSSTransition
        in={showSnackBar}
        timeout={500}
        mountOnEnter
        unmountOnExit
        classNames={{
          enter: snackBarStyles.tSnackBarEnter,
          enterActive: snackBarStyles.tSnackBarEnterActive,
          exit: snackBarStyles.tSnackBarExit,
          exitActive: snackBarStyles.tSnackBarExitActive,
        }}
      >
        <div className={snackBarStyles.snackBarWrapper}>
          <div
            className={cn(snackBarStyles.snackBar, {
              green: snackBarType == "success",
              blue: snackBarType == "info",
              red: snackBarType == "error",
            })}
          >
            {children}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}
