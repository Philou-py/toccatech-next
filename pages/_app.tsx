import "../styles/helpers.scss";
import "../styles/globals.scss";
import "../styles/typography.scss";
import "../styles/colours.scss";
import "./pageStyles/index.scss";
import { AppProps } from "next/app";
import BreakpointsProvider from "../contexts/BreakpointsContext";
import AuthProvider from "../contexts/AuthContext";
import SnackProvider from "../contexts/SnackContext";
import Footer from "../layouts/Footer";
import { NavBar, SideBar, Avatar } from "../components";
import { useCallback, useMemo, useState } from "react";
import { ApolloProvider } from "@apollo/client";
import client from "../apollo-client";

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

  const disconnectUser = useCallback(() => {
    console.log("Disconnection!");
  }, []);

  return (
    <ApolloProvider client={client}>
      <BreakpointsProvider breakpointsList={breakpointsList}>
        <SnackProvider>
          <AuthProvider>
            <NavBar
              title="Toccatech"
              logoPath="https://toccatech.com/img/logo.fa766f7b.png"
              navLinks={[
                ["Encyclopédie", "/encyclopaedia", false],
                ["Ma Partothèque", "/score-library", false],
              ]}
              userAvatar={
                <Avatar
                  type="image-avatar"
                  borderColour="#33c9ff"
                  src="https://file-server.toccatech.com/files/620d31e0219aa20013c63653"
                  size={50}
                />
              }
              centerNavSmScreens
              onNavIconClick={handleNavIconClick}
              handleAuth
            />
            <SideBar
              showSideBar={sideBarOpen}
              onClose={handleBgClick}
              title="Toccatech"
              userAvatar={
                <Avatar
                  type="image-avatar"
                  borderColour="#33c9ff"
                  src="https://file-server.toccatech.com/files/620d31e0219aa20013c63653"
                  size={150}
                  centerAvatar
                />
              }
              navLinks={[
                ["Encyclopédie", "/encyclopaedia"],
                ["Ma Partothèque", "/score-library", true],
              ]}
              handleAuth
            />
            <div style={{ paddingTop: 60, paddingBottom: 20, overflow: "hidden" }}>
              <Component {...pageProps} />
            </div>
            <Footer />
          </AuthProvider>
        </SnackProvider>
      </BreakpointsProvider>
    </ApolloProvider>
  );
}
