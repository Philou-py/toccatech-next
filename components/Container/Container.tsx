import { ReactNode, useContext } from "react";
import containerStyles from "./Container.module.scss";
import cn from "classnames";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";

interface ContainerProps {
  large?: boolean;
  narrow?: boolean;
  children: ReactNode;
}

export default function Container({ large, narrow, children }: ContainerProps) {
  const { currentBreakpoint } = useContext(BreakpointsContext);

  return (
    <div
      className={cn(containerStyles["container"], containerStyles[currentBreakpoint], {
        [containerStyles["large"]]: large,
        [containerStyles["narrow"]]: narrow,
      })}
    >
      {children}
    </div>
  );
}
