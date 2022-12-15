import { useEffect, useState } from "react";
import { Modal, Header, Button, Input, Item, TextArea, Form } from "semantic-ui-react";

import ColorPicker from "../colorPicker/App";

import { useSelector, useDispatch } from "react-redux";
import { teeRedux } from "store/reducers/teeReducer";
import { inputAlertRedux } from "store/reducers/inputAlertReducer";
import { areaRedux } from "store/reducers/areaReducer";

export default function AreaModal(props) {
  const holeSelect = useSelector((state) => state.holeSelectReducer.holeSelectReducer);
  const teeReducer = useSelector((state) => state.teeReducer.teeReducer);
  const areaReducer = useSelector((state) => state.areaReducer.areaReducer);

  const dispatch = useDispatch();

  const confirmClick = (event, data) => {
    dispatch(areaRedux({ ismodal: false, action: data }));
  };

  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");

  const areaArr = [];
  if (holeSelect !== undefined) {
    switch (holeSelect.par) {
      case 3:
        areaArr[0] = "TE";
        areaArr[1] = "GR";
        break;
      case 4:
        areaArr[0] = "TE";
        areaArr[1] = "S1";
        areaArr[2] = "GR";
        break;
      case 5:
        areaArr[0] = "TE";
        areaArr[1] = "S1";
        areaArr[2] = "S2";
        areaArr[3] = "GR";
        break;

      default:
        break;
    }
  }

  useEffect(() => {
    console.log(areaReducer);
    if (document.querySelector(".areaWrap")) {
      const dragItem = document.querySelector(".areaWrap");
      const container = document.querySelector("#__next");
      dragItem.style.userSelect = "none";
      dragItem.style.pointerEvents = "auto";

      dragItem.querySelectorAll(".colorPickerWrap").forEach((el) => {
        el.style.cursor = "pointer";
      });

      let isDrag = false;

      const mousedown = function (event) {
        dragItem.style.cursor = "grabbing";
        isDrag = true;
        let shiftX = event.clientX - dragItem.getBoundingClientRect().left;
        let shiftY = event.clientY - dragItem.getBoundingClientRect().top;

        dragItem.style.position = "absolute";
        dragItem.style.zIndex = 1000;

        // moveAt(event.pageX, event.pageY);

        let dragItemWidth = 0,
          dragItemHeignt = 0,
          bodyWidth = 0,
          bodyHeight = 0;

        function moveAt(pageX, pageY) {
          document.querySelector(".areaWrap").style.transform = "transLate(0, 0)";
          dragItem.style.top = pageY - shiftY + "px";
          dragItem.style.left = pageX - shiftX + "px";
          if (pageX - shiftX < 1) {
            dragItem.style.left = 1 + "px";
          }
          if (pageY - shiftY < 0) {
            dragItem.style.top = 1 + "px";
          }
          if (bodyWidth - dragItemWidth < pageX - shiftX) {
            dragItem.style.left = bodyWidth - dragItemWidth - 1 + "px";
          }
          if (bodyHeight - dragItemHeignt < pageY - shiftY) {
            dragItem.style.top = bodyHeight - dragItemHeignt - 1 + "px";
          }
        }

        function onMouseMove(event) {
          bodyWidth = document.body.getBoundingClientRect().width;
          bodyHeight = document.body.getBoundingClientRect().height;
          dragItemWidth = dragItem.getBoundingClientRect().width;
          dragItemHeignt = dragItem.getBoundingClientRect().height;

          moveAt(event.clientX, event.clientY);
        }
        document.addEventListener("mousemove", onMouseMove);

        dragItem.onmouseup = function (e) {
          dragItem.style.cursor = "grab";
          isDrag = true;
          document.removeEventListener("mousemove", onMouseMove);
          dragItem.onmouseup = null;
        };
        document.addEventListener("mouseout", function (e) {
          document.addEventListener("mouseup", (e) => {
            isDrag = false;
          });
          e = e ? e : window.event;
          var from = e.relatedTarget || e.toElement;
          if (!from || from.nodeName == "HTML") {
            if (!isDrag) {
              document.removeEventListener("mousemove", onMouseMove);
              dragItem.onmouseup = null;
            }
          }
        });
      };
      dragItem.onmousedown = mousedown;
      dragItem.ondragstart = function (e) {
        return false;
      };

      document.querySelectorAll(".areaWrap button").forEach((btn) => {
        btn.onmouseenter = function () {
          dragItem.onmousedown = null;
        };
      });
      document.querySelectorAll(".areaWrap button").forEach((btn) => {
        btn.onmouseleave = function () {
          dragItem.onmousedown = mousedown;
        };
      });
    }
  });

  return (
    <>
      {props.isModalAreaComp && areaReducer.ismodal ? (
        <div
          style={{
            position: "fixed",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            zIndex: "100",
            pointerEvents: "none",
          }}
        >
          <Item
            className="areaWrap"
            style={{
              width: "300px",
              cursor: "grab",
              boxShadow: "1px 3px 3px 0 rgb(0 0 0 / 20%), 1px 3px 15px 2px rgb(0 0 0 / 20%)",
              background: "#fff",
              zIndex: "10000",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "transLate(-50%,-50%)",
            }}
          >
            <Header
              icon="copy outline"
              content={`${crsNameVal} ${holeNameVal}`}
              style={{
                borderWidth: "0",
                width: "50%",
                paddingRight: "0",
                margin: "0",
                display: "inline-block",
                padding: "1.25rem 0 1.25rem 1.5rem ",
              }}
            />
            <Header
              content={`정보 변경`}
              style={{
                borderWidth: "0",
                width: "50%",
                paddingLeft: "0",
                float: "right",
                textAlign: "center",
                padding: "1.25rem 1.5rem 1.25rem 0 ",
                margin: "0",
              }}
            />
            <Item style={{ display: "flex", flexWrap: "wrap", padding: "1.25rem 1.5rem" }}></Item>
            <Item style={{ padding: "0 1.5rem" }}>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                {areaArr.map((item, index) => {
                  return (
                    <Button
                      key={`areaCont${item}`}
                      style={{ marginRight: "7.5px" }}
                      onClick={(e) => {
                        confirmClick(e, item);
                      }}
                    >
                      {item}
                    </Button>
                  );
                })}
              </div>
            </Item>
            <Item
              style={{ display: "flex", justifyContent: "space-between", borderWidth: "0", padding: "1.25rem 1.5rem" }}
            >
              <Button
                type="button"
                className="red"
                onClick={(e) => {
                  confirmClick(e, "D");
                }}
                style={{ padding: "10px 20px", margin: "0 30px 0 0" }}
                content="삭제"
              />
              <Button
                type="button"
                className="gray"
                style={{ background: "#757675", color: "#fff", padding: "10px 20px", margin: "0" }}
                onClick={(e) => {
                  confirmClick(e, "X");
                }}
                content="취소"
              />
            </Item>
          </Item>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
