import React from "react";
import { Button, Image } from "semantic-ui-react";

export default function DeviceArrCom(props) {
  console.log(props.device);
  return (
    <>
      <Button
        animated="fade"
        basic
        device={props.device.mbSeq}
        onClick={props.confirmClick}
        style={{ width: "80px", height: "150px", margin: "0", borderRadius: "0" }}
      >
        <Button.Content visible>{props.device.mbName}</Button.Content>
        <Button.Content hidden style={{ width: "100%", height: "100%", fontSize: "10px", top: "20%" }}>
          <Image src={props.device.mbImgUrl} alt="device_image" style={{ width: "100%", height: "50%" }} />
          {props.device.mbName}
        </Button.Content>
      </Button>
    </>
  );
}
