import cn from "classnames";
import { ReactNode, useContext, memo } from "react";
import { BreakpointsContext } from "../contexts/BreakpointsContext";

interface ContainerProps {
  large?: boolean;
  narrow?: boolean;
  children: ReactNode;
}

export default function Container({ large, narrow, children }: ContainerProps) {
  const { currentBreakpoint } = useContext(BreakpointsContext);

  return (
    <div
      className={cn("container", currentBreakpoint, {
        large,
        narrow,
      })}
    >
      {children}
    </div>
  );
}
