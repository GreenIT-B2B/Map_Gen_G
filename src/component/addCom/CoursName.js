import React, { useEffect } from "react";
import { Menu, Item, Input } from "semantic-ui-react";
export default function CoursName(props) {
  useEffect(() => {
    document.querySelectorAll(".coursNameInput").forEach((el) => {
      el.querySelector("input").style.width = el.getBoundingClientRect().width + "px";
      el.querySelector("input").style.height = el.getBoundingClientRect().height + "px";
      el.querySelector("input").style.padding = "0 5px";
      el.querySelector("input").style.textAlign = "right";
    });
  });

  return (
    <>
      <Menu.Item className="coursName" style={{ width: "200px" }}>
        <Item style={{ marginRight: "5px", marginBottom: "5px" }}>코스 이름</Item>
        <Input
          maxLength={20}
          className="coursNameInput"
          style={{
            display: "flex",
            padding: "0",
            width: "200px",
            height: "22px",
            textAlign: "right",
            alignItems: "center",
          }}
        />
      </Menu.Item>
    </>
  );
}
