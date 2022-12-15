import { useEffect } from "react";
import { Modal, Header, Button, Item } from "semantic-ui-react";

import ColorPicker from "../colorPicker/App";

export default function HoleModal(props) {
  const confirmClick = () => {
    props.handleClose();
  };
  const colorPickerArr = [[], [], []];
  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");
  useEffect(() => {
    const sketchPicker = document.querySelectorAll(".sketch-picker input[type='radio']");
    if (sketchPicker) {
      sketchPicker.forEach((el) => {
        el.style.opacity = "0";
      });
    }
  });
  return (
    <Modal
      open={props.modalOpen}
      size="small"
      closeOnEscape={true}
      closeOnRootNodeClick={true}
      style={{ width: "300px" }}
      dimmer="blurring"
    >
      <Header content={`${crsNameVal} ${holeNameVal}Hole`} style={{ borderWidth: "0" }} />
      <Modal.Content style={{ paddingBottom: "5px", display: "flex" }}>
        <Item style={{ marginRight: "20px" }}>핀 컬러</Item>
        {colorPickerArr.map((item, index) => {
          return (
            <>
              <ColorPicker index={index + 1} />
            </>
          );
        })}
      </Modal.Content>
      <Modal.Actions style={{ display: "flex", justifyContent: "center", borderWidth: "0" }}>
        <Button
          type="button"
          className="gray"
          style={{ background: "#757675", color: "#fff", width: "44%", marginLeft: "0" }}
          onClick={confirmClick}
          content="취소"
        />
        <Button type="button" className="blue" onClick={confirmClick} style={{ width: "44%" }} content="저장" />
      </Modal.Actions>
    </Modal>
  );
}
