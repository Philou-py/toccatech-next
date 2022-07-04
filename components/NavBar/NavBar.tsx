import { ReactElement, useContext, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import navBarStyles from "./NavBar.module.scss";
import cn from "classnames";
import Container from "../Container";
import Button from "../Button";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";
import { AuthContext } from "../../contexts/AuthContext";

interface NavBarProps {
  logoPath: string;
  title: string;
  navLinks: [string, string | (() => void), boolean?][];
  userAvatar?: ReactElement;
  centerNavSmScreens?: boolean;
  onNavIconClick?: () => void;
  fixed?: boolean;
  flat?: boolean;
  handleAuth?: boolean;
}

export default function NavBar({
  centerNavSmScreens,
  logoPath,
  title,
  navLinks,
  userAvatar,
  onNavIconClick,
  fixed = true,
  flat,
  handleAuth,
}: NavBarProps) {
  const { currentBreakpoint } = useContext(BreakpointsContext);
  const { setModalOpen, isAuthenticated, signOut } = useContext(AuthContext);

  const signInSignOut = useCallback(() => {
    if (isAuthenticated) {
      signOut();
    } else {
      setModalOpen(true);
    }
  }, [setModalOpen, isAuthenticated, signOut]);

  const navMenu = (
    <ul className={navBarStyles.navMenu}>
      {navLinks.map(([name, action, requiresAuth]) => {
        if (typeof action === "string") {
          if (!(requiresAuth && !isAuthenticated)) {
            return (
              <Link href={action} passHref key={name}>
                <li>{name}</li>
              </Link>
            );
          } else {
            return (
              <li className={navBarStyles.disabled} key={name}>
                {name}
              </li>
            );
          }
        } else {
          return (
            <li
              className={cn({ [navBarStyles.disabled]: requiresAuth })}
              onClick={!(requiresAuth && !isAuthenticated) ? action : undefined}
              key={name}
            >
              {name}
            </li>
          );
        }
      })}
      {handleAuth && (
        <li onClick={signInSignOut} key={"sign-in-sign-out"}>
          {isAuthenticated ? "Déconnexion" : "Connexion"}
        </li>
      )}
    </ul>
  );

  return (
    <div
      className={cn(navBarStyles.navBar, {
        [navBarStyles.flat]: flat,
        [navBarStyles.fixed]: fixed,
      })}
    >
      <Container className={navBarStyles.navBarContainer}>
        <div
          className={cn(navBarStyles.presentation, {
            [navBarStyles.centerNav]:
              centerNavSmScreens && ["xs", "sm"].includes(currentBreakpoint),
          })}
        >
          {["xs", "sm"].includes(currentBreakpoint) && (
            <Button
              className={cn(navBarStyles.navIconButton, "white--text")}
              type="icon"
              iconName="menu"
              onClick={onNavIconClick}
              isFlat
            />
          )}
          <Link href="/" passHref>
            <div className={navBarStyles.logoAndTitle}>
              <div className={navBarStyles.logoContainer}>
                <Image src={logoPath} alt="Logo" width={50} height={50} />
              </div>
              <h4 className={navBarStyles.title}>{title}</h4>
            </div>
          </Link>
        </div>
        {["md", "lg", "xl"].includes(currentBreakpoint) && navMenu}
        {["md", "lg", "xl"].includes(currentBreakpoint) && userAvatar && (
          <div className={navBarStyles.avatarContainer}>{userAvatar}</div>
        )}
      </Container>
    </div>
  );
}
