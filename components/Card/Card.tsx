import { ReactNode, ReactElement, ComponentType, cloneElement } from "react";
import cardStyles from "./Card.module.scss";
import cn from "classnames";

interface CardProps {
  cssWidth?: string;
  children: ReactNode;
}

export default function Card({ cssWidth, children }: CardProps) {
  let styles: Record<string, string> = {};
  if (cssWidth) styles["--card-width"] = cssWidth;
  return (
    <div className={cardStyles["card"]} style={styles}>
      {children}
    </div>
  );
}

interface CardHeaderProps {
  title: ReactElement;
  centerTitle?: boolean;
  subtitle?: ReactElement;
  action?: ReactElement;
}

export function CardHeader({ title, subtitle, action, centerTitle }: CardHeaderProps) {
  return (
    <div className={cardStyles.cardHeader}>
      <div className={cardStyles.content}>
        {cloneElement(title, {
          className: cn(cardStyles.title, title.props.className),
          style: centerTitle ? { textAlign: "center", ...title.props.style } : title.props.style,
        })}
        {subtitle &&
          cloneElement(subtitle, {
            className: cn(cardStyles.subtitle, subtitle.props.className),
          })}
      </div>
      <div className={cardStyles.action}>{action}</div>
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return <div className={cardStyles.cardContent}>{children}</div>;
}

interface CardActionsProps {
  children: ReactNode;
}

export function CardActions({ children }: CardContentProps) {
  return <div className={cardStyles.cardActions}>{children}</div>;
}
