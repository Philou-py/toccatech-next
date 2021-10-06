import { ReactElement, MouseEvent, cloneElement } from "react";
import cn from "classnames";

interface RippleProps {
  children: ReactElement;
  className?: string;
}

export default function Ripple({ children: child, className }: RippleProps) {
  const createRipple = (event: MouseEvent<HTMLDivElement>) => {
    const element = event.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(element.clientWidth, element.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      event.pageX - element.getBoundingClientRect().left - radius - window.pageXOffset
    }px`;
    circle.style.top = `${
      event.pageY - element.getBoundingClientRect().top - radius - window.pageYOffset
    }px`;
    circle.classList.add("ripple");
    element.appendChild(circle);
    // Remove circle after animation
    setTimeout(() => {
      element.removeChild(circle);
    }, 800);
  };

  return cloneElement(child, {
    className: cn("ripple-container", className, child.props.className),
    onMouseDown: createRipple,
  });
}
