import { Button } from "semantic-ui-react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { mapChangeRedux } from "store/reducers/mapChangeReducer";

export default function BunkerModalBtn() {
  const mapChangeReducer = useSelector((state) => state.mapChangeReducer.mapChangeReducer);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(mapChangeReducer);
    switch (mapChangeReducer) {
      case "L":
        document.querySelector(".lineBtn").classList.add("yellow");
        document.querySelector(".satelliteBtn").classList.remove("yellow");
        break;
      case "S":
        document.querySelector(".lineBtn").classList.remove("yellow");
        document.querySelector(".satelliteBtn").classList.add("yellow");
        break;

      default:
        break;
    }
  }, [mapChangeReducer]);
  return (
    <>
      <Button
        className="lineBtn"
        style={{
          position: "absolute",
          top: "2%",
          right: "7.8%",
          margin: "0",
          width: "70px",
          height: "30px",
          padding: "0",
          pointerEvents: "auto",
          zIndex: "100",
          color: "rgba(3,3,3,0.5)",
        }}
        color="yellow"
        onClick={(e) => {
          dispatch(mapChangeRedux("R"));
        }}
      >
        라인
      </Button>
      <Button
        className="satelliteBtn"
        style={{
          position: "absolute",
          top: "2%",
          right: ".3%",
          margin: "0",
          width: "70px",
          height: "30px",
          padding: "0",
          pointerEvents: "auto",
          zIndex: "100",
          color: "rgba(3,3,3,0.5)",
        }}
        onClick={(e) => {
          dispatch(mapChangeRedux("H"));
        }}
      >
        위성
      </Button>
    </>
  );
}
