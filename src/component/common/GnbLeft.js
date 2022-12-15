import { useDispatch, useSelector } from "react-redux";
import {
  getActKwd,
  getActSelComp,
  getActSelCrs,
  getActSelHole,
  getActSelPointType,
  getActSaveGeoData,
  getActCancelGeoData,
} from "../../../store/actions/action";

import { useState, useEffect } from "react";
import { newwsRedux } from "store/reducers/newwsReducer";
import { codivSelectRedux } from "store/reducers/codivSelectReducer";
import { crsSelectRedux } from "store/reducers/crsSelectReducer";
import { holeSelectRedux } from "store/reducers/holeSelectReducer";
import { menuSelectRedux } from "store/reducers/menuSelectReducer";
import { btnModalRedux } from "store/reducers/btnModalReducer";
import { areaRedux } from "store/reducers/areaReducer";

import { Menu, Dropdown, Form, Item } from "semantic-ui-react";

export default function Gnb_Left(props) {
  const dispatch = useDispatch();

  const wmg0050s = useSelector((state) => state.mapData.wmg0050s);
  const wmg0100s = useSelector((state) => state.mapData.wmg0100s);
  const wmgLastAct = useSelector((state) => state.mapData.wmgLastAct);

  const codivSelect = useSelector((state) => state.codivSelectReducer.codivSelectReducer);
  const crsSelect = useSelector((state) => state.crsSelectReducer.crsSelectReducer);
  const holeSelect = useSelector((state) => state.holeSelectReducer.holeSelectReducer);
  const menuSelect = useSelector((state) => state.menuSelectReducer.menuSelectReducer);
  const compInfoReducer = useSelector((state) => state.compInfoReducer.compInfoReducer);

  const [kwdVal, setKwdVal] = useState("");
  const coData = props.coData;

  const [compNameVal, setCompNameVal] = useState("업장 선택");

  const [crsCd, setCrsCd] = useState();
  const [selectComp, setSelectComp] = useState([]);

  const [pTypeVal, setPTypeVal] = useState();

  const setAddCompModalTitle = props.setAddCompModalTitle;
  const setAddCompModalItem = props.setAddCompModalItem;
  const setIsModalAddComp = props.setIsModalAddComp;
  const setIsModalModComp = props.setIsModalModComp;
  const setIsModalHoleComp = props.setIsModalHoleComp;
  const setIsModalGuideComp = props.setIsModalGuideComp;
  const setIsModalPinComp = props.setIsModalPinComp;
  const setIsModalTeeComp = props.setIsModalTeeComp;
  const setIsModalIpComp = props.setIsModalIpComp;
  const setIsModalBunkComp = props.setIsModalBunkComp;
  const setIsModalAreaComp = props.setIsModalAreaComp;
  const setIsModalDelComp = props.setIsModalDelComp;
  // const handleChangeKwd = (e) => {
  //   setKwdVal(e.target.value);

  //   if (e.target.value === "") {
  //     dispatch(getActKwd(e.target.value));
  //   }
  // };

  // const handlePressKeyCode = (e) => {
  //   if (e.key == "Enter") {
  //     if (kwdVal !== "") {
  //       dispatch(getActKwd(kwdVal));
  //     }
  //   }
  // };

  const handleSelComp = (e, value, item, index) => {
    // OOPS
    // console.log(">>>>>>>>>>>> handleSelComp >>> value.text2.coDiv : " + value.text2.coDiv);
    // console.log(">>>>>>>>>>>> handleSelComp >>> item : " + item);

    setIsModalHoleComp(false);
    setIsModalGuideComp(false);
    setIsModalPinComp(false);
    setIsModalTeeComp(false);
    setIsModalIpComp(false);
    setIsModalBunkComp(false);
    dispatch(newwsRedux({ contents: "", isModal: false }));

    if (value.text2 !== "N") {
      fetch(`${process.env.NEXT_PUBLIC_WMP_API_URL}gi/req_comp_info?coDiv=${item.coDiv}`)
        .then((response) => response.json())
        .then((result) => dispatch(codivSelectRedux(result.wmgCompInfoData[0])))
        .catch((error) => {
          console.log("error", error);
          dispatch(codivSelectRedux({}));
        });

      document.querySelector(".cours").style.transform = "translate3d(0, 1%, 0)";
    } else {
      setSelectComp([]);
      dispatch(codivSelectRedux({}));
      document.querySelector(".cours").style.transform = "scaleY(0)";
    }

    if (compNameVal !== value.text2.coName) {
      document.querySelector(".input_menu").style.transform = "scaleY(0)";
      document.querySelector(".hole").style.transform = "scaleY(0)";
      props.crsNameFunc("코스 선택");
    }
    setCompNameVal(value.text2.coName);

    if (value.text2.coDiv !== "") {
      dispatch(getActSelComp(value.text2.coDiv));
    }
  };
  useEffect(() => {
    if (codivSelect) setSelectComp(codivSelect.courData);

    // console.log(codivSelect);
  }, [codivSelect]);

  const handleSelCrs = (e, value, item, index) => {
    // console.log(">>>>>>>>>>>> handleSelCrs >>> value.text2.crsDiv : " + value.text2.crsDiv);
    // console.log(">>>>>>>>>>>> handleSelCrs >>> item : " + item);

    props.holeNameFunc("홀 선택");
    setIsModalHoleComp(false);
    setIsModalGuideComp(false);
    setIsModalPinComp(false);
    setIsModalTeeComp(false);
    setIsModalIpComp(false);
    setIsModalBunkComp(false);
    var strCrsNm = "";
    document.querySelector(".input_menu").style.transform = "scaleY(0)";

    if (value.text2.crsName === "ALL" || value.text2 === "N") {
      document.querySelector(".hole").style.transform = "scaleY(0)";
    } else {
      document.querySelector(".hole").style.transform = "translate3d(0, 1%, 0)";
    }
    if (item === undefined) {
      strCrsNm = "코스 선택";
      props.holeNameFunc("홀");

      wmgLastAct.actCrsCd = "N";
      dispatch(crsSelectRedux({}));
      dispatch(newwsRedux({ contents: "", isModal: false }));
    } else {
      if (item.crsCd === "T") {
        props.holeNameFunc("홀");
      }
      strCrsNm = value.text2.crsName;
      wmgLastAct.actCrsCd = value.text2.crsCd;

      if (item !== undefined && item.crsCd !== undefined) {
        setCrsCd(item.crsCd.toUpperCase());
        fetch(`${process.env.NEXT_PUBLIC_WMP_API_URL}gi/req_cour_info?coDiv=${codivSelect.coDiv}`)
          .then((response) => response.json())
          .then((result) => {
            console.log(
              ">>>>>>>>>>>> result.wmgCourInfoData[index] : " + JSON.stringify(result.wmgCourInfoData[index])
            );
            dispatch(crsSelectRedux(result.wmgCourInfoData[index]));
            dispatch(newwsRedux({ contents: "", isModal: true }));
          })
          .catch((error) => console.log("error", error));
      } else {
        dispatch(crsSelectRedux({}));
        dispatch(newwsRedux({ contents: "", isModal: false }));
      }
    }
    props.crsNameFunc(strCrsNm);
  };

  useEffect(() => {
    console.log(crsSelect);
  }, [crsSelect]);

  const handleSelHole = (e, value) => {
    console.log(">>>>>>>>>>>>> handleSelHole!!!");

    setIsModalHoleComp(false);
    setIsModalGuideComp(false);
    setIsModalPinComp(false);
    setIsModalTeeComp(false);
    setIsModalIpComp(false);
    setIsModalBunkComp(false);
    dispatch(newwsRedux({ contents: "", isModal: false }));
    setPTypeVal("");
    dispatch(menuSelectRedux(""));

    var strHoleNo = "";
    if (value.text != "0") {
      document.querySelector(".input_menu").style.transform = "translate3d(0, 1%, 0)";
      if (
        wmgLastAct !== undefined &&
        wmgLastAct.actCrsCd !== undefined &&
        wmgLastAct.actCrsCd !== "" &&
        wmgLastAct.actCrsCd != "N"
      ) {
        strHoleNo = value.text + " 홀";
        if (value.text === "지정 안함") {
          strHoleNo = "홀 선택";
          document.querySelector(".input_menu").style.transform = "scaleY(0)";
        }
      } else {
        strHoleNo = "홀";
      }

      fetch(
        `${process.env.NEXT_PUBLIC_WMP_API_URL}gi/req_comp_detail_info?crsCd=${crsCd}&holeNo=${value.text}&coDiv=${codivSelect.coDiv}`
      )
        .then((response) => response.json())
        .then((result) => dispatch(holeSelectRedux(result.wmgHoleInfoData[0])))
        .catch((error) => console.log("error", error));
    }
    props.holeNameFunc(strHoleNo);

    dispatch(getActSelHole(value.text));
  };
  useEffect(() => {
    console.log(holeSelect);
  }, [holeSelect]);

  const handlePointType = (e, value) => {
    console.log(e.target.innerText);
    console.log(">>>>>>>>>>>>> handlePointType!!!");

    switch (e.target.innerText) {
      case "hole":
        pointeTypeFunc("H");
        break;
      case "pin":
        pointeTypeFunc("P");
        break;
      case "tee":
        pointeTypeFunc("T");
        break;
      case "ip":
        pointeTypeFunc("I");
        break;
      case "dots":
        pointeTypeFunc("D");
        break;
      case "area":
        pointeTypeFunc("A");
        break;

      default:
        break;
    }
  };
  const pointeTypeFunc = (value) => {
    dispatch(menuSelectRedux(value));
    setPTypeVal(value);
    dispatch(getActSelPointType(value));
  };
  useEffect(() => {
    console.log(menuSelect);
  }, [menuSelect]);
  const handleSaveGeoData = (e) => {
    console.log(">>>>>>>>>>>>> handleSaveGeoData!!!");

    dispatch(getActSaveGeoData());
  };

  const handleCancelGeoData = (e) => {
    console.log(">>>>>>>>>>>>> handleCancelGeoData!!!");

    dispatch(getActCancelGeoData());
    setIsModalDelComp(true);
  };

  const handleAddComp = (e, title, item) => {
    console.log(">>>>>>>>>>>>> handleAddComp!!!");

    document.querySelector(".input_menu").style.transform = "scaleY(0)";
    document.querySelector(".hole").style.transform = "scaleY(0)";
    document.querySelector(".cours").style.transform = "scaleY(0)";
    setCompNameVal("업장 선택");
    console.log("Add Comp!!!");
    setIsModalAddComp(true);
    setAddCompModalTitle(title);
    setAddCompModalItem(item);
    dispatch(newwsRedux({ contents: "", isModal: false }));
    setIsModalHoleComp(false);
    setIsModalGuideComp(false);
  };

  const handleModComp = ({ cgDiv }, { coDiv }) => {
    console.log(">>>>>>>>>>>>> handleModComp!!!");

    console.log("Change Comp!!!");
    setIsModalModComp(true);
  };

  useEffect(() => {
    if (wmgLastAct) {
      if (wmg0050s) {
        for (let i = 0; i < wmg0050s.length; i++) {
          if (wmgLastAct.actCoDiv === wmg0050s[i].coDiv) {
            // setCompNameVal("업장" + " >> " + wmg0050s[i].coName);
            break;
          }
        }
      }

      if (wmg0100s) {
        for (let i = 0; i < wmg0100s.length; i++) {
          if (wmgLastAct.actCrsCd === wmg0100s[i].crsCd) {
            // props.crsNameFunc("코스" + " >> " + wmg0100s[i].crsName);
            break;
          }
        }
      }

      if (wmgLastAct.actHoleNo !== undefined && wmgLastAct.actHoleNo !== 0) {
        props.holeNameFunc("홀" + " >> " + wmgLastAct.actHoleNo);
      }
      if (pTypeVal === undefined) {
        if (
          wmgLastAct.actPointType !== undefined &&
          wmgLastAct.actPointType !== "" &&
          wmgLastAct.actPointType !== "N"
        ) {
          setPTypeVal(wmgLastAct.actPointType);
        }
      }
    }
    document.querySelector("*").style.userSelect = "none";
  }, [pTypeVal, props, wmg0050s, wmg0100s, wmgLastAct]);

  let menuItemHole;
  if (
    wmgLastAct.actCrsCd != undefined &&
    wmgLastAct.actCrsCd != "" &&
    wmgLastAct.actCrsCd !== "N" &&
    wmgLastAct.actCrsCd !== "T"
  ) {
    menuItemHole = (
      <>
        <Dropdown.Item key="holeSelect1" text="1" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect2" text="2" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect3" text="3" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect4" text="4" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect5" text="5" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect6" text="6" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect7" text="7" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect8" text="8" onClick={handleSelHole} />
        <Dropdown.Item key="holeSelect9" text="9" onClick={handleSelHole} />
      </>
    );
  } else {
    menuItemHole = <></>;
  }
  const newwsReducer = useSelector((state) => state.newWorkSpace.newWorkSpace);

  useEffect(() => {
    if (document.querySelector(".op0Box")) {
      document.querySelector("#__next > div > div:nth-child(2) > div").appendChild(document.querySelector(".op0Box"));
    }
  });
  return (
    <Menu key={"GnbLeftWrap"} vertical style={{ position: "absolute", bottom: "-3.5%", left: ".1%", zIndex: "100" }}>
      <Dropdown item text="클럽 생성 / 수정" style={{ margin: "0 2%" }}>
        <Dropdown.Menu>
          <Dropdown.Item
            text="클럽 생성"
            style={{ margin: "0 2%", borderBottom: "1px solid rgb(204, 204, 204)", height: "39px" }}
            onClick={(e) => {
              handleAddComp(e, "추가");
            }}
          />
          {coData
            ? coData.map((comps, index) => (
                <Dropdown.Item
                  key={"addCoDiv" + comps.coDiv + index}
                  text={comps.coName}
                  onClick={(e) => {
                    handleAddComp(e, "수정", comps);
                  }}
                />
              ))
            : ""}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        className="workplace"
        item
        text={compNameVal ? compNameVal : "업장 선택"}
        style={{ margin: "0 2%", borderTop: "1px solid rgb(204, 204, 204)" }}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="지정 안함" text2="N" onClick={handleSelComp} />
          {coData
            ? coData.map((comps, index) => (
                <Dropdown.Item
                  key={comps.coDiv + index}
                  text={comps.coName}
                  index={index}
                  text2={comps}
                  onClick={(e, target) => {
                    handleSelComp(e, target, comps, index);
                  }}
                />
              ))
            : ""}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        key="coursDropDown"
        className="cours"
        item
        text={props.crsNameVal}
        style={{
          margin: "0 2%",
          transform: "scaleY(0)",
          borderTop: "1px solid rgb(204, 204, 204)",
        }}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="지정 안함" text2="N" onClick={handleSelCrs} />
          {selectComp
            ? selectComp.map((cours, index) => (
                <Dropdown.Item
                  key={cours.crsName + index}
                  text={cours.crsName}
                  text2={cours}
                  onClick={(e, target) => {
                    handleSelCrs(e, target, cours, index);
                  }}
                />
              ))
            : ""}
        </Dropdown.Menu>
      </Dropdown>

      <Dropdown
        className="hole"
        item
        text={props.holeNameVal}
        style={{
          margin: "0 2%",
          transform: "scaleY(0)",
          borderTop: "1px solid rgb(204, 204, 204)",
        }}
      >
        <Dropdown.Menu>
          <Dropdown.Item text="지정 안함" text2="0" onClick={handleSelHole} />
          {menuItemHole}
        </Dropdown.Menu>
      </Dropdown>

      <Menu.Item
        className="input_menu"
        style={{
          margin: "0 2%",
          transform: "scaleY(0)",
          padding: "0",
        }}
      >
        <Form>
          <div className="field" style={{ margin: "0", borderTop: "1px solid rgb(204, 204, 204)" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(true);
                setIsModalGuideComp(true);
                setIsModalPinComp(false);
                setIsModalTeeComp(false);
                setIsModalIpComp(false);
                setIsModalBunkComp(false);
                setIsModalAreaComp(false);
                dispatch(btnModalRedux(""));
                dispatch(areaRedux({ ismodal: false, action: "data" }));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "H" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "H" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                hole
              </div>
            </div>
          </div>

          <div className="field" style={{ margin: "0" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(false);
                setIsModalGuideComp(false);
                setIsModalPinComp(true);
                setIsModalTeeComp(false);
                setIsModalIpComp(false);
                setIsModalBunkComp(false);
                setIsModalAreaComp(false);
                dispatch(btnModalRedux(""));
                dispatch(areaRedux({ ismodal: false, action: "data" }));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "P" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "P" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                pin
              </div>
            </div>
          </div>

          <div className="field" style={{ margin: "0" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(false);
                setIsModalGuideComp(false);
                setIsModalPinComp(false);
                setIsModalTeeComp(true);
                setIsModalIpComp(false);
                setIsModalBunkComp(false);
                setIsModalAreaComp(false);
                dispatch(btnModalRedux(""));
                dispatch(areaRedux({ ismodal: false, action: "data" }));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "T" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "T" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                tee
              </div>
            </div>
          </div>

          <div className="field" style={{ margin: "0" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(false);
                setIsModalGuideComp(false);
                setIsModalPinComp(false);
                setIsModalTeeComp(false);
                setIsModalIpComp(true);
                setIsModalBunkComp(false);
                setIsModalAreaComp(false);
                dispatch(btnModalRedux(""));
                dispatch(areaRedux({ ismodal: false, action: "data" }));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "I" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "I" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                ip
              </div>
            </div>
          </div>

          <div className="field" style={{ margin: "0" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(false);
                setIsModalGuideComp(false);
                setIsModalPinComp(false);
                setIsModalTeeComp(false);
                setIsModalIpComp(false);
                setIsModalBunkComp(true);
                setIsModalAreaComp(false);
                dispatch(btnModalRedux(""));
                dispatch(areaRedux({ ismodal: false, action: "data" }));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "D" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "D" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                dots
              </div>
            </div>
          </div>
          <div className="field" style={{ margin: "0" }}>
            <div
              onClick={(e) => {
                setIsModalHoleComp(false);
                setIsModalGuideComp(false);
                setIsModalPinComp(false);
                setIsModalTeeComp(false);
                setIsModalIpComp(false);
                setIsModalBunkComp(false);
                setIsModalAreaComp(true);
                dispatch(btnModalRedux(""));
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "inline-block",
                  padding: "10px 16px",
                  background: `${pTypeVal}` === "A" ? "#4282CA" : "#fff",
                  color: `${pTypeVal}` === "A" ? "#fff" : "#000",
                }}
                onClick={handlePointType}
              >
                area
              </div>
            </div>
          </div>
        </Form>
      </Menu.Item>

      {/* <Menu.Item>
        <Button type="button" className="fluid ui blue" onClick={handleSaveGeoData}>
          저장
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button negative className="fluid ui grey button" onClick={handleCancelGeoData}>
          취소
        </Button>
      </Menu.Item> */}
    </Menu>
  );
}
