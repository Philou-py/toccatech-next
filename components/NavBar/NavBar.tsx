import { ReactElement, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import navBarStyles from "./NavBar.module.scss";
import cn from "classnames";
import Container from "../Container";
import Button from "../Button";
import { BreakpointsContext } from "../../contexts/BreakpointsContext";

interface NavBarProps {
  logoPath: string;
  title: string;
  navLinks: [string, string | (() => void), boolean?][];
  userAvatar?: ReactElement;
  centerNavSmScreens?: boolean;
  onNavIconClick?: () => void;
}

export default function NavBar({
  centerNavSmScreens,
  logoPath,
  title,
  navLinks,
  userAvatar,
  onNavIconClick,
}: NavBarProps) {
  const { currentBreakpoint } = useContext(BreakpointsContext);

  const navMenu = (
    <ul className={navBarStyles.navMenu}>
      {navLinks.map(([name, action, isDisabled]) => {
        if (typeof action === "string") {
          if (!isDisabled) {
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
              className={cn({ [navBarStyles.disabled]: isDisabled })}
              onClick={!isDisabled ? action : undefined}
              key={name}
            >
              {name}
            </li>
          );
        }
      })}
    </ul>
  );

  return (
    <div className={navBarStyles.navBar}>
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
              isIconButton
              iconName="menu"
              onClick={onNavIconClick}
              isText
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
