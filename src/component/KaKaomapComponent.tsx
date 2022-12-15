import React, { forwardRef, Ref, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { areltRedux } from "store/reducers/areltReducer";
import { compInfoRedux } from "store/reducers/compInfoReducer";

import GnbLeft from "./common/GnbLeft";
import CommonModal from "./modals/CommonModal";
import AlertModal from "./modals/AlertModal";
import SearchModal from "./modals/SearchModal";

import MapChangeBtn from "./modals/MapChangeBtn";
import AddCompModal from "./modals/AddCompModal";
import ModCompModal from "./modals/ModCompModal";
import HoleModal from "./modals/HoleModalBtn";
// import PinModal from "./modals/PinModal";
import AreaModal from "./modals/AreaModal";
import TeeModal from "./modals/TeeModalBtn";
import BunkerModal from "./modals/bunkerModalBtn";
import DeleteModal from "./modals/DeleteModal";
import CaSaModal from "./modals/CaSaModal";
import InputAlert from "./modals/InputAlert";

type KakaomapComponentProps = {
  ref: Ref<HTMLDivElement>;
};

const KakaomapComponent: React.FC<KakaomapComponentProps> = forwardRef((props, ref) => {
  const mdCommon = useSelector((state: any) => state.compInfoReducer.compInfoReducer);
  const mdAlert = useSelector((state: any) => state.areltReducer.areltReducer);
  const mdSearch = useSelector((state: any) => state.newWorkSpace);

  const [modalCommon, setModalCommon] = useState({ isModalCommon: false, contents: "" });
  const [modalArelt, setModalArelt] = useState({ isModal: false, contents: "" });
  const [modalSearch, setModalSearch] = useState({ isModal: false, contents: "" });

  const [crsNameVal, setCrsNameVal] = useState("코스 선택");
  const [holeNameVal, setHoleNameVal] = useState("홀 선택");

  const [addCompModalTitle, setAddCompModalTitle] = useState("추가");
  const [addCompModalItem, setAddCompModalItem] = useState({});
  const [isModalAddComp, setIsModalAddComp] = useState(false);
  const [isModalModComp, setIsModalModComp] = useState(false);
  const [isModalHoleComp, setIsModalHoleComp] = useState(false);
  const [isModalGuideComp, setIsModalGuideComp] = useState(false);
  const [isModalPinComp, setIsModalPinComp] = useState(false);
  const [isModalTeeComp, setIsModalTeeComp] = useState(false);
  const [isModalIpComp, setIsModalIpComp] = useState(false);
  const [isModalBunkComp, setIsModalBunkComp] = useState(false);
  const [isModalDelComp, setIsModalDelComp] = useState(false);
  const [isModalAreaComp, setIsModalAreaComp] = useState(false);

  const crsNameFunc = (value: string) => {
    setCrsNameVal(value);
  };
  const holeNameFunc = (value: string) => {
    setHoleNameVal(value);
  };

  let randMath = 0;
  randMath = Math.floor(Math.random() * 10);

  const dispatch = useDispatch();

  useEffect(() => {
    if (mdCommon.isModalCommon) {
      // setModalCommon(mdCommon);
    }
    if (mdAlert.isModal) {
      setModalArelt(mdAlert);
    }

    if (mdSearch && mdSearch.newWorkSpace && mdSearch.newWorkSpace.isModal) {
      setModalSearch(mdSearch.newWorkSpace);
    }
  }, [setModalCommon, mdCommon, mdAlert, mdSearch, setModalSearch]);
  const compInfoReducer = useSelector((state: any) => state.compInfoReducer.compInfoReducer);

  const [coData, setCoData] = useState(compInfoReducer.wmgCompInfoData);

  const reloadData = (data: string | number) => void setCoData(data);

  useEffect(() => {
    setCoData(compInfoReducer.wmgCompInfoData);
  }, [compInfoReducer]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_WMP_API_URL}gi/req_comp_info`)
      .then((response) => response.json())
      .then((result) => dispatch(compInfoRedux(result)))
      .catch((error) => console.log("error", error));
  }, [dispatch]);

  return (
    <>
      <div style={{ width: `${process.env.MAP_WIDTH}px`, height: `${process.env.MAP_HEIGHT}px`, position: "relative" }}>
        <GnbLeft
          key="GnbLeft"
          crsNameFunc={crsNameFunc}
          holeNameFunc={holeNameFunc}
          crsNameVal={crsNameVal}
          holeNameVal={holeNameVal}
          setAddCompModalTitle={setAddCompModalTitle}
          setAddCompModalItem={setAddCompModalItem}
          setIsModalAddComp={setIsModalAddComp}
          setIsModalModComp={setIsModalModComp}
          setIsModalHoleComp={setIsModalHoleComp}
          setIsModalGuideComp={setIsModalGuideComp}
          setIsModalPinComp={setIsModalPinComp}
          setIsModalTeeComp={setIsModalTeeComp}
          setIsModalIpComp={setIsModalIpComp}
          setIsModalBunkComp={setIsModalBunkComp}
          setIsModalDelComp={setIsModalDelComp}
          setIsModalAreaComp={setIsModalAreaComp}
          coData={coData}
        />
        <MapChangeBtn key="mapChange" />
        <div ref={ref} style={{ width: "100%", height: "100%", top: "10px" }}></div>
        <div
          style={{
            width: `${process.env.MAP_WIDTH}px`,
            height: "100px",
            margin: "0 auto",
            position: "relative",
          }}
        ></div>
        <SearchModal key="searchModal" isModal={modalSearch.isModal} />
        <AddCompModal
          key="addcomp"
          modalOpen={isModalAddComp}
          handleClose={() => {
            setIsModalAddComp(false);
          }}
          valueIntoModal="123456"
          reloadData={reloadData}
          title={addCompModalTitle}
          item={addCompModalItem}
          setIsModalAddComp={setIsModalAddComp}
        />
        <ModCompModal
          key="modcomp"
          modalOpen={isModalModComp}
          handleClose={() => {
            setIsModalModComp(false);
          }}
          valueIntoModal="1234567"
        />
        <HoleModal
          key="holeModalBtn"
          isModalHoleComp={isModalHoleComp}
          isModalGuideComp={isModalGuideComp}
          crsNameVal={crsNameVal}
          holeNameVal={holeNameVal}
        />
        <CaSaModal
          key="CaSaModal"
          isModalHoleComp={isModalHoleComp}
          isModalPinComp={isModalPinComp}
          isModalTeeComp={isModalTeeComp}
          isModalIpComp={isModalIpComp}
          isModalBunkComp={isModalBunkComp}
          isModalAreaComp={isModalAreaComp}
        />
        <TeeModal key="teeModalBtn" isModalTeeComp={isModalTeeComp} crsNameVal={crsNameVal} holeNameVal={holeNameVal} />
        <BunkerModal
          key="bunkerModalBtn"
          isModalBunkComp={isModalBunkComp}
          crsNameVal={crsNameVal}
          holeNameVal={holeNameVal}
        />
        <AreaModal
          key="areaModal"
          isModalAreaComp={isModalAreaComp}
          crsNameVal={crsNameVal}
          holeNameVal={holeNameVal}
        />
        <DeleteModal
          key="delcomp"
          modalOpen={isModalDelComp}
          handleClose={() => {
            setIsModalDelComp(false);
          }}
          crsNameVal={crsNameVal}
          holeNameVal={holeNameVal}
        />
      </div>
      <CommonModal
        key="common"
        modalOpen={modalCommon.isModalCommon}
        handleClose={() => {
          setModalCommon(() => ({
            ...modalCommon,
            isModalCommon: false,
          }));
        }}
        contents={modalCommon.contents}
      />
      <AlertModal
        key="alert"
        modalOpen={modalArelt.isModal}
        handleClose={() => {
          setModalArelt(() => ({
            ...modalArelt,
            isModal: false,
            contents: "",
          }));
          dispatch(areltRedux({ isModal: false, contents: "" }));
        }}
        contents={modalArelt.contents}
      />
      <InputAlert />
    </>
  );
});

KakaomapComponent.displayName = "KaKaoComponent";

export default KakaomapComponent;
