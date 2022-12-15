import { Button } from "semantic-ui-react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import BunkerModal from "./BunkerModal";

import { bunkIsMoRedux } from "store/reducers/bunkIsMoReducer";

export default function BunkerModalBtn(props) {
  const bunkIsMoReducer = useSelector((state) => state.bunkIsMoReducer.bunkIsMoReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!props.isModalBunkComp) {
      dispatch(bunkIsMoRedux(false));
    }
  }, [props.isModalBunkComp, dispatch]);
  return (
    <>
      {props.isModalBunkComp ? (
        <>
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
            className="holemodalBtn"
            color="yellow"
            onClick={(e) => {
              dispatch(bunkIsMoRedux(!bunkIsMoReducer));
            }}
          >
            닷 정보 변경
          </Button>
        </>
      ) : (
        ""
      )}
      <BunkerModal
        key="bunkercomp"
        modalOpen={bunkIsMoReducer}
        handleClose={() => {
          dispatch(bunkIsMoRedux(false));
        }}
        crsNameVal={props.crsNameVal}
        holeNameVal={props.holeNameVal}
        isModalBunkComp={props.isModalBunkComp}
      />
    </>
  );
}
