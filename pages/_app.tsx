import "../styles/helpers.scss";
import "../styles/globals.scss";
import "../styles/typography.scss";
import "../styles/colours.scss";
import "./pageStyles/index.scss";
import { AppProps } from "next/app";
import toccatechLogo from "../public/images/logo.png";
import BreakpointsProvider from "../contexts/BreakpointsContext";
import AuthProvider from "../contexts/AuthContext";
import SnackProvider from "../contexts/SnackContext";
import Footer from "../layouts/Footer";
import { NavBar, SideBar } from "../components";
import { useCallback, useMemo, useState } from "react";

export default function MyApp({ Component, pageProps }: AppProps) {
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

  return (
    <SnackProvider>
      <AuthProvider>
        <BreakpointsProvider breakpointsList={breakpointsList}>
          <NavBar
            title="Toccatech"
            logoPath={toccatechLogo}
            navLinks={[
              ["Encyclopédie", "/encyclopaedia"],
              ["Ma Partothèque", "/score-library"],
            ]}
            centerNavSmScreens
            onNavIconClick={handleNavIconClick}
            handleAuth
          />
          <SideBar
            showSideBar={sideBarOpen}
            onClose={handleBgClick}
            navLinks={[
              ["Encyclopédie", "/encyclopaedia"],
              ["Ma Partothèque", "/score-library"],
            ]}
            handleAuth
          />
          <div style={{ paddingTop: 60, paddingBottom: 20, overflow: "hidden" }}>
            <Component {...pageProps} />
          </div>
          <Footer />
        </BreakpointsProvider>
      </AuthProvider>
    </SnackProvider>
  );
}
