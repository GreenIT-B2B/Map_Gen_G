import { Button } from "semantic-ui-react";
import React, { useEffect, useState } from "react";
import HoleModal from "./HoleModal";
import GuideModal from "./GuideModal";

export default function HoleModalBtn(props) {
  const [isHoleModal, setIsHoleModal] = useState(false);
  const [isGuideModal, setIsGuideModal] = useState(false);

  useEffect(() => {}, []);
  return (
    <>
      {props.isModalHoleComp ? (
        <>
          <Button
            style={{
              position: "absolute",
              bottom: "11.3%",
              right: ".3%",
              margin: "0",
              width: "120px",
              color: "rgba(3,3,3,0.5)",
              pointerEvents: "auto",
              zIndex: "1",
            }}
            className="guidemodalBtn olive"
            onClick={(e) => {
              setIsGuideModal(true);
            }}
          >
            화면 가이드
          </Button>
          <Button
            style={{
              position: "absolute",
              bottom: "5%",
              right: ".3%",
              margin: "0",
              width: "120px",
              color: "rgba(3,3,3,0.5)",
              pointerEvents: "auto",
              zIndex: "1",
            }}
            className="holemodalBtn yellow"
            onClick={(e) => {
              setIsHoleModal(true);
            }}
          >
            홀 정보 변경
          </Button>
        </>
      ) : (
        ""
      )}
      <HoleModal
        key="holecomp"
        modalOpen={isHoleModal}
        handleClose={() => {
          setIsHoleModal(false);
        }}
        crsNameVal={props.crsNameVal}
        holeNameVal={props.holeNameVal}
      />
      <GuideModal
        key="guidecomp"
        modalOpen={isGuideModal}
        handleClose={() => {
          setIsGuideModal(false);
        }}
        crsNameVal={props.crsNameVal}
        holeNameVal={props.holeNameVal}
      />
    </>
  );
}
