import "../scripts/wdyr.ts";
import "../styles/globals.scss";
import "../styles/typography.scss";
import "../styles/colours.scss";
import "../styles/Container.scss";
import "../styles/Button.scss";
import "../styles/Card.scss";
import "../styles/InputField.scss";
import "../styles/Ripple.scss";
import { AppProps } from "next/app";
import BreakpointsProvider from "../contexts/BreakpointsContext";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <BreakpointsProvider
      breakpointsList={{
        xs: 600, // xs < 600px : Small to big phones
        sm: 960, // 600px < sm < 960px : Small to big tablets
        md: 1264, // 960px < md < 1264px : Big tablets to small computers
        lg: 1904, // 1264px < lg < 1904px : Desktops
        xl: Infinity, // xl > 1904px : 4k screens and ultra-large
      }}
    >
      <Component {...pageProps} />
    </BreakpointsProvider>
  );
}

export default MyApp;
