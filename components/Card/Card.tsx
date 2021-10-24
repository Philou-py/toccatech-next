import { ReactNode, ReactElement, ComponentType, cloneElement } from "react";
import cardStyles from "./Card.module.scss";
import cn from "classnames";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return <div className={cardStyles["card"]}>{children}</div>;
}

interface CardHeaderProps {
  title: ReactElement;
  centerTitle?: boolean;
  subtitle?: ReactElement;
  action?: ReactElement;
}

export function CardHeader({ title, subtitle, action, centerTitle }: CardHeaderProps) {
  return (
    <div className={cardStyles["card-header"]}>
      <div className={cardStyles.content}>
        {cloneElement(title, {
          className: cn(cardStyles.title, title.props.className),
          style: centerTitle ? { textAlign: "center" } : undefined,
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
  return <div className={cardStyles["card-content"]}>{children}</div>;
}

interface CardActionsProps {
  children: ReactNode;
}

export function CardActions({ children }: CardContentProps) {
  return <div className={cardStyles["card-actions"]}>{children}</div>;
}
