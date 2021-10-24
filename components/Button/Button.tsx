import { memo, MouseEvent } from "react";
import buttonStyles from "./Button.module.scss";
import colours from "../../styles/colours.module.scss";
import cn from "classnames";
import Ripple from "../Ripple";
import Icon from "../Icon";

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
  children?: string;
}

function Button(props: ButtonProps) {
  const makeIconTemplate = (icon: string, type: string) => (
    <Icon icon={icon} className={buttonStyles[type]} />
  );

  const childrenWithIcons = (
    <>
      {props.prependIcon && makeIconTemplate(props.prependIcon, "prependIcon")}
      {props.children}
      {props.trailingIcon && makeIconTemplate(props.trailingIcon, "trailingIcon")}
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
          buttonStyles.btn,
          colours.btn,
          {
            [buttonStyles.icon]: props.isIconButton,
            [buttonStyles.text]: props.isText,
            [buttonStyles.disabled]: props.isDisabled,
            [buttonStyles[props.size!]]: props.size,
          },
          props.className
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
