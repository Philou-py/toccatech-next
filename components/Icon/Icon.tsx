import { memo } from "react";
import iconStyles from "./material-icons.module.scss";
import cn from "classnames";

interface IconProps {
  icon: string;
  className?: string;
  [prop: string]: any;
}

function Icon({ icon, className, ...otherAttributes }: IconProps) {
  return (
    <span className={cn(iconStyles["material-icons"], className)} {...otherAttributes}>
      {icon}
    </span>
  );
}

export default memo(Icon);
