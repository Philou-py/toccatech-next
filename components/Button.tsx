import { ReactNode, MouseEvent } from "react";
import cn from "classnames";
import Ripple from "./Ripple";

interface ButtonProps {
  isText?: boolean;
  isDisabled?: boolean;
  title?: string;
  size?: "large";
  isIconButton?: boolean;
  icon?: string;
  prependIcon?: string;
  trailingIcon?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: ReactNode;
}

export default function Button(props: ButtonProps) {
  const makeIconTemplate = (icon: string, type: string) => (
    <span className={"material-icons " + type}>{icon}</span>
  );

  const childrenWithIcons = (
    <>
      {props.prependIcon && makeIconTemplate(props.prependIcon, "prepend")}
      {props.children}
      {props.trailingIcon && makeIconTemplate(props.trailingIcon, "trailing")}
    </>
  );

  const buttonContent = props.isIconButton
    ? makeIconTemplate(props.icon!, "normal")
    : childrenWithIcons;

  return (
    <Ripple>
      <button
        type="button"
        onClick={props.onClick}
        className={cn(
          "btn",
          {
            icon: props.isIconButton,
            text: props.isText,
            disabled: props.isDisabled,
            [props.size!]: props.size,
          },
          props.className
        )}
        disabled={props.isDisabled}
        title={props.title}
      >
        <span className="content">{buttonContent}</span>
      </button>
    </Ripple>
  );
}
