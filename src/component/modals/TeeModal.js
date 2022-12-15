import { useEffect, useState } from "react";
import { Modal, Header, Button, Input, Item, TextArea, Form } from "semantic-ui-react";

import ColorPicker from "../colorPicker/App";

import { useSelector, useDispatch } from "react-redux";
import { teeRedux } from "store/reducers/teeReducer";
import { inputAlertRedux } from "store/reducers/inputAlertReducer";

export default function TeeModal(props) {
  const holeSelect = useSelector((state) => state.holeSelectReducer.holeSelectReducer);
  const teeReducer = useSelector((state) => state.teeReducer.teeReducer);
  const teeIsMoReducer = useSelector((state) => state.teeIsMoReducer.teeIsMoReducer);

  const dispatch = useDispatch();

  const teeSave = () => {
    if (
      document.querySelector(".teeTurn input").value !== "" &&
      document.querySelector(".teeName input").value !== "" &&
      document.querySelector(".teeExplan").value !== ""
    ) {
      const data = {
        hole: Number(holeNameVal),
        clr: document.querySelector(".colorPickerWrap").getAttribute("color"),
        code: document.querySelector(".teeCode input").value,
        seq: Number(document.querySelector(".teeTurn input").value),
        nm: document.querySelector(".teeName input").value,
        nmSec: document.querySelector(".teeExplan").value,
      };
      dispatch(teeRedux(data));
      props.handleClose();
    } else {
      const alertArr = [];
      if (document.querySelector(".teeTurn input").value === "") {
        document.querySelector(".teeTurn").classList.add("error");
        alertArr.push(" 티 순번");
      }
      if (document.querySelector(".teeName input").value === "") {
        document.querySelector(".teeName").classList.add("error");
        alertArr.push(" 티 네임");
      }
      if (document.querySelector(".teeCode input").value === "") {
        document.querySelector(".teeCode").classList.add("error");
        alertArr.push(" 티 코드");
      }
      if (document.querySelector(".teeExplan").value === "") {
        document.querySelector(".teeExplan").style.borderColor = "#e0b4b4";
        alertArr.push(" 티 설명");
      }
      dispatch(
        inputAlertRedux({
          isModal: true,
          header: alertArr + "이 빈칸입니다.",
          contents: alertArr + "을 입력해 주세요.",
        })
      );
    }
  };

  useEffect(() => {
    console.log(teeReducer);
  }, [teeReducer]);

  const textErrorClear = (e) => {
    if (e.target.value !== "") {
      e.target.parentNode.classList.remove("error");
    }
    if (e.target === document.querySelector(".teeExplan")) {
      e.target.style.borderColor = "";
    }
  };

  useEffect(() => {
    if (document.querySelector(".teeWrap")) {
      document.querySelectorAll(".teeWrap input[type=text]").forEach((el) => {
        el.addEventListener("keyup", textErrorClear);
      });
      document.querySelector(".teeExplan").addEventListener("keyup", textErrorClear);

      if (teeReducer.seq >= 0) {
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", teeReducer.clr);
        document.querySelector(".teeWrap .colorPickerWrap").style.background = teeReducer.clr;
        document.querySelector(".teeTurn input").value = teeReducer.seq;
        document.querySelector(".teeName input").value = teeReducer.nm;
        document.querySelector(".teeExplan").value = teeReducer.nmSec;
      }
    }
  }, [teeIsMoReducer, props.isModalTeeComp, teeReducer.clr, teeReducer.nm, teeReducer.nmSec, teeReducer.seq]);

  const deleteTee = (event, data) => {
    dispatch(teeRedux("D"));
    props.handleClose();
  };

  const [isSketch, setIsScketch] = useState(false);
  const onSketch = (boolean) => {
    setIsScketch(boolean);
  };
  const confirmClick = (event, data) => {
    props.handleClose();
    dispatch(teeRedux("X"));
  };

  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");
  useEffect(() => {
    const sketchPicker = document.querySelectorAll(".sketch-picker input[type='radio']");
    if (sketchPicker) {
      sketchPicker.forEach((el) => {
        el.style.opacity = "0";
      });
    }
    if (document.querySelector(".teeWrap")) {
      const dragItem = document.querySelector(".teeWrap");
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
          document.querySelector(".teeWrap").style.transform = "transLate(0, 0)";
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

      if (isSketch) {
        document.querySelector(".colorPickerWrap").style.cursor = "auto";

        document.querySelector(".colorPickerWrap").onmouseenter = function () {
          dragItem.onmousedown = null;
        };
        document.querySelector(".colorPickerWrap").onmouseleave = function () {
          dragItem.onmousedown = mousedown;
        };

        document.querySelector(".colorPickerBg").onmouseenter = function () {
          dragItem.onmousedown = null;
          dragItem.style.cursor = "auto";
        };
        document.querySelector(".colorPickerBg").onmouseleave = function () {
          dragItem.onmousedown = mousedown;
          dragItem.style.cursor = "grab";
        };
      }
      dragItem.onmousedown = mousedown;
      dragItem.ondragstart = function (e) {
        return false;
      };
      document.querySelector(".teeTurn input").onmouseenter = function () {
        dragItem.onmousedown = null;
      };
      document.querySelector(".teeTurn input").onmouseleave = function () {
        dragItem.onmousedown = mousedown;
      };
      document.querySelector(".teeTurn input").style.padding = "2px 5px";
      document.querySelector(".teeTurn input").style.width = "222px";
      document.querySelector(".teeTurn input").style.textAlign = "right";
      document.querySelector(".teeTurn input").style.userSelect = "auto";

      document.querySelector(".teeName input").onmouseenter = function () {
        dragItem.onmousedown = null;
      };
      document.querySelector(".teeName input").onmouseleave = function () {
        dragItem.onmousedown = mousedown;
      };
      document.querySelector(".teeCode input").onmouseenter = function () {
        dragItem.onmousedown = null;
      };
      document.querySelector(".teeCode input").onmouseleave = function () {
        dragItem.onmousedown = mousedown;
      };
      document.querySelector(".teeName input").style.padding = "2px 5px";
      document.querySelector(".teeCode input").style.padding = "2px 5px";
      document.querySelector(".teeName input").style.width = "222px";
      document.querySelector(".teeName input").style.textAlign = "right";
      document.querySelector(".teeCode input").style.textAlign = "right";
      document.querySelector(".teeName input").style.userSelect = "auto";

      document.querySelector(".teeExplan").onmouseenter = function () {
        dragItem.onmousedown = null;
      };
      document.querySelector(".teeExplan").onmouseleave = function () {
        dragItem.onmousedown = mousedown;
      };
      document.querySelector(".teeExplan").style.resize = "none";
      document.querySelector(".teeExplan").style.padding = "2px 5px";
      document.querySelector(".teeExplan").style.userSelect = "auto";

      document.querySelectorAll(".teeWrap button").forEach((btn) => {
        btn.onmouseenter = function () {
          dragItem.onmousedown = null;
        };
      });
      document.querySelectorAll(".teeWrap button").forEach((btn) => {
        btn.onmouseleave = function () {
          dragItem.onmousedown = mousedown;
        };
      });
      if (holeSelect !== undefined) {
        // document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color");
      }
      document.querySelector(".teeTurn input").setAttribute("oninput", "value = value.replace(/[^0-9]/g, '');");
    }
  });
  const teeArr = ["레드 티", "옐로우 티", "화이트 티", "블루 티", "블랙 티", "그린 티"];
  const teeBtn = (e, t) => {
    switch (t.value) {
      case 0:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#FF4747");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#FF4747";
        document.querySelector(".teeTurn input").value = 0;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "RED";
        document.querySelector(".teeExplan").value = "Ladies Tee";
        break;
      case 1:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#FFD467");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#FFD467";
        document.querySelector(".teeTurn input").value = 1;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "YELLOW";
        document.querySelector(".teeExplan").value = "Front Tee, Silver Tee, Senior Tee";
        break;
      case 2:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#E8E8E8");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#E8E8E8";
        document.querySelector(".teeTurn input").value = 2;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "WHITE";
        document.querySelector(".teeExplan").value = "Regular Tee";

        break;
      case 3:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#357CE7");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#357CE7";
        document.querySelector(".teeTurn input").value = 3;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "BLUE";
        document.querySelector(".teeExplan").value = "Gold Tee";
        break;
      case 4:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#1E1E1E");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#1E1E1E";
        document.querySelector(".teeTurn input").value = 4;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "BLACK";
        document.querySelector(".teeExplan").value = "Champion Tee, Back Tee";
        break;
      case 5:
        document.querySelector(".teeWrap .colorPickerWrap").setAttribute("color", "#05866F");
        document.querySelector(".teeWrap .colorPickerWrap").style.background = "#05866F";
        document.querySelector(".teeTurn input").value = 3;
        document.querySelector(".teeName input").value = t.children;
        document.querySelector(".teeCode input").value = "GREEN";
        document.querySelector(".teeExplan").value = "Custom Tee, Unknown Tee";
        break;

      default:
        break;
    }
  };

  return (
    <>
      {props.isModalTeeComp ? (
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
            className="teeWrap"
            open={props.modalOpen}
            size="small"
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
              content="티 정보 변경"
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
            <Item style={{ display: "flex", flexWrap: "wrap", padding: "1.25rem 1.5rem" }}>
              {teeArr.map((item, index) => {
                return (
                  <>
                    <Button
                      style={{ margin: "0", flex: "24% 0 0", padding: "5px 0", margin: "0 1% 1% 0" }}
                      onClick={teeBtn}
                      value={index}
                    >
                      {item}
                    </Button>
                  </>
                );
              })}
            </Item>
            <Item style={{ padding: "0 1.5rem" }}>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <Item style={{ marginRight: "10px", width: "45px" }}>티색상</Item>
                <ColorPicker onSketch={onSketch} isSketch={isSketch} />
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <Item style={{ marginRight: "10px", width: "45px" }}>티순번</Item>
                <Input className="teeTurn" style={{ width: "70px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <Item style={{ marginRight: "10px", width: "45px" }}>티이름</Item>
                <Input className="teeName" style={{ width: "70px", height: "20px" }} />
              </div>
              <div style={{ display: "flex", marginBottom: "5px" }}>
                <Item style={{ marginRight: "10px", width: "45px" }}>티코드</Item>
                <Input className="teeCode" style={{ width: "70px", height: "20px" }} />
              </div>
              <div>
                <Item style={{ marginBottom: "5px", width: "45px" }}>티설명</Item>
                <Form>
                  <TextArea className="teeExplan" style={{ width: "100%", height: "150px", padding: "2px 5px" }} />
                </Form>
              </div>
            </Item>
            <Item
              style={{ display: "flex", justifyContent: "space-between", borderWidth: "0", padding: "1.25rem 1.5rem" }}
            >
              <Button
                type="button"
                className="red"
                onClick={deleteTee}
                style={{ padding: "10px 20px", margin: "0 30px 0 0" }}
                content="삭제"
              />
              <Button
                type="button"
                className="gray"
                style={{ background: "#757675", color: "#fff", padding: "10px 20px", margin: "0" }}
                onClick={confirmClick}
                content="취소"
              />
              <Button
                type="button"
                className="blue"
                onClick={teeSave}
                style={{ padding: "10px 20px", margin: "0" }}
                content="저장"
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
