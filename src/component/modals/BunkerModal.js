import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, Header, Button, Item } from "semantic-ui-react";
import { bunkRedux } from "store/reducers/bunkReducer";

export default function BunkerModal(props) {
  const bunkReducer = useSelector((state) => state.bunkReducer.bunkReducer);
  const holeSelectReducer = useSelector((state) => state.holeSelectReducer.holeSelectReducer);
  const dispatch = useDispatch();
  const [countBunk, setCountBunk] = useState([[], [], [], [], [], [], [], [], [], []]);

  const [checkedInput, setCheckedInput] = useState(0);
  const confirmClick = () => {
    props.handleClose();
    // setCountBunk([0]);
    dispatch(bunkRedux("X"));
  };
  const bunkerDelete = () => {
    dispatch(bunkRedux("D"));
    props.handleClose();
  };
  const bunkerSave = () => {
    // console.log(checkedInput);
    dispatch(
      bunkRedux({
        hole: holeNameVal,
        save: Number(checkedInput),
        group: bunkReducer.group !== "" ? bunkReducer.group : "",
      })
    );
    props.handleClose();
  };
  useEffect(() => {
    console.log(bunkReducer);
  }, [bunkReducer]);

  const onAddBunk = () => {
    let countArr = [...countBunk];
    let counter = countArr.slice(-1)[0];
    counter += 1;
    countArr.push(counter);
    setCountBunk(countArr);
    setTimeout(() => {
      document.querySelectorAll("input[name=bunkRadio]")[countBunk.length].checked = true;
      setCheckedInput(countBunk.length);
    }, 10);
  };
  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");

  useEffect(() => {
    if (document.querySelector(".bunkWrap")) {
      if (props.modalOpen) {
        if (bunkReducer.group < 99 && holeSelectReducer.wmg202s.length > 0) {
          if (!document.querySelectorAll(".bunkWrap input[type=radio]")[checkedInput].checked) {
            setTimeout(() => {
              setCheckedInput(bunkReducer.group);
              document.querySelectorAll(".bunkRadio")[checkedInput].checked = true;
            });
          }
        }
        if (bunkReducer.group === 99) {
          // document.querySelectorAll(".bunkWrap input[type=radio]")[checkedInput].checked = true;
        }
      }
    }
  }, [bunkReducer.group, checkedInput]);

  useEffect(() => {
    if (document.querySelector(".bunkWrap")) {
      document.querySelector(".bunkWrap").style.userSelect = "none";
      document.querySelector(".bunkWrap").style.pointerEvents = "auto";

      document.querySelectorAll(".bunkWrap input[type=radio]").forEach((el) => {
        el.setAttribute("name", "bunkRadio");
        el.onchange = function (e) {
          setCheckedInput(e.target.value);
          e.preventDefault();
        };
      });
      if (document.querySelectorAll(".bunkWrap input[type=radio]").length === 1) {
        document.querySelectorAll(".bunkWrap input[type=radio]")[0].checked = true;
      }

      const dragItem = document.querySelector(".bunkWrap");
      const container = document.querySelector("#__next");
      dragItem.style.userSelect = "none";
      dragItem.style.pointerEvents = "auto";

      dragItem.querySelectorAll(".colorPickerWrap").forEach((el) => {
        el.style.cursor = "pointer";
      });

      let isDrag = false;
      let dragItemWidth = 0,
        dragItemHeignt = 0,
        bodyWidth = 0,
        bodyHeight = 0,
        shiftX = 0,
        shiftY = 0;

      const mousedown = function (event) {
        dragItem.style.cursor = "grabbing";
        isDrag = true;
        shiftX = event.clientX - event.target.getBoundingClientRect().left;
        shiftY = event.clientY - event.target.getBoundingClientRect().top;

        dragItem.style.position = "absolute";
        dragItem.style.zIndex = 1000;

        // moveAt(event.clientX, event.clientY);

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

      function moveAt(pageX, pageY) {
        document.querySelector(".bunkWrap").style.transform = "transLate(0, 0)";
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
        event.preventDefault();
      }

      dragItem.onmousedown = mousedown;
      dragItem.ondragstart = function (e) {
        return false;
      };

      document.querySelector(".bunkInputWrap").onmouseenter = function () {
        document.removeEventListener("mousemove", onMouseMove);
        dragItem.onmousedown = null;
      };
      document.querySelector(".bunkInputWrap").onmouseleave = function () {
        dragItem.onmousedown = mousedown;
      };

      document.querySelectorAll(".bunkWrap button").forEach((btn) => {
        btn.onmouseenter = function () {
          document.removeEventListener("mousemove", onMouseMove);
          dragItem.onmousedown = null;
        };
      });
      document.querySelectorAll(".bunkWrap button").forEach((btn) => {
        btn.onmouseleave = function () {
          dragItem.onmousedown = mousedown;
        };
      });

      // document.querySelector(".addGroup").onmouseenter = function () {
      //   dragItem.onmousedown = null;
      // };
      // document.querySelector(".addGroup").onmouseleave = function () {
      //   dragItem.onmousedown = mousedown;
      // };
    }
  });

  useEffect(() => {
    if (props.isModalBunkComp) {
      setCheckedInput(0);
    }
  }, [props.isModalBunkComp]);

  return (
    <>
      {props.modalOpen ? (
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
          <div
            className="bunkWrap"
            style={{
              width: "300px",
              cursor: "grab",
              boxShadow: "1px 3px 3px 0 rgb(0 0 0 / 20%), 1px 3px 15px 2px rgb(0 0 0 / 20%)",
              background: "rgba(255,255,255,1)",
              zIndex: "10000",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "transLate(-50%,-50%)",
            }}
          >
            <Header
              icon="crosshairs"
              content={`${crsNameVal} ${holeNameVal}`}
              style={{
                borderWidth: "0",
                width: "50%",
                paddingRight: "0",
                margin: "0",
                display: "inline-block",
                padding: "1.25rem 0 1.5rem 1.25rem",
                pointerEvents: "none",
              }}
            />
            <Header
              content="닷 정보 변경"
              style={{
                borderWidth: "0",
                width: "50%",
                paddingLeft: "0",
                float: "right",
                textAlign: "center",
                padding: "1.25rem 1.5rem 1.25rem 0",
                margin: "0",
                pointerEvents: "none",
              }}
            />
            <Item
              className="bunkInputWrap"
              style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                padding: "5px 1.5rem",
                pointerEvents: "auto",
                cursor: "auto",
              }}
            >
              {countBunk.map((item, index) => {
                return (
                  <label
                    key={index + "bunker"}
                    htmlFor={`BUNK${index + 1}`}
                    style={{
                      width: "20px",
                      height: "20px",
                      border: "1px solid #DEDFDF",
                      borderRadius: "2px",
                      display: "inline-block",
                      textAlign: "center",
                      cursor: "pointer",
                      marginRight: "5px",
                      background: `${checkedInput}` === `${index}` ? "#4282CA" : "#fff",
                      color: `${checkedInput}` === `${index}` ? "#fff" : "#000",
                    }}
                  >
                    <input
                      id={`BUNK${index + 1}`}
                      className="bunkRadio"
                      type="radio"
                      value={index}
                      style={{
                        position: "absolute",
                        opacity: "0",
                        cursor: "pointer",
                      }}
                    />
                    {index + 1}
                  </label>
                );
              })}
              {/* <input
                className="addGroup"
                type="button"
                value={"+"}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "2px",
                  border: "1px solid #DEDFDF",
                  padding: "0",
                  cursor: "pointer",
                  pointerEvents: "auto",
                }}
                onClick={onAddBunk}
              /> */}
            </Item>
            <Item
              style={{
                padding: "1.25rem 1.5rem",
                pointerEvents: "none",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                type="button"
                color="red"
                onClick={bunkerDelete}
                style={{ padding: "10px 20px", margin: "0 30px 0 0", pointerEvents: "auto" }}
                content="삭제"
              />
              <Button
                type="button"
                color="grey"
                style={{
                  background: "#757675",
                  color: "#fff",
                  padding: "10px 20px",
                  margin: "0",
                  pointerEvents: "auto",
                }}
                onClick={confirmClick}
                content="취소"
              />
              <Button
                type="button"
                color="blue"
                onClick={bunkerSave}
                style={{ padding: "10px 20px", margin: "0", pointerEvents: "auto" }}
                content="저장"
              />
            </Item>
          </div>
        </div>
      ) : (
        ""
      )}
    </>
  );
}
