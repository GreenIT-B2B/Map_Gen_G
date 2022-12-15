import { useEffect, useState } from "react";
import { Modal, Header, Button, Input, Item, Menu, TextArea, Form } from "semantic-ui-react";

import { useSelector, useDispatch } from "react-redux";
import { holeRedux } from "store/reducers/holeReducer";
import { inputAlertRedux } from "store/reducers/inputAlertReducer";

export default function HoleModal(props) {
  const holeSelect = useSelector((state) => state.holeSelectReducer.holeSelectReducer);
  const holeReducer = useSelector((state) => state.holeReducer.holeReducer);
  const dispatch = useDispatch();
  const confirmClick = (event, data) => {
    props.handleClose();
  };
  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");

  const [radioChecked, setRadioChecked] = useState(3);
  const radioHandle = (e) => {
    setRadioChecked(Number(e.target.value));
  };

  const holeSave = () => {
    if (
      document.querySelector(".handicap input").value !== "" &&
      document.querySelector(".holeName input").value !== "" &&
      document.querySelector(".holeExplan").value !== ""
    ) {
      const data = {
        hole: Number(holeNameVal),
        par: Number(document.querySelector('input[name="holeModalParInfo"]:checked').value),
        handi: Number(document.querySelector(".handicap input").value),
        holeNoNm: document.querySelector(".holeName input").value,
        holeExpl: document.querySelector(".holeExplan").value,
      };
      dispatch(holeRedux(data));
      props.handleClose();
    } else {
      const alertArr = [];
      if (document.querySelector(".handicap input").value === "") {
        document.querySelector(".handicap").classList.add("error");
        alertArr.push(" 핸디캡");
      }
      if (document.querySelector(".holeName input").value === "") {
        document.querySelector(".holeName").classList.add("error");
        alertArr.push(" 홀 네임");
      }
      if (document.querySelector(".holeExplan").value === "") {
        document.querySelector(".holeExplan").style.borderColor = "#e0b4b4";
        alertArr.push(" 홀 설명");
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

  const textErrorClear = (e) => {
    if (e.target.value !== "") {
      e.target.parentNode.classList.remove("error");
    }
    if (e.target === document.querySelector(".holeExplan")) {
      e.target.style.borderColor = "";
    }
  };

  useEffect(() => {
    const handicap = document.querySelector(".handicap");
    if (handicap) {
      const input = handicap.querySelector("input");
      input.setAttribute("oninput", "value = value.replace(/[^0-9]/g, '');");
      input.style.padding = "0 5px";
      input.style.textAlign = "right";

      document.querySelector(".handicap input").style.padding = "0 5px";
      document.querySelector(".holeName input").style.padding = "0 5px";
      document.querySelector(".holeExplan").style.padding = "5 5px";
      document.querySelector(".holeExplan").style.resize = "none";
      document.querySelector(".handicap input").style.textAlign = "right";
      document.querySelector(".holeName input").style.textAlign = "right";
      document.querySelector(".holeName input").setAttribute("maxLength", "3");
      document.querySelector(".holeName input").value = holeNameVal;

      if (document.querySelector(".holeModalWrap")) {
        document.querySelectorAll(".holeModalWrap input[type=text]").forEach((el) => {
          el.addEventListener("keyup", textErrorClear);
        });
        document.querySelector(".holeExplan").addEventListener("keyup", textErrorClear);
      }
    }
  });
  useEffect(() => {
    console.log(holeReducer);
  }, [holeReducer]);
  useEffect(() => {
    if (document.querySelector(".holeModalWrap")) {
      if (holeSelect !== undefined) {
        setRadioChecked(holeSelect.par);
        document.querySelector(".handicap input").value = holeSelect.handi;
        document.querySelector(".holeName input").value = holeSelect.holeNoNm;
        document.querySelector(".holeExplan").value = holeSelect.holeExpl;
      }
    }
  }, [props.modalOpen, holeSelect]);
  return (
    <Modal
      className="holeModalWrap"
      open={props.modalOpen}
      size="small"
      style={{ width: "350px", clear: "both" }}
      dimmer="blurring"
    >
      <Header
        icon="copy outline"
        content={`${crsNameVal} ${holeNameVal}Hole`}
        style={{ borderWidth: "0", width: "50%", paddingRight: "0", margin: "0", display: "inline-block" }}
      />
      <Header
        content="홀 정보 변경"
        style={{ borderWidth: "0", width: "50%", paddingLeft: "0", float: "right", textAlign: "center" }}
      />
      <Modal.Content style={{ padding: "0 1.5rem" }}>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <Item style={{ marginRight: "10px", width: "45px" }}>파정보</Item>
          <label
            htmlFor={"holeModalRadio1"}
            style={{
              background: radioChecked === 3 ? "#4282CA" : "#fff",
              color: radioChecked === 3 ? "#fff" : "#000",
              width: "20px",
              height: "20px",
              border: "1px solid #DEDFDF",
              borderRadius: "2px",
              display: "inline-block",
              textAlign: "center",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            3
            <input
              checked={radioChecked === 3}
              id={"holeModalRadio1"}
              type="radio"
              name="holeModalParInfo"
              value={3}
              style={{
                position: "absolute",
                opacity: "0",
              }}
              onChange={(e) => radioHandle(e)}
            />
          </label>
          <label
            htmlFor={"holeModalRadio2"}
            style={{
              background: radioChecked === 4 ? "#4282CA" : "#fff",
              color: radioChecked === 4 ? "#fff" : "#000",
              width: "20px",
              height: "20px",
              border: "1px solid #DEDFDF",
              borderRadius: "2px",
              display: "inline-block",
              textAlign: "center",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            4
            <input
              checked={radioChecked === 4}
              id={"holeModalRadio2"}
              type="radio"
              name="holeModalParInfo"
              value={4}
              style={{
                position: "absolute",
                opacity: "0",
              }}
              onChange={(e) => radioHandle(e)}
            />
          </label>
          <label
            htmlFor={"holeModalRadio3"}
            style={{
              background: radioChecked === 5 ? "#4282CA" : "#fff",
              color: radioChecked === 5 ? "#fff" : "#000",
              width: "20px",
              height: "20px",
              border: "1px solid #DEDFDF",
              borderRadius: "2px",
              display: "inline-block",
              textAlign: "center",
              cursor: "pointer",
              marginRight: "5px",
            }}
          >
            5
            <input
              checked={radioChecked === 5}
              id={"holeModalRadio3"}
              type="radio"
              name="holeModalParInfo"
              value={5}
              style={{
                position: "absolute",
                opacity: "0",
              }}
              onChange={(e) => radioHandle(e)}
            />
          </label>
        </div>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <Item style={{ marginRight: "10px", width: "45px" }}>핸디캡</Item>
          <Input className="handicap" style={{ width: "70px", height: "20px" }} />
        </div>
        <div style={{ display: "flex", marginBottom: "5px" }}>
          <Item style={{ marginRight: "10px", width: "45px" }}>홀이름</Item>
          <Input className="holeName" style={{ width: "70px", height: "20px" }} />
        </div>
        <div>
          <Item style={{ marginBottom: "5px", width: "45px" }}>홀설명</Item>
          <Form>
            <TextArea className="holeExplan" style={{ width: "100%", height: "150px", padding: "2px 5px" }} />
          </Form>
        </div>
      </Modal.Content>
      <Modal.Actions
        style={{
          display: "flex",
          justifyContent: "space-between",
          borderWidth: "0",
          padding: "1.25rem 1.5rem",
        }}
      >
        <Button
          type="button"
          className="gray"
          style={{ background: "#757675", color: "#fff", width: "44%", margin: "0" }}
          onClick={confirmClick}
          content="취소"
        />
        <Button
          type="button"
          className="blue"
          onClick={holeSave}
          style={{ width: "44%", margin: "0" }}
          content="저장"
        />
      </Modal.Actions>
    </Modal>
  );
}
