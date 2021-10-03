import { ReactNode, ReactElement, ComponentType, cloneElement } from "react";
import cn from "classnames";
import Button from "./Button";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return <div className="card">{children}</div>;
}

interface CardHeaderProps {
  title: ReactElement;
  centerTitle?: boolean;
  subtitle?: ReactElement;
  action?: ReactElement;
}

export function CardHeader({ title, subtitle, action, centerTitle }: CardHeaderProps) {
  return (
    <div className="card-header">
      <div className="content">
        {cloneElement(title, {
          className: cn("title", title.props.className),
          style: centerTitle ? { textAlign: "center" } : undefined,
        })}
        {subtitle &&
          cloneElement(subtitle, { className: cn("subtitle", subtitle.props.className) })}
      </div>
      <div className="action">{action}</div>
    </div>
  );
}

interface CardContentProps {
  children: ReactNode;
}

export function CardContent({ children }: CardContentProps) {
  return <div className="card-content">{children}</div>;
}

interface CardActionsProps {
  children: ReactNode;
}

export function CardActions({ children }: CardContentProps) {
  return <div className="card-actions">{children}</div>;
}
