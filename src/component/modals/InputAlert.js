import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { inputAlertRedux } from "../../../store/reducers/inputAlertReducer";
import { Button, Header, Segment, Portal } from "semantic-ui-react";
export default function InputAlert() {
  const modalItem = useSelector((state) => state.inputAlertReducer.inputAlertReducer);
  const dispatch = useDispatch();
  const handleClose = () => {
    dispatch(inputAlertRedux({ isModal: false, header: "", contents: "" }));
  };

  useEffect(() => {
    if (document.querySelector(".inputAlertWrap")) {
      const dragItem = document.querySelector(".inputAlertWrap");
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

        let dragItemWidth = 0,
          dragItemHeignt = 0,
          bodyWidth = 0,
          bodyHeight = 0;

        function moveAt(pageX, pageY) {
          document.querySelector(".inputAlertWrap").style.transform = "transLate(0, 0)";
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

      document.querySelectorAll(".inputAlertWrap button").forEach((btn) => {
        btn.onmouseenter = function () {
          dragItem.onmousedown = null;
        };
      });
      document.querySelectorAll(".inputAlertWrap button").forEach((btn) => {
        btn.onmouseleave = function () {
          dragItem.onmousedown = mousedown;
        };
      });
    }
  });
  useEffect(() => {
    if (modalItem.isModal) {
      document.querySelectorAll("*").forEach((el) => {
        el.style.pointerEvents = "none";
      });
      //   document.querySelector(".inputAlertWrap").style.pointerEvents = "auto";
      document.querySelector(".inputAlertWrap button").style.pointerEvents = "auto";
    } else {
      document.querySelectorAll("*").forEach((el) => {
        el.style.pointerEvents = "auto";
      });
    }
  }, [modalItem.isModal]);
  return (
    <Portal
      // onClose={handleClose}
      open={modalItem.isModal}
    >
      <Segment
        className="inputAlertWrap"
        style={{
          left: "50%",
          position: "absolute",
          top: "10%",
          zIndex: 1000,
          filter: "blur(0) grayscale(1)",
          margin: "0",
          transform: "transLate(-50%,-50%)",
          boxShadow: "2px 1px 2px 0 rgb(34 36 38 / 15%)",
        }}
      >
        <Header>{modalItem.header}</Header>
        <p>{modalItem.contents}</p>

        <Button content="닫기" negative onClick={handleClose} />
      </Segment>
    </Portal>
  );
}
