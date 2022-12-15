import React, { useEffect, useState } from "react";
import { Menu, Modal, Header, Button, Input, Checkbox } from "semantic-ui-react";
import PropTypes from "prop-types";
import GroupMenu from "../addCom/GroupMenu";

import { useSelector, useDispatch } from "react-redux";
import { newwsRedux } from "store/reducers/newwsReducer";
import { compInfoRedux } from "store/reducers/compInfoReducer";
import { codivSelectRedux } from "store/reducers/codivSelectReducer";
import { inputAlertRedux } from "store/reducers/inputAlertReducer";

export default function AddCompModal(props) {
  const coData = useSelector((state) => state.compInfoReducer.compInfoReducer);
  const dispatch = useDispatch();

  const [isGroupChecked, setIsGroupChecked] = useState(false);
  const [isPage, setIsPage] = useState(1);
  const [countList, setCountList] = useState([0]);

  const confirmClick = (event, data) => {
    props.handleClose();
    setCountList([0]);
    setIsGroupChecked(false);
  };
  const dataSave = () => {
    let codivArr = [];
    for (let i = 0; i < coData.wmgCompInfoData.length; i++) {
      codivArr.push(coData.wmgCompInfoData[i].coDiv);
    }
    function findCoDiv(element) {
      if (element === document.querySelector(".coCode input").value) {
        return true;
      }
    }
    if (props.title !== "수정") {
      if (!codivArr.some(findCoDiv)) {
        dataSaveFunc();
      } else {
        dispatch(
          inputAlertRedux({
            isModal: true,
            header: "같은 업장코드가 존재합니다.",
            contents: "업장 코드를 변경해 주세요.",
          })
        );
      }
    }
    if (props.title === "수정") {
      if (codivArr.some(findCoDiv)) {
        dataSaveFunc();
      } else {
        dispatch(
          inputAlertRedux({
            isModal: true,
            header: "수정할 업장의 업장코드가 다릅니다.",
            contents: `업장 코드를 "${props.item.coDiv}"로 변경해 주세요.`,
          })
        );
      }
    }
  };
  const dataSaveFunc = () => {
    let coursNameInputValueArr = [];
    document.querySelectorAll(".coursNameInput input").forEach((el) => {});
    for (let i = 0; i < document.querySelectorAll(".coursNameInput input").length; i++) {
      if (document.querySelectorAll(".coursNameInput input")[i].value === "") {
        coursNameInputValueArr.push(` ${i + 1}번 코스 이름`);
        document.querySelectorAll(".coursNameInput")[i].classList.add("error");
        document.querySelectorAll(".addCours label")[i].style.borderColor = "#e0b4b4";
      }
    }
    if (
      document.querySelector(".coCode input").value !== "" &&
      document.querySelector(".coName input").value !== "" &&
      coursNameInputValueArr.length === 0
    ) {
      const data = {
        compData: [
          {
            compInfo: {
              cgDiv: isGroupChecked ? document.querySelector(".groupCode input").value : "",
              coDiv: document.querySelector(".coCode input").value,
              coName: document.querySelector(".coName input").value,
              pinClrF: document.querySelector(".colorPickGroupNum1colorNum1").getAttribute("color"),
              pinClrS: document.querySelector(".colorPickGroupNum1colorNum2").getAttribute("color"),
              pinClrT: document.querySelector(".colorPickGroupNum1colorNum3").getAttribute("color"),
            },
            courData: [
              {
                cgDiv: isGroupChecked ? document.querySelector(".groupCode input").value : "",
                coDiv: document.querySelector(".coCode input").value,
                crsCd: "T",
                crsSeq: 0,
                crsName: "ALL",
                tlLaY: 0.0,
                tlLoX: 0.0,
                trLaY: 0.0,
                trLoX: 0.0,
                blLaY: 0.0,
                blLoX: 0.0,
                brLaY: 0.0,
                brLoX: 0.0,
                zoomW: 0,
                zoomN: 0.0,
              },
            ],
          },
        ],
      };

      const coursName = document.querySelectorAll(".coursNameInput");
      for (let i = 0; i < coursName.length; i++) {
        data.compData[0].courData[i + 1] = {
          cgDiv: isGroupChecked ? document.querySelector(".groupCode input").value : "",
          coDiv: document.querySelector(".coCode input").value,
          crsCd: String.fromCharCode(97 + i).toUpperCase(),
          crsSeq: i + 1,
          crsName: document.querySelectorAll(".coursNameInput input")[i].value,
          tlLaY: 0.0,
          tlLoX: 0.0,
          trLaY: 0.0,
          trLoX: 0.0,
          blLaY: 0.0,
          blLoX: 0.0,
          brLaY: 0.0,
          brLoX: 0.0,
          zoomW: 0,
          zoomN: 0.0,
        };
      }
      dispatch(newwsRedux({ contents: data, isModal: true }));

      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(`${process.env.NEXT_PUBLIC_WMP_API_URL}gi/upd_comp_info`, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          // console.log(result);
          setTimeout(() => {
            fetch(`${process.env.NEXT_PUBLIC_WMP_API_URL}gi/req_comp_info`)
              .then((response) => response.json())
              .then((result) => props.reloadData(result.wmgCompInfoData))
              .catch((error) => console.log("error", error));
          }, 100);
        })
        .catch((error) => console.log("error", error));
      data = {};
      setIsGroupChecked(false);
      props.setIsModalAddComp(false);
    } else {
      const alertArr = [];
      if (document.querySelector(".coCode input").value === "") {
        alertArr.push(" 업장 코드");
        document.querySelector(".coCode").classList.add("error");
      }

      if (document.querySelector(".coName input").value === "") {
        document.querySelector(".coName").classList.add("error");
        alertArr.push(" 업장 이름");
      }
      if (coursNameInputValueArr.length > 0) {
        alertArr.push(coursNameInputValueArr);
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
  const groupChecked = (e) => {
    if (isGroupChecked) {
      document.querySelector(".menuInner").style.transform = "transLateX(0)";
      setCountList([0]);
      setIsPage(1);
      setIsGroupChecked(false);
    } else if (!isGroupChecked) {
      setIsGroupChecked(true);
    }
  };

  useEffect(() => {
    if (props.title === "수정") {
      props.item.cgDiv !== "" ? setIsGroupChecked(true) : setIsGroupChecked(false);
      if (document.querySelector(".groupCode input")) {
        document.querySelector(".groupCode input").value = props.item.cgDiv;
      }
      if (document.querySelector(".coCode input")) {
        document.querySelector(".coCode input").value = props.item.coDiv;
      }
      if (document.querySelector(".coName input")) {
        document.querySelector(".coName input").value = props.item.coName;
      }
      if (
        document.querySelector(".colorPickGroupNum1colorNum1") &&
        document.querySelector(".colorPickGroupNum1colorNum2") &&
        document.querySelector(".colorPickGroupNum1colorNum3")
      ) {
        document.querySelector(".colorPickGroupNum1colorNum1").style.background = props.item.pinClrF;
        document.querySelector(".colorPickGroupNum1colorNum2").style.background = props.item.pinClrS;
        document.querySelector(".colorPickGroupNum1colorNum3").style.background = props.item.pinClrT;
        document.querySelector(".colorPickGroupNum1colorNum1").setAttribute("color", props.item.pinClrF);
        document.querySelector(".colorPickGroupNum1colorNum2").setAttribute("color", props.item.pinClrS);
        document.querySelector(".colorPickGroupNum1colorNum3").setAttribute("color", props.item.pinClrT);
      }
      setTimeout(() => {
        for (let i = 0; i < props.item.courData.length - 1; i++) {
          if (document.querySelectorAll(".coursNameInput input").length + 1 === props.item.courData.length) {
            document.querySelectorAll(".coursNameInput input")[i].value = props.item.courData[i + 1].crsName;
          }
        }
      });
    }
  }, [props]);

  useEffect(() => {
    if (document.querySelector(".groupCode")) {
      document.querySelector(".groupCode input").style.padding = "0 5px";
      document.querySelector(".groupCode input").style.textAlign = "right";
    }
  }, [isGroupChecked]);

  const textErrorClear = (e) => {
    if (e.target.value !== "") {
      e.target.parentNode.classList.remove("error");
    }
  };
  useEffect(() => {
    if (document.querySelector(".addComModalWrap")) {
      document.querySelectorAll(".addComModalWrap input[type=text]").forEach((el) => {
        el.addEventListener("keyup", textErrorClear);
      });
    }
  });
  useEffect(() => {
    // console.log(coData);
  }, [coData]);
  let mapArr = new Array();
  mapArr.length = 25;
  return (
    <>
      <Modal
        dimmer="blurring"
        open={props.modalOpen}
        size="small"
        closeOnEscape={true}
        // closeOnRootNodeClick={true}
        className="addComModalWrap"
        style={{ width: "400px" }}
      >
        <Header icon="browser" content={`업장 ${props.title}`} />
        <Modal.Content>
          <Menu.Item style={{ display: "flex", alignItems: "center", flexWrap: "wrap", height: "25px" }}>
            <Checkbox
              className="groupCheckBox"
              label={isGroupChecked ? "그룹 코드" : "그룹 유무"}
              style={{ marginRight: "10px" }}
              onChange={groupChecked}
              checked={isGroupChecked}
            />
            {isGroupChecked ? (
              <>
                <Input
                  className="inputSt groupCode"
                  maxLength={3}
                  style={{
                    display: "flex",
                    padding: "0",
                    width: "45px",
                    height: "20px",
                    alignItems: "center",
                    marginRight: "10px",
                  }}
                />
              </>
            ) : (
              ""
            )}
          </Menu.Item>

          <div className="menuWrap">
            <div
              className="menuInner"
              style={{ display: "flex", transition: "all .5s cubic-bezier(0.22, 0.61, 0.36, 1)" }}
            >
              {countList.map((list, index) => {
                return (
                  <GroupMenu
                    key={"GroupMenu"}
                    index={index}
                    isPage={isPage}
                    item={props.item}
                    title={props.title}
                    textErrorClear={textErrorClear}
                  />
                );
              })}
            </div>
          </div>
        </Modal.Content>
        <Modal.Actions style={{ display: "flex", justifyContent: "space-around", padding: "1.25rem 1.5rem" }}>
          <Button style={{ width: "45%" }} className="fluid ui blue button" primary onClick={dataSave} content="저장" />
          <Button style={{ width: "45%" }} className="fluid ui gray button" onClick={confirmClick} content="취소" />
        </Modal.Actions>
      </Modal>
    </>
  );
}
AddCompModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  valueIntoModal: PropTypes.string.isRequired,
  reloadData: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  item: PropTypes.any,
  setIsModalAddComp: PropTypes.func.isRequired,
};
