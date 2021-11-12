import { CSSProperties, memo, useContext } from "react";
import { BreakpointsContext } from "../contexts/BreakpointsContext";

function Footer() {
  const { currentBreakpoint } = useContext(BreakpointsContext);

  const footerStyles: CSSProperties = {
    backgroundColor: "#d69c2f",
    padding: "10px 0",
    textAlign: "center",
    color: "white",
    display: "flex",
    justifyContent: "space-between",
    flexDirection: currentBreakpoint === "xs" || currentBreakpoint === "sm" ? "column" : "row",
  };

  const paragraphStyles: CSSProperties = {
    marginLeft: "5%",
    marginRight: "5%",
  };

  return (
    <footer style={footerStyles}>
      <p style={paragraphStyles}>Réalisé par Philippe Schoenhenz — Avril 2021</p>
      <p style={paragraphStyles}>
        Ce site est open-source ! Son code est disponible sur&nbsp;
        <a
          href="https://github.com/Philou-py/toccatech-next"
          rel="noopener noreferrer"
          target="_blank"
        >
          GitHub
        </a>
        .
      </p>
    </footer>
  );
}

export default memo(Footer);
