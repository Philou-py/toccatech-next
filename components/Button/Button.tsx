import { CSSProperties, memo, MouseEvent } from "react";
import buttonStyles from "./Button.module.scss";
import cn from "classnames";
import { Ripple, Icon } from "..";

interface ButtonProps {
  isFlat?: boolean;
  type?: "raised" | "outlined" | "icon" | "text";
  isDisabled?: boolean;
  isFullWidth?: boolean;
  title?: string;
  size?: "large" | "x-large";
  iconName?: string;
  prependIcon?: string;
  trailingIcon?: string;
  style?: CSSProperties;
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

  const buttonContent =
    props.type === "icon" ? makeIconTemplate(props.iconName!, "normal") : childrenWithIcons;

  return (
    <Ripple>
      <button
        type="button"
        onClick={props.onClick}
        className={cn(
          buttonStyles.btn,
          "btn", // For the colours
          {
            [buttonStyles.icon]: props.type === "icon",
            [buttonStyles.textButton]: props.type === "text",
            [buttonStyles.outlined]: props.type === "outlined",
            [buttonStyles.flat]: props.isFlat || props.type === "outlined",
            [buttonStyles.disabled]: props.isDisabled,
            [buttonStyles.fullWidth]: props.isFullWidth,
            [buttonStyles[props.size!]]: props.size,
            [props.className!]: props.className && !props.isDisabled,
          }
        )}
        style={props.style}
        disabled={props.isDisabled}
        title={props.title}
      >
        <span className={buttonStyles.content}>{buttonContent}</span>
      </button>
    </Ripple>
  );
}

export default memo(Button);
