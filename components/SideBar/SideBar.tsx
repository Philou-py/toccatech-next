import { useCallback, useContext, useRef, MouseEvent, memo } from "react";
import Link from "next/link";
import sideBarStyles from "./SideBar.module.scss";
import cn from "classnames";
import { AuthContext } from "../../contexts/AuthContext";
import { Button, Avatar } from "..";

interface SideBarProps {
  showSideBar: boolean;
  navLinks: [string, string][];
  handleAuth?: boolean;
  onClose: () => void;
}

function SideBar({ showSideBar, navLinks, handleAuth, onClose }: SideBarProps) {
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
      <div
        className={cn(sideBarStyles.bg, { [sideBarStyles.show]: showSideBar })}
        ref={bgRef}
        onClick={handleSideBarClose}
      >
        <div
          className={cn(sideBarStyles.content, { [sideBarStyles.show]: showSideBar })}
          ref={refForTransition2}
        >
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

          <nav className={sideBarStyles.navList}>
            {navLinks.map(([name, url]) => (
              <Link href={url} key={name}>
                <a>{name}</a>
              </Link>
            ))}
          </nav>
          {handleAuth && (
            <Button className={cn("blue-grey", sideBarStyles.authButton)} onClick={signInSignOut}>
              {isAuthenticated ? "Déconnexion" : "Connexion"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(SideBar);
