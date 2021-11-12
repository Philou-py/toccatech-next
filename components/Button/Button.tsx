import { memo, MouseEvent } from "react";
import buttonStyles from "./Button.module.scss";
import cn from "classnames";
import Ripple from "../Ripple";
import Icon from "../Icon";

interface ButtonProps {
  isText?: boolean;
  isDisabled?: boolean;
  title?: string;
  size?: "large" | "x-large";
  isIconButton?: boolean;
  iconName?: string;
  prependIcon?: string;
  trailingIcon?: string;
  className?: string;
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  children?: string;
}

function Button(props: ButtonProps) {
  const makeIconTemplate = (iconName: string, type: string) => (
    <Icon iconName={iconName} className={buttonStyles[type]} />
  );

  const childrenWithIcons = (
    <>
      {props.prependIcon && makeIconTemplate(props.prependIcon, "prependIcon")}
      <div className={buttonStyles.text}>{props.children}</div>
      {props.trailingIcon && makeIconTemplate(props.trailingIcon, "trailingIcon")}
    </>
  );

  const buttonContent = props.isIconButton
    ? makeIconTemplate(props.iconName!, "normal")
    : childrenWithIcons;

  return (
    <Ripple>
      <button
        type="button"
        onClick={props.onClick}
        className={cn(
          buttonStyles.btn,
          "btn", // For the colours
          {
            [buttonStyles.icon]: props.isIconButton,
            [buttonStyles.flat]: props.isText,
            [buttonStyles.disabled]: props.isDisabled,
            [buttonStyles[props.size!]]: props.size,
            [props.className!]: props.className && !props.isDisabled,
          }
        )}
        disabled={props.isDisabled}
        title={props.title}
      >
        <span className={buttonStyles.content}>{buttonContent}</span>
      </button>
    </Ripple>
  );
}

export default memo(Button);
