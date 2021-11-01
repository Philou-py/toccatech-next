import { memo } from "react";
import iconStyles from "./material-icons.module.scss";
import cn from "classnames";

interface IconProps {
  iconName: string;
  className?: string;
  [prop: string]: any;
}

function Icon({ iconName, className, ...otherAttributes }: IconProps) {
  return (
    <span className={cn(iconStyles["material-icons"], className)} {...otherAttributes}>
      {iconName}
    </span>
  );
}

export default memo(Icon);
