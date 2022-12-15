import { Header, Image } from "semantic-ui-react";
import GnbTop from "./GnbTop";

export default function Top() {
  return (
    <div>
      <div style={{ display: "flex", paddingTop: 10 }}>
        <div style={{ display: "inline", width: "30px", marginRight: "1%" }}>
          <Image src="/images/logo.png" alt="logo" style={{ width: "100%", height: "100%" }} draggable="false"></Image>
        </div>
        <div style={{ display: "flex", alignItems: "center", fontSize: "30px" }}>
          <span style={{ marginRight: "5px" }}>
            Green<b>It</b>
          </span>
          <Header as="h1" style={{ display: "inline", margin: "0" }}>
            Map Generator
          </Header>
        </div>
      </div>
      <GnbTop />
    </div>
  );
}
