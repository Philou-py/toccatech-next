import { ReactNode, ReactElement, ComponentType, cloneElement } from "react";
import cardStyles from "./Card.module.scss";
import cn from "classnames";

interface CardProps {
  cssWidth?: string;
  media?: ReactElement;
  mediaPosition?: "top" | "right" | "left";
  mediaClassName?: string;
  mainContentClassName?: string;
  className?: string;
  children?: ReactNode;
}

export default function Card({
  cssWidth,
  media,
  mediaPosition,
  mediaClassName,
  mainContentClassName,
  className,
  children,
}: CardProps) {
  let styles: Record<string, string> = {};
  if (cssWidth) styles["--card-width"] = cssWidth;
  const mediaPositionClass = mediaPosition
    ? cardStyles["media" + mediaPosition[0].toUpperCase() + mediaPosition.slice(1)]
    : undefined;
  return (
    <div className={cn(cardStyles.card, mediaPositionClass, className)} style={styles}>
      {media && <div className={cn(cardStyles.media, mediaClassName)}>{media}</div>}
      <div className={cn(cardStyles.mainContent, mainContentClassName)}>{children}</div>
    </div>
  );
}

interface CardHeaderProps {
  title: ReactElement;
  centerTitle?: boolean;
  subtitle?: ReactElement;
  action?: ReactElement;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className, centerTitle }: CardHeaderProps) {
  return (
    <div className={cn(cardStyles.cardHeader, className)}>
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
  className?: string;
  children?: ReactNode;
}

export function CardContent({ className, children }: CardContentProps) {
  return <div className={cn(cardStyles.cardContent, className)}>{children}</div>;
}

interface CardActionsProps {
  className?: string;
  children?: ReactNode;
}

export function CardActions({ className, children }: CardContentProps) {
  return <div className={cn(cardStyles.cardActions, className)}>{children}</div>;
}
