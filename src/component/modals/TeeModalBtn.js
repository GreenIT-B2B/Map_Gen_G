import { Button } from "semantic-ui-react";
import React, { useEffect } from "react";
import TeeModal from "./TeeModal";

import { useSelector, useDispatch } from "react-redux";
import { teeIsMoRedux } from "store/reducers/teeIsMoReducer";

export default function TeeModalBtn(props) {
  const teeIsMoReducer = useSelector((state) => state.teeIsMoReducer.teeIsMoReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!props.isModalTeeComp) {
      dispatch(teeIsMoRedux(false));
    }
  }, [props.isModalTeeComp, dispatch]);
  return (
    <>
      {props.isModalTeeComp ? (
        <>
          {/* <Button
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
            className="teemodalBtn yellow"
            onClick={(e) => {
              dispatch(teeIsMoRedux(!teeIsMoReducer));
            }}
          >
            티 정보 변경
          </Button> */}
        </>
      ) : (
        ""
      )}
      <TeeModal
        key="teecomp"
        isModalTeeComp={teeIsMoReducer}
        modalOpen={teeIsMoReducer}
        handleClose={() => {
          dispatch(teeIsMoRedux(false));
        }}
        crsNameVal={props.crsNameVal}
        holeNameVal={props.holeNameVal}
      />
    </>
  );
}
