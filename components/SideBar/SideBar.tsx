import { cloneElement, ReactElement, useCallback, useRef, MouseEvent, memo } from "react";
import Link from "next/link";
import sideBarStyles from "./SideBar.module.scss";
import cn from "classnames";

interface SideBarProps {
  showSideBar: boolean;
  title: string;
  userAvatar?: ReactElement;
  navLinks: [string, string, boolean?][];
  authButton?: ReactElement;
  onClose: () => void;
}

function SideBar({ showSideBar, title, userAvatar, navLinks, authButton, onClose }: SideBarProps) {
  const bgRef = useRef(null);
  const handleSideBarClose = useCallback(
    (event: MouseEvent) => {
      if ((event.target as HTMLDivElement).isSameNode(bgRef.current)) {
        onClose();
      } else {
        console.info("You clicked on the sidebar!");
      }
    },
    [onClose]
  );

  return (
    <div className={sideBarStyles.sidebar}>
      {showSideBar && (
        <div className={sideBarStyles.bg} ref={bgRef} onClick={handleSideBarClose}>
          {showSideBar && (
            <div className={sideBarStyles.content}>
              {!userAvatar && (
                <Link href="/" passHref>
                  <h3 className={sideBarStyles.title}>Toccatech</h3>
                </Link>
              )}
              {userAvatar && cloneElement(userAvatar, { className: sideBarStyles.avatar })}
              <ul className={sideBarStyles.navList}>
                {navLinks.map(([name, url, isDisabled]) => (
                  <Link href={url} passHref key={name}>
                    <li className={cn({ disabled: isDisabled })}>{name}</li>
                  </Link>
                ))}
              </ul>
              {authButton &&
                cloneElement(authButton, {
                  className: cn(sideBarStyles.authButton, authButton.props.className),
                })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default memo(SideBar);
