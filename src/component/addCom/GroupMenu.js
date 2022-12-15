import { useEffect, useState } from "react";
import { Menu, Modal, Header, Button, Icon, Item, Input, Form, Checkbox } from "semantic-ui-react";
import AddCours from "./addCours";
import CoursName from "./CoursName";
import ColorPicker from "../colorPicker/App";
export default function GrupMenu(props) {
  const [countInput, setCountInput] = useState([0]);
  const [isGroup, setIsGroup] = useState();
  const findGroup = (num) => {
    setIsGroup(num);
  };
  const colorPickerArr = [[], [], []];
  const onAddCours = () => {
    let countArr = [...countInput];
    let counter = countArr.slice(-1)[0];
    counter += 1;
    countArr.push(counter);
    setCountInput(countArr);

    setTimeout(() => {
      const menuitem = document.querySelectorAll(".menuitem")[props.isPage - 1];
      menuitem.querySelectorAll("label").forEach((el) => {
        el.setAttribute(
          "style",
          JSON.stringify(labelStyle).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
        );
      });
      const width = document.querySelector(".addComModalWrap").getBoundingClientRect().width;
      let transition = width * countInput.length;
      document.querySelectorAll(".coursNameInner")[props.isPage - 1].style.transform = `translateX(${
        -transition / 2
      }px)`;

      if (countInput.length++) {
        document.querySelector(".addCours").scrollTop =
          (document.querySelector(".addCours").getBoundingClientRect().height * countInput.length) / 3;
      }

      const input = menuitem.querySelectorAll(".addCours input[type=radio]");
      input[input.length - 1].checked = true;
      input[input.length - 1].parentNode.setAttribute(
        "style",
        JSON.stringify(active).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
      );
    }, 10);
  };

  const onRemoveCours = () => {
    if (countInput.length > 1) {
      let countArr = [...countInput];
      let counter = countArr.slice(-1)[0];
      counter -= 1;
      countArr.pop(counter);
      setCountInput(countArr);

      setTimeout(() => {
        const menuitem = document.querySelectorAll(".menuitem")[props.isPage - 1];
        menuitem.querySelectorAll("label").forEach((el) => {
          el.setAttribute(
            "style",
            JSON.stringify(labelStyle).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
          );
        });
        const width = document.querySelector(".coursName").getBoundingClientRect().width;
        let transition = width * (countInput.length - 2);

        document.querySelectorAll(".coursNameInner")[props.isPage - 1].style.transform = `translateX(${-transition}px)`;

        if (countInput.length++) {
          document.querySelector(".addCours").scrollTop =
            (document.querySelector(".addCours").getBoundingClientRect().height * countInput.length) / 3;
        }

        const input = menuitem.querySelectorAll(".addCours input[type=radio]");
        input[input.length - 1].checked = true;
        input[input.length - 1].parentNode.setAttribute(
          "style",
          JSON.stringify(active).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
        );
      }, 10);
    }
  };

  useEffect(() => {
    if (props.title === "수정") {
      setCountInput(props.item.courData.slice(0, props.item.courData.length - 1));
    }
    const width = document.querySelector(".addComModalWrap").getBoundingClientRect().width;
    // document.querySelectorAll(".menuitem").forEach((el) => {
    //   el.style.width = width + "px";
    //   el.querySelector(".item").style.width = width + "px";
    // });

    document.querySelectorAll(".inputSt").forEach((el) => {
      el.querySelector("input").style.width = el.getBoundingClientRect().width + "px";
      el.querySelector("input").style.height = el.getBoundingClientRect().height + "px";
      el.querySelector("input").style.padding = "0 5px";
      el.querySelector("input").style.textAlign = "right";
      el.querySelector("input").setAttribute("oninput", "value = value.replace(/[^0-9]/g, '');");
    });
    document.querySelectorAll(".coName").forEach((el) => {
      el.querySelector("input").style.width = el.getBoundingClientRect().width + "px";
      el.querySelector("input").style.height = el.getBoundingClientRect().height + "px";
      el.querySelector("input").style.padding = "0 5px";
      el.querySelector("input").style.textAlign = "right";
    });
    document.querySelectorAll(".groupCode").forEach((el) => {
      el.querySelector("input").style.width = el.getBoundingClientRect().width + "px";
      el.querySelector("input").style.height = el.getBoundingClientRect().height + "px";
      el.querySelector("input").style.padding = "0 5px";
      el.querySelector("input").style.textAlign = "right";
    });

    const menuitem = document.querySelectorAll(".menuitem")[props.isPage - 1];
    if (menuitem && menuitem.querySelectorAll(".addCours > div label input").length === 1) {
      menuitem
        .querySelector(".addCours > div label")
        .setAttribute(
          "style",
          JSON.stringify(active).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
        );
    }
  }, []);
  const labelStyle = {
      background: "#fff",
      color: "#000",
      width: "20px",
      height: "20px",
      border: "1px solid #DEDFDF",
      "border-radius": "2px",
      display: "inline-block",
      "text-align": "center",
      cursor: "pointer",
      margin: "0 0 0 5px",
    },
    active = {
      background: "#4282CA",
      color: "#fff",
      width: "20px",
      height: "20px",
      border: "1px solid #DEDFDF",
      "border-radius": "2px",
      display: "inline-block",
      "text-align": "center",
      cursor: "pointer",
      margin: "0 0 0 5px",
    };

  const [isSketch, setIsScketch] = useState(false);
  const onSketch = (boolean) => {
    setIsScketch(boolean);
  };

  useEffect(() => {
    // const colorPickerBg = document.querySelector(".colorPickerBg");
    // const addComModalWrap = document.querySelector(".addComModalWrap");
    // if (colorPickerBg && addComModalWrap) {
    //   const node = colorPickerBg.cloneNode(true);
    //   // colorPickerBg.remove();
    //   addComModalWrap.parentNode.prepend(colorPickerBg);
    // }
  }, [isSketch]);
  return (
    <Item className={`GRUP${props.index + 1} menuitem`} style={{ marginTop: "0px", overflow: "hidden", width: "100%" }}>
      <Item style={{ display: "flex", padding: "10px 0", width: "100%" }}>
        <Item style={{ width: "17%" }}>업장 코드</Item>
        <Input
          className="inputSt coCode"
          maxLength={3}
          style={{
            display: "flex",
            padding: "0",
            width: "10%",
            height: "20px",
            textAlign: "right",
            alignItems: "center",
            marginRight: "3px",
          }}
        />

        <Item style={{ width: "17%" }}>업장 이름</Item>
        <Input
          className="coName"
          maxLength={20}
          style={{
            display: "flex",
            padding: "0",
            width: "56%",
            height: "20px",
            textAlign: "right",
            alignItems: "center",
          }}
        />
      </Item>

      <Item style={{ display: "flex", alignItems: "center", padding: "10px 0", overflow: "visible" }}>
        <Item style={{ marginRight: "5px" }}>핀 컬러</Item>
        <ColorPicker
          key="coursColorPicker1"
          isPage={props.isPage}
          index={1}
          groupNum={props.index}
          onSketch={onSketch}
          isSketch={isSketch}
        />
        <ColorPicker
          key="coursColorPicker2"
          isPage={props.isPage}
          index={2}
          groupNum={props.index}
          onSketch={onSketch}
          isSketch={isSketch}
        />
        <ColorPicker
          key="coursColorPicker3"
          isPage={props.isPage}
          index={3}
          groupNum={props.index}
          onSketch={onSketch}
          isSketch={isSketch}
        />
      </Item>

      <div style={{ display: "flex" }}>
        <Item style={{ display: "flex", flexWrap: "wrap", padding: "10px 0", flex: "44% 0 0" }}>
          <div style={{ display: "flex", flexWrap: "wrap", width: "32%", height: "41px" }}>
            <input
              className="removeGroup"
              type="button"
              value={"-"}
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "2px",
                border: "1px solid #DEDFDF",
                padding: "0",
                cursor: "pointer",
              }}
              onClick={(e) => onRemoveCours()}
            />
            <input
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
              }}
              onClick={(e) => onAddCours()}
            />
          </div>
          <AddCours
            findGroup={findGroup}
            isPage={props.isPage}
            countInput={countInput}
            index={props.index}
            item={props.item}
            title={props.title}
          />
        </Item>
        <Item style={{ display: "flex", alignItems: "center", padding: "10px 0", width: "200px" }}>
          <div className="coursNameWrap" style={{ overflow: "hidden" }}>
            <div
              className="coursNameInner"
              style={{ display: "flex", transition: "all .5s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
            >
              {countInput.map((list, index) => {
                return <CoursName key={"CoursName" + index} index={index} />;
              })}
            </div>
          </div>
        </Item>
      </div>
    </Item>
  );
}
