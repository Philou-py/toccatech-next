import "../styles/globals.scss";
import "../styles/typography.scss";
import "../styles/colours.scss";
import { AppProps } from "next/app";
import BreakpointsProvider from "../contexts/BreakpointsContext";
import NavBar from "../components/NavBar";
import Avatar from "../components/Avatar";
import SideBar from "../components/SideBar";
import Button from "../components/Button";
import Link from "next/link";
import { useCallback, useMemo, useState } from "react";

function MyApp({ Component, pageProps }: AppProps) {
  const breakpointsList = useMemo(
    () => ({
      xs: 600, // xs < 600px : Small to big phones
      sm: 960, // 600px < sm < 960px : Small to big tablets
      md: 1264, // 960px < md < 1264px : Big tablets to small computers
      lg: 1904, // 1264px < lg < 1904px : Desktops
      xl: Infinity, // xl > 1904px : 4k screens and ultra-large
    }),
    []
  );
  const [sideBarOpen, setSideBarOpen] = useState(false);

  const handleNavIconClick = useCallback(() => {
    setSideBarOpen(true);
  }, []);

  const handleBgClick = useCallback(() => {
    setSideBarOpen(false);
  }, []);

  const disconnectUser = useCallback(() => {
    console.log("Disconnection!");
  }, []);

  return (
    <BreakpointsProvider breakpointsList={breakpointsList}>
      <NavBar
        title="Toccatech"
        logoPath="https://toccatech.com/img/logo.fa766f7b.png"
        navLinks={[
          ["Encyclopédie", "/"],
          ["Ma Partothèque", "/"],
          ["Déconnexion", disconnectUser],
        ]}
        userAvatar={
          <Avatar
            type="image-avatar"
            borderColour="#33c9ff"
            src="https://file-server.toccatech.com/files/61222920005f146fca8c708e"
            size={50}
          />
        }
        centerNavSmScreens
        onNavIconClick={handleNavIconClick}
      />
      <SideBar
        showSideBar={sideBarOpen}
        onClose={handleBgClick}
        title="Toccatech"
        userAvatar={
          <Avatar
            type="image-avatar"
            borderColour="#33c9ff"
            src="https://file-server.toccatech.com/files/61222920005f146fca8c708e"
            size={150}
            centerAvatar
          />
        }
        navLinks={[
          ["Encyclopédie", "/"],
          ["Ma Partothèque", "/", true],
        ]}
        authButton={
          <Button
            className="blue-grey"
            onClick={() => {
              console.log("hello");
            }}
          >
            Connexion
          </Button>
        }
      />
      <div style={{ marginTop: 60 }}>
        <Component {...pageProps} />
      </div>
    </BreakpointsProvider>
  );
}

export default MyApp;
