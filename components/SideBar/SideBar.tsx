import { ReactElement, useCallback, useContext, useRef, MouseEvent, memo } from "react";
import Link from "next/link";
import sideBarStyles from "./SideBar.module.scss";
import cn from "classnames";
import { CSSTransition } from "react-transition-group";
import { AuthContext } from "../../contexts/AuthContext";
import { Button, Avatar } from "..";

interface SideBarProps {
  showSideBar: boolean;
  title: string;
  navLinks: [string, string, boolean?][];
  authButton?: ReactElement;
  handleAuth?: boolean;
  onClose: () => void;
}

function SideBar({ showSideBar, title, navLinks, authButton, handleAuth, onClose }: SideBarProps) {
  const { isAuthenticated, setModalOpen, signOut, currentUser } = useContext(AuthContext);

  const bgRef = useRef(null);
  const refForTransition2 = useRef(null);

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

  const signInSignOut = useCallback(() => {
    if (isAuthenticated) {
      signOut();
    } else {
      setModalOpen(true);
    }
  }, [setModalOpen, isAuthenticated, signOut]);

  return (
    <div className={sideBarStyles.sidebar}>
      <CSSTransition
        nodeRef={bgRef}
        in={showSideBar}
        mountOnEnter
        unmountOnExit
        timeout={300}
        classNames={{
          enter: sideBarStyles.tBgEnter,
          enterActive: sideBarStyles.tBgEnterActive,
          exit: sideBarStyles.tBgExit,
          exitActive: sideBarStyles.tBgExitActive,
        }}
      >
        <div className={sideBarStyles.bg} ref={bgRef} onClick={handleSideBarClose}>
          <CSSTransition
            nodeRef={refForTransition2}
            in={showSideBar}
            appear
            timeout={300}
            classNames={{
              appear: sideBarStyles.tSidebarAppear,
              appearActive: sideBarStyles.tSidebarAppearActive,
              enter: sideBarStyles.tSidebarEnter,
              enterActive: sideBarStyles.tSidebarEnterActive,
              exit: sideBarStyles.tSidebarExit,
              exitActive: sideBarStyles.tSidebarExitActive,
            }}
          >
            <div className={sideBarStyles.content} ref={refForTransition2}>
              {!isAuthenticated && (
                <Link href="/">
                  <a style={{ textDecoration: "none" }}>
                    <h3 className={sideBarStyles.title}>Toccatech</h3>
                  </a>
                </Link>
              )}
              {isAuthenticated && currentUser!.avatarURL && (
                <Avatar
                  type="image-avatar"
                  className={sideBarStyles.avatar}
                  borderColour="#33c9ff"
                  src={currentUser!.avatarURL}
                  size={150}
                />
              )}
              {isAuthenticated && !currentUser!.avatarURL && (
                <Avatar
                  type="initials-avatar"
                  className={sideBarStyles.avatar}
                  initials={currentUser!.username
                    .split(" ")
                    .map((part) => part[0].toUpperCase())
                    .join("")}
                  borderColour="#33c9ff"
                  size={150}
                />
              )}

              <ul className={sideBarStyles.navList}>
                {navLinks.map(([name, url, isDisabled]) => (
                  <Link href={url} key={name}>
                    <a style={{ textDecoration: "none", color: "black" }}>
                      <li className={cn({ disabled: isDisabled })}>{name}</li>
                    </a>
                  </Link>
                ))}
              </ul>
              {handleAuth && (
                <Button
                  className={cn("blue-grey", sideBarStyles.authButton)}
                  onClick={signInSignOut}
                >
                  {isAuthenticated ? "Déconnexion" : "Connexion"}
                </Button>
              )}
            </div>
          </CSSTransition>
        </div>
      </CSSTransition>
    </div>
  );
}

export default memo(SideBar);
