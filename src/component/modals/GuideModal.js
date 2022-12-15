import { useEffect, useState } from "react";
import { Modal, Header, Button, Input, Item, Menu, TextArea, Form } from "semantic-ui-react";

import { useSelector, useDispatch } from "react-redux";
import { guideRedux } from "store/reducers/guideReducer";

import DeviceArrCom from "./DeviceArrCom";

export default function HoleModal(props) {
  const compInfoReducer = useSelector((state) => state.compInfoReducer.compInfoReducer);
  const guideReducer = useSelector((state) => state.guideReducer.guideReducer);
  const dispatch = useDispatch();
  const confirmClick = (event, data) => {
    dispatch(guideRedux(Number(data.device)));
    props.handleClose();
  };
  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");

  const device = compInfoReducer.mobileInfoData;

  const btnColor = [
    "red",
    "orange",
    "yellow",
    "olive",
    "green",
    "teal",
    "blue",
    "violet",
    "purple",
    "pink",
    "brown",
    "grey",
    "black",
  ];

  useEffect(() => {
    console.log(guideReducer);
  }, [guideReducer]);
  function rand(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }
  useEffect(() => {
    if (document.querySelector(".header i.icon")) {
      document.querySelector(".header i.icon").style.width = "auto";
    }
    document.querySelectorAll(".produce button").forEach((btn) => {
      let num = 0;
      for (let i = 0; i < device.length; i++) {
        num = rand(0, btnColor.length);
        // document.querySelectorAll(".produce button")[i].classList.add("black");
      }
      btn.addEventListener("mouseenter", (e) => {
        num = rand(0, btnColor.length);
        for (let i = 0; i < btnColor.length; i++) {
          if (i === num) {
            continue;
          }
          // btn.classList.remove(btnColor[i]);
        }
        btn.classList.add("black");
      });
      btn.addEventListener("mouseleave", () => {
        btn.classList.remove("black");
      });
    });
  });
  return (
    <Modal open={props.modalOpen} size="small" style={{ width: "285px" }} dimmer="blurring">
      <Header
        icon="mobile alternate"
        content={`${crsNameVal} ${holeNameVal}`}
        style={{ borderWidth: "0", width: "50%", paddingRight: "0", margin: "0", display: "inline-block" }}
      />
      <Header
        content="화면 가이드"
        style={{ borderWidth: "0", width: "50%", paddingLeft: "0", float: "right", textAlign: "center" }}
      />

      <Modal.Content style={{ paddingTop: "0" }}>
        <Menu className="produce" style={{ flexWrap: "wrap", width: "242px" }}>
          {device
            ? device.map((item, index) => {
                return <DeviceArrCom key={item.mbName} index={index} device={item} confirmClick={confirmClick} />;
              })
            : ""}
        </Menu>
      </Modal.Content>
    </Modal>
  );
}
