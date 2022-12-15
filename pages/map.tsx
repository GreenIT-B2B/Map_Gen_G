// import * as axios from "axios";
import axios, { AxiosResponse } from "axios";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  centLine,
  pointInPolygon,
  rectPos,
  rectRot,
  rectScale,
  rectDegToRot,
  calcGeoPosOnImage,
  calcGeoPosOnTouch,
  calDist,
  calcInclin,
  makeLineToRect,
  newGeoOnLine,
} from "../src/component/map/GeoMath";
import { KeybCtrlParam, UiCtrlParam, MapInfo, CrsDrawInfo, HoleDrawInfo, HoleData, PinData, IpData } from "./types";
import {
  convGeos2LatLngs,
  convLatLngs2Geos,
  convLatLng2Geo,
  convCoords2LatLngs,
  convBounds2Mbr,
} from "../src/component/map/GeoData";

import { IRootState } from "../store/store";
import {
  // getActChooseComp,
  // getActChooseCrs,
  // getActChooseHole,
  getActSendCompInfo,
  getActSendCrsInfo,
  getActSendHoleInfo,
  getActSendLastAct,
  // getActCmMsg,
  getActSaveGeoData,
  getActCancelGeoData,
  getActResetGeoDataState,
} from "../store/actions/action";

import { areltRedux } from "../store/reducers/areltReducer";
import { searchRedux } from "../store/reducers/searchReducer";
import { btnModalRedux } from "store/reducers/btnModalReducer";
import { crsSelectRedux } from "store/reducers/crsSelectReducer";
import { holeSelectRedux } from "store/reducers/holeSelectReducer";
import { teeRedux } from "../store/reducers/teeReducer";
import { teeIsMoRedux } from "../store/reducers/teeIsMoReducer";
import { bunkRedux } from "../store/reducers/bunkReducer";
import { bunkIsMoRedux } from "../store/reducers/bunkIsMoReducer";
import { areaRedux } from "../store/reducers/areaReducer";

import KakaomapComponent from "../src/component/KaKaomapComponent";
import styles from "./map.module.css";

const SCALE_IDX_LT = 0;
const SCALE_IDX_MT = 1;
const SCALE_IDX_RT = 2;
const SCALE_IDX_LM = 3;
const SCALE_IDX_RM = 4;
const SCALE_IDX_LB = 5;
const SCALE_IDX_MB = 6;
const SCALE_IDX_RB = 7;
const MOVE_BOX = 8;
const ROTATE_BOX = 9;

const GB_SCALE_POINT_SIZE = 0.00005;
const GB_MOUSE_POINT_SIZE = 0.00005;
const GB_COLLIS_LINE_WIDTH = 0.00002;

const LT = 0;
const RT = 1;
const RB = 2;
const LB = 3;

const CTRL_LT = 0;
const CTRL_RT = 1;
const CTRL_LB = 2;
const CTRL_RB = 3;
const CTRL_ROTATE = 4;
const CTRL_CENTER = 5;

const CD_COMP = "CP";
const CD_COURSE = "C";
const CD_HOLE_ALL = "HA";
const CD_HOLE = "H";
const CD_PIN = "P";
const CD_TEE = "T";
const CD_IP = "I";
const CD_DOT = "D";
const CD_AREA = "A";
const CD_SAVE = "S";
const CD_CANCLE = "X";
const CD_DELETE = "D";

const DRAW_AREA_TYPE_ALL = 0;
const DRAW_AREA_TYPE_CLOSE = 1;
const DRAW_AREA_TYPE_ADD = 2;
const DRAW_AREA_TYPE_DEL = 3;
const DRAW_AREA_TYPE_NONE = 99;

const HOLE_SECT_TEE = "T";
const HOLE_SECT_SEC1 = "S1";
const HOLE_SECT_SEC2 = "S2";
const HOLE_SECT_GREEN = "G";

const keybCtrl: KeybCtrlParam = {
  isAlt: false,
};

declare global {
  interface Window {
    kakao: any;
  }
}

declare var kakao: any;

var map;

// 화면에 보는 맵 영역 좌표
var mapMbr = [];

// 화면 크기
var mapViewSize = {
  width: process.env.MAP_WIDTH,
  height: process.env.MAP_HEIGHT,
};

// 화면에 보이는 맵에 거라
var mapGeoSize = {
  width: 0,
  height: 0,
};

// 화면 가이드 영역에 대한 정보
var baseMapSetInfo = {
  idxBaseMap: 0,
  baseMapInfos: [],
};

// 사용자 컨트롤 정보
const uiCtrl: UiCtrlParam = {
  cgDiv: "",
  coDiv: "",
  crsCd: "N",
  crsSeq: 0,
  crsName: "",
  holeNo: 0,
  holeNoNm: "",
  par: 0,
  handi: 0,
  holeExpl: "",
  teeSeq: 999,
  dotGp: 0,
  dotSeq: 999,
  areaSectCd: "N",
  areaSeq: 999,
  areaPtType: 99,
  lastSeq: [],
  pointType: "N",
  action: "",
};

// 골프장 정보(업장 영역 등에 정보)
const mapInfo: MapInfo = {
  lat: 37.572,
  lng: 126.9848,
  zoomW: 3,
  zoomBuf: 3,

  crs: {
    geos: [],
    centGeo: {
      lat: 0.0,
      lng: 0.0,
    },
  },

  hole: {
    geos: [],
    rot: 0.0,
    zoomN: 0.0,
    centGeo: {
      lat: 0.0,
      lng: 0.0,
    },
  },
};

// 코스 정보(영역 등에 정보)
var crsDrawInfo: CrsDrawInfo = {
  idxDragBox: 99,
  isModBox: false,

  gbRect: null,
  gbScRectPts: [],
  gbCentCirPt: null,
  gbDirTexts: [],

  gbGeos: [],
  gbCoords: [],
  gbScRectGeos: [],
  gbCentGeo: {},
  gbCentCoord: {},
  gbZoomW: 3.0,
  gbInclin: {
    a: 0.0,
    b: 0.0,
  },

  initMbDegree: 0.0,
  gbBuf: {
    coords: [],
  },

  drawingFlagC: false,
  modBoxInitCoord: {
    x: 0,
    y: 0,
  },
  modBoxDelta: {
    x: 0.0,
    y: 0.0,
  },
};

// 홀 정보(영역, 티, 핀, 아이피, 홀 인식 영역 등에 정보)
var holeDrawInfo: HoleDrawInfo = {
  idxDragBox: 99,
  isModBox: false,

  gbRect: null,
  gbScRectPts: [],
  gbCentCirPt: null,
  gbDirTexts: [],

  gbGeos: [],
  gbCoords: [],
  gbScRectGeos: [],
  gbCentGeo: null,
  gbCentCoord: {},
  gbZoomW: 3.0,
  gbZoomN: 16.0,
  gbRot: 0.0,
  gbInclin: {
    a: 0.0,
    b: 0.0,
  },

  gbBuf: {
    rot: 0.0,
    coords: [],
  },

  drawingFlagH: false,
  initMbDegree: 0.0,
  modBoxInitCoord: {
    x: 0,
    y: 0,
  },
  modBoxDelta: {
    x: 0.0,
    y: 0.0,
  },

  pinGeo: null,
  pinCirPt: null,

  drawingFlagT: false,
  teeInfos: [],
  teeCirPts: [],
  removTeeInfo: { seq: 0 },

  drawingFlagI: false,
  idxDragIp: 99,
  isModifyIp: false,
  ipGeos: [],
  ipRectGeos: [],

  ipCirPts: [],
  ipPls: null,
  ipDistTexts: [],

  dotInfos: [],
  dotCirPts: [],
  removDotInfo: { gp: 0, seq: 0 },
  action: "",

  drawingFlagA: false,
  idxDragArea: 99,
  isModifyArea: false,
  isCloseArea: false,
  areaGeos: [],
  areaRectGeos: [],
  areaLineRectGeos: [],

  areaCirPts: [],
  areaPolys: null,
  areaPls: null,

  areaGuidePolys: [],
};

const Map: React.FC = () => {
  const dispatch = useDispatch();

  const mdCommonParam = {
    isModalCommon: false,
    contents: "",
  };

  // 리덕스 정보
  const keyword = useSelector((state: any) => state.searchReducer.searchReducer);
  const coInfo = useSelector((state: any) => state.codivSelectReducer.codivSelectReducer);
  const crsInfo = useSelector((state: any) => state.crsSelectReducer.crsSelectReducer);
  const holeInfo = useSelector((state: any) => state.holeSelectReducer.holeSelectReducer);
  const saveActInfo = useSelector((state: any) => state.btnModalReducer.btnModalReducer);
  const menuSelect = useSelector((state: any) => state.menuSelectReducer.menuSelectReducer);
  const holeReducer = useSelector((state: any) => state.holeReducer.holeReducer);
  const teeReducer = useSelector((state: any) => state.teeReducer.teeReducer);
  const dotReducer = useSelector((state: any) => state.bunkReducer.bunkReducer);
  const guideReducer = useSelector((state: any) => state.guideReducer.guideReducer);
  const compInfoReducer = useSelector((state: any) => state.compInfoReducer.compInfoReducer);
  const mapSetValue = useSelector((state: any) => state.mapChangeReducer.mapChangeReducer);
  const areaReducer = useSelector((state: any) => state.areaReducer.areaReducer);

  // console.log(">>> useSelector >>> keyword : " + JSON.stringify(keyword));
  // console.log(">>> useSelector >>> coInfo : " + JSON.stringify(coInfo));
  // console.log(">>> useSelector >>> crsInfo : " + JSON.stringify(crsInfo));
  // console.log(">>> useSelector >>> holeInfo : " + JSON.stringify(holeInfo));
  // console.log(">>> useSelector >>> saveActInfo : " + JSON.stringify(saveActInfo));
  // console.log(">>> useSelector >>> holeReducer : " + JSON.stringify(holeReducer));
  // console.log(">>> useSelector >>> teeReducer : " + JSON.stringify(teeReducer));
  // console.log(">>> useSelector >>> dotReducer : " + JSON.stringify(dotReducer));
  // console.log(">>> useSelector >>> guideReducer : " + JSON.stringify(guideReducer));
  // console.log(">>> useSelector >>> compInfoReducer : " + JSON.stringify(compInfoReducer));
  // console.log(">>> useSelector >>> areaReducer : " + JSON.stringify(areaReducer));

  const kakaoMap = React.useRef<HTMLDivElement>(null);

  // 업장 정보 처리
  useEffect(() => {
    if (coInfo != undefined && !isEmpty(coInfo)) {
      uiCtrl.cgDiv = coInfo.cgDiv;
      uiCtrl.coDiv = coInfo.coDiv;
      uiCtrl.pointType = CD_COMP;
    } else {
      uiCtrl.cgDiv = "";
      uiCtrl.coDiv = "";
      uiCtrl.pointType = undefined;
    }
  }, [coInfo]);

  // 코스 및 홀 정보 처리(실제 홀에 대한 맵에디터 영역으로 홀 영역, 티, 핀, 아이피, 닷지, 홀 인식 영역등을 생성, 편집하는 부분)
  useEffect(() => {
    const $script = document.createElement("script");
    $script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.KAKAOMAP_KEY}&libraries=services,clusterer&autoload=false`;
    document.head.appendChild($script);
    const onLoadKakaoMap = () => {
      window.kakao.maps.load(() => {
        // 코스관련 정보 초기화
        function initCrsMapInfo() {
          if (uiCtrl.coDiv !== "") {
            if (uiCtrl.crsCd !== "N") {
              uiCtrl.crsCd = crsInfo.crsCd;
              uiCtrl.crsSeq = crsInfo.crsSeq;
              uiCtrl.crsName = crsInfo.crsName;

              crsDrawInfo.gbCentGeo = {};
              crsDrawInfo.gbZoomW = 3;
              crsDrawInfo.gbGeos = [];
              crsDrawInfo.gbCoords = [];

              crsDrawInfo.drawingFlagC = false;
              crsDrawInfo.isModBox = false;

              if (
                crsInfo.tlLaY !== 0 &&
                crsInfo.tlLoX !== 0 &&
                crsInfo.trLaY !== 0 &&
                crsInfo.trLoX !== 0 &&
                crsInfo.brLaY !== 0 &&
                crsInfo.brLoX !== 0 &&
                crsInfo.blLaY !== 0 &&
                crsInfo.blLoX !== 0
              ) {
                crsDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(crsInfo.centerGeoY, crsInfo.centerGeoX);
                crsDrawInfo.gbCentCoord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbCentGeo, mapGeoSize, mapViewSize);

                crsDrawInfo.gbZoomW = crsInfo.zoomW;

                crsDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(crsInfo.tlLaY, crsInfo.tlLoX));
                crsDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(crsInfo.trLaY, crsInfo.trLoX));
                crsDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(crsInfo.brLaY, crsInfo.brLoX));
                crsDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(crsInfo.blLaY, crsInfo.blLoX));

                for (let i = 0; i < crsDrawInfo.gbGeos.length; i++) {
                  var coord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);

                  crsDrawInfo.gbCoords.push(coord);
                }

                if (crsDrawInfo.gbGeos.length === 4 && crsInfo.centerGeoY !== 0 && crsInfo.centerGeoX !== 0) {
                  mapInfo.crs.geos = convLatLngs2Geos(crsDrawInfo.gbGeos);
                  mapInfo.crs.centGeo.lat = crsInfo.centerGeoY;
                  mapInfo.crs.centGeo.lng = crsInfo.centerGeoX;

                  mapInfo.lat = crsInfo.centerGeoY;
                  mapInfo.lng = crsInfo.centerGeoX;
                  mapInfo.zoomW = crsInfo.zoomW;
                }

                crsDrawInfo.drawingFlagC = true;
              }

              uiCtrl.pointType = CD_COURSE;
            } else {
              uiCtrl.crsCd = "";
              uiCtrl.pointType = CD_COMP;
            }
          } else {
            uiCtrl.pointType = undefined;
          }
        }

        // 코스관련 정보 화면 그리기
        function setCrsDrawData() {
          initDrawAll();

          if (uiCtrl.coDiv !== "") {
            if (uiCtrl.crsCd !== "" && uiCtrl.crsCd !== "N") {
              if (!isEmpty(crsDrawInfo.gbGeos) && crsDrawInfo.gbGeos.length > 0) {
                crsDrawInfo.drawingFlagC = true;
                setDrawRect(CD_COURSE);
              }
            }
          }
        }

        if (crsInfo != undefined && !isEmpty(crsInfo)) {
          initCrsMapInfo();
        } else {
          uiCtrl.crsCd = "";
          if (uiCtrl.coDiv !== "") {
            uiCtrl.pointType = CD_COMP;
          } else {
            uiCtrl.pointType = undefined;
          }
        }

        if (kakaoMap && kakaoMap.current) {
          const coords = new (window as any).daum.maps.LatLng(mapInfo.lat, mapInfo.lng); // 지도의 중심좌표
          const options = {
            center: coords,
            level: mapInfo.zoomW,
          };

          if (map) {
            map.setCenter(new kakao.maps.LatLng(mapInfo.lat, mapInfo.lng));
            map.setLevel(mapInfo.zoomW, { animate: false });
          } else {
            map = new (window as any).daum.maps.Map(kakaoMap.current, options);

            var curPos = null;
            var scalePtSize = 0.00005;
            if (
              uiCtrl.pointType === CD_TEE ||
              uiCtrl.pointType === CD_IP ||
              uiCtrl.pointType === CD_DOT ||
              uiCtrl.pointType === CD_AREA
            ) {
              const zoom = map.getLevel();
              if (zoom != 2) {
                scalePtSize = GB_MOUSE_POINT_SIZE * (zoom - 2);
              }
            }

            // 마우스 클릭 리스너
            window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
              console.log(">>> crs >>> addListener >>> click!!!");
              console.log(">>> crs >>> addListener >>> click >>> pointType : " + uiCtrl.pointType);

              curPos = mouseEvent.latLng;
              if (uiCtrl.pointType === CD_COURSE) {
                if (uiCtrl.coDiv !== "" && uiCtrl.crsCd != "" && uiCtrl.crsCd != "N") {
                  if (!crsDrawInfo.drawingFlagC) {
                    crsDrawInfo.drawingFlagC = true;

                    crsDrawInfo.gbGeos = [];
                    crsDrawInfo.gbCoords = [];

                    const idxBm = baseMapSetInfo.idxBaseMap;
                    crsDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() + baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() - baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    crsDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() + baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() + baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    crsDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() - baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() + baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    crsDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() - baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() - baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );

                    for (let i = 0; i < crsDrawInfo.gbGeos.length; i++) {
                      var coord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);
                      crsDrawInfo.gbCoords.push(coord);
                    }

                    const centGeo = centLine(crsDrawInfo.gbGeos[0], crsDrawInfo.gbGeos[2]);
                    crsDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
                    crsDrawInfo.gbCentCoord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbCentGeo, mapGeoSize, mapViewSize);

                    initDrawCrs();
                    setDrawRect(CD_COURSE);

                    mapInfo.crs.geos = convLatLngs2Geos(crsDrawInfo.gbGeos);
                    mapInfo.crs.centGeo = centGeo;
                    mapInfo.zoomW = map.getLevel();
                  } else {
                    if (!crsDrawInfo.isModBox) {
                      setNotDrag(CD_COURSE, curPos);

                      if (crsDrawInfo.idxDragBox !== 99) {
                        crsDrawInfo.modBoxInitCoord = calcGeoPosOnImage(mapMbr, curPos, mapGeoSize, mapViewSize);

                        const centRectGeo = centLine(crsDrawInfo.gbGeos[0], crsDrawInfo.gbGeos[2]);
                        const centRectCoord = calcGeoPosOnImage(
                          mapMbr,
                          new window.kakao.maps.LatLng(centRectGeo.lat, centRectGeo.lng),
                          mapGeoSize,
                          mapViewSize
                        );
                        crsDrawInfo.initMbDegree = Math.atan2(
                          crsDrawInfo.modBoxInitCoord.y - centRectCoord.y,
                          crsDrawInfo.modBoxInitCoord.x - centRectCoord.x
                        );

                        if (crsDrawInfo.idxDragBox == SCALE_IDX_LT) {
                          crsDrawInfo.gbInclin = calcInclin(crsDrawInfo.gbCoords[0], crsDrawInfo.gbCentCoord);
                        } else if (crsDrawInfo.idxDragBox == SCALE_IDX_RT) {
                          crsDrawInfo.gbInclin = calcInclin(crsDrawInfo.gbCoords[1], crsDrawInfo.gbCentCoord);
                        } else if (crsDrawInfo.idxDragBox == SCALE_IDX_LB) {
                          crsDrawInfo.gbInclin = calcInclin(crsDrawInfo.gbCoords[3], crsDrawInfo.gbCentCoord);
                        } else if (crsDrawInfo.idxDragBox == SCALE_IDX_RB) {
                          crsDrawInfo.gbInclin = calcInclin(crsDrawInfo.gbCoords[2], crsDrawInfo.gbCentCoord);
                        }

                        setIsDrag(CD_COURSE);
                        crsDrawInfo.isModBox = true;
                      }
                    } else {
                      if (!isEmpty(crsDrawInfo.gbBuf.coords) && crsDrawInfo.gbBuf.coords.length > 0) {
                        crsDrawInfo.gbCoords = crsDrawInfo.gbBuf.coords;
                        crsDrawInfo.gbGeos = convCoords2LatLngs(
                          mapMbr,
                          crsDrawInfo.gbBuf.coords,
                          mapGeoSize,
                          mapViewSize
                        );

                        const centGeo = centLine(crsDrawInfo.gbGeos[0], crsDrawInfo.gbGeos[2]);

                        crsDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
                        crsDrawInfo.gbCentCoord = calcGeoPosOnImage(
                          mapMbr,
                          crsDrawInfo.gbCentGeo,
                          mapGeoSize,
                          mapViewSize
                        );

                        mapInfo.crs.geos = convLatLngs2Geos(crsDrawInfo.gbGeos);
                        mapInfo.crs.centGeo = centGeo;
                        mapInfo.zoomW = map.getLevel();
                      }

                      crsDrawInfo.isModBox = false;
                    }
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 코스를 설정하셔야 맵 편집을 할 수 있습니다. ",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_HOLE) {
                if (uiCtrl.holeNo > 0) {
                  if (!holeDrawInfo.drawingFlagH) {
                    holeDrawInfo.drawingFlagH = true;

                    holeDrawInfo.gbGeos = [];
                    holeDrawInfo.gbCoords = [];

                    const idxBm = baseMapSetInfo.idxBaseMap;
                    holeDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() + baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() - baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    holeDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() + baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() + baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    holeDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() - baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() + baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );
                    holeDrawInfo.gbGeos.push(
                      new window.kakao.maps.LatLng(
                        curPos.getLat() - baseMapSetInfo.baseMapInfos[idxBm].halfHeights[1],
                        curPos.getLng() - baseMapSetInfo.baseMapInfos[idxBm].halfWidths[1]
                      )
                    );

                    for (let i = 0; i < holeDrawInfo.gbGeos.length; i++) {
                      var coord = calcGeoPosOnImage(mapMbr, holeDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);
                      holeDrawInfo.gbCoords.push(coord);
                    }

                    const centGeo = centLine(holeDrawInfo.gbGeos[0], holeDrawInfo.gbGeos[2]);
                    holeDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
                    holeDrawInfo.gbCentCoord = calcGeoPosOnImage(
                      mapMbr,
                      holeDrawInfo.gbCentGeo,
                      mapGeoSize,
                      mapViewSize
                    );

                    holeDrawInfo.gbRot = 0.0;

                    initDrawHole();
                    setDrawRect(CD_HOLE);

                    mapInfo.hole.geos = convLatLngs2Geos(holeDrawInfo.gbGeos);
                    mapInfo.hole.centGeo = centGeo;
                    mapInfo.zoomW = map.getLevel();
                  } else {
                    if (!holeDrawInfo.isModBox) {
                      setNotDrag(CD_HOLE, curPos);

                      if (holeDrawInfo.idxDragBox !== 99) {
                        console.log(">>>>>>>>> mapMbr : " + mapMbr);
                        console.log(">>>>>>>>> mapMbr.length : " + mapMbr.length);
                        console.log(">>>>>>>>> curPos : " + curPos);
                        console.log(">>>>>>>>> mapGeoSize : " + mapGeoSize);
                        console.log(">>>>>>>>> mapViewSize : " + mapViewSize);

                        holeDrawInfo.modBoxInitCoord = calcGeoPosOnImage(mapMbr, curPos, mapGeoSize, mapViewSize);

                        console.log(">>>>>>>>> holeDrawInfo.modBoxInitCoord : " + holeDrawInfo.modBoxInitCoord);

                        const centRectGeo = centLine(holeDrawInfo.gbGeos[0], holeDrawInfo.gbGeos[2]);
                        const centRectCoord = calcGeoPosOnImage(
                          mapMbr,
                          new window.kakao.maps.LatLng(centRectGeo.lat, centRectGeo.lng),
                          mapGeoSize,
                          mapViewSize
                        );
                        holeDrawInfo.initMbDegree = Math.atan2(
                          holeDrawInfo.modBoxInitCoord.y - centRectCoord.y,
                          holeDrawInfo.modBoxInitCoord.x - centRectCoord.x
                        );

                        if (holeDrawInfo.idxDragBox == SCALE_IDX_LT) {
                          holeDrawInfo.gbInclin = calcInclin(holeDrawInfo.gbCoords[0], holeDrawInfo.gbCentCoord);
                        } else if (holeDrawInfo.idxDragBox == SCALE_IDX_RT) {
                          holeDrawInfo.gbInclin = calcInclin(holeDrawInfo.gbCoords[1], holeDrawInfo.gbCentCoord);
                        } else if (holeDrawInfo.idxDragBox == SCALE_IDX_LB) {
                          holeDrawInfo.gbInclin = calcInclin(holeDrawInfo.gbCoords[3], holeDrawInfo.gbCentCoord);
                        } else if (holeDrawInfo.idxDragBox == SCALE_IDX_RB) {
                          holeDrawInfo.gbInclin = calcInclin(holeDrawInfo.gbCoords[2], holeDrawInfo.gbCentCoord);
                        }

                        setIsDrag(CD_HOLE);
                        holeDrawInfo.isModBox = true;
                      }
                    } else {
                      if (!isEmpty(holeDrawInfo.gbBuf.coords) && holeDrawInfo.gbBuf.coords.length > 0) {
                        if (holeDrawInfo.idxDragBox == ROTATE_BOX) {
                          holeDrawInfo.gbRot = holeDrawInfo.gbBuf.rot;
                        }
                        holeDrawInfo.gbCoords = holeDrawInfo.gbBuf.coords;
                        holeDrawInfo.gbGeos = convCoords2LatLngs(
                          mapMbr,
                          holeDrawInfo.gbCoords,
                          mapGeoSize,
                          mapViewSize
                        );

                        const centGeo = centLine(holeDrawInfo.gbGeos[0], holeDrawInfo.gbGeos[2]);
                        holeDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
                        holeDrawInfo.gbCentCoord = calcGeoPosOnImage(
                          mapMbr,
                          holeDrawInfo.gbCentGeo,
                          mapGeoSize,
                          mapViewSize
                        );

                        mapInfo.hole.geos = convLatLngs2Geos(holeDrawInfo.gbGeos);
                        mapInfo.hole.centGeo = centGeo;
                        mapInfo.hole.rot = holeDrawInfo.gbRot;
                        mapInfo.hole.zoomN = holeDrawInfo.gbZoomN;
                        mapInfo.zoomW = map.getLevel();
                      }

                      holeDrawInfo.isModBox = false;
                    }
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "홀 정보 변경에서 해당 홀에 대한 정보를 저장하세요.",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_PIN) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  initDrawPin();

                  holeDrawInfo.pinGeo = curPos;
                  setDrawPin();
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 홀을 설정하셔야 맵 편집을 할 수 있습니다.",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_TEE) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  if (!holeDrawInfo.drawingFlagT) {
                    var teeInfo = null;

                    for (let i = 0; i < holeDrawInfo.teeInfos.length; i++) {
                      var mbr = [];
                      mbr.push(
                        new window.kakao.maps.LatLng(
                          holeDrawInfo.teeInfos[i].geo.lat + scalePtSize,
                          holeDrawInfo.teeInfos[i].geo.lng - scalePtSize
                        )
                      );
                      mbr.push(
                        new window.kakao.maps.LatLng(
                          holeDrawInfo.teeInfos[i].geo.lat + scalePtSize,
                          holeDrawInfo.teeInfos[i].geo.lng + scalePtSize
                        )
                      );
                      mbr.push(
                        new window.kakao.maps.LatLng(
                          holeDrawInfo.teeInfos[i].geo.lat - scalePtSize,
                          holeDrawInfo.teeInfos[i].geo.lng + scalePtSize
                        )
                      );
                      mbr.push(
                        new window.kakao.maps.LatLng(
                          holeDrawInfo.teeInfos[i].geo.lat - scalePtSize,
                          holeDrawInfo.teeInfos[i].geo.lng - scalePtSize
                        )
                      );

                      if (pointInPolygon(mbr, curPos)) {
                        teeInfo = holeDrawInfo.teeInfos[i];
                        break;
                      }
                    }

                    if (teeInfo) {
                      uiCtrl.teeSeq = teeInfo.seq;
                      dispatch(
                        teeRedux({
                          hole: uiCtrl.holeNo,
                          seq: teeInfo.seq,
                          code: teeInfo.code,
                          clr: teeInfo.clr,
                          nm: teeInfo.nm,
                          nmSec: teeInfo.nmSec,
                        })
                      );
                    }

                    dispatch(teeIsMoRedux(true));
                  } else {
                    var fItem = holeDrawInfo.teeInfos.find((it) => it.seq === uiCtrl.teeSeq);
                    if (fItem !== undefined) {
                      initDrawTees();

                      fItem.geo.lat = curPos.getLat();
                      fItem.geo.lng = curPos.getLng();

                      setDrawTee();
                    }

                    holeDrawInfo.drawingFlagT = false;
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 홀을 설정하셔야 맵 편집을 할 수 있습니다.",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_IP) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  if (uiCtrl.par > 3) {
                    if (!holeDrawInfo.drawingFlagI) {
                      holeDrawInfo.drawingFlagI = true;

                      holeDrawInfo.ipGeos = [];
                      holeDrawInfo.ipRectGeos = [];

                      holeDrawInfo.ipGeos.push(curPos);
                      holeDrawInfo.ipGeos.push(curPos);

                      holeDrawInfo.ipRectGeos.push(makeClickArea(curPos, scalePtSize));

                      holeDrawInfo.isModifyIp = true;
                      holeDrawInfo.idxDragIp = 0;

                      initDrawIps();
                      setDrawIp();
                    } else {
                      if (!holeDrawInfo.isModifyIp) {
                        setNotDrag(CD_IP, curPos);

                        if (holeDrawInfo.idxDragIp !== 99) {
                          setIsDrag(CD_IP);
                          holeDrawInfo.isModifyIp = true;
                        }
                      } else {
                        if (uiCtrl.par == 4) {
                          holeDrawInfo.isModifyIp = false;
                        } else if (uiCtrl.par == 5) {
                          if (holeDrawInfo.idxDragIp == 0 && holeDrawInfo.ipGeos.length == 2) {
                            holeDrawInfo.ipGeos.push(curPos);
                            holeDrawInfo.ipRectGeos.push(makeClickArea(curPos, scalePtSize));

                            holeDrawInfo.idxDragIp = 1;

                            initDrawIps();
                            setDrawIp();
                          } else {
                            holeDrawInfo.isModifyIp = false;
                          }
                        }
                      }
                    }
                  } else {
                    dispatch(
                      areltRedux({
                        isModal: true,
                        contents: "아이피 정보는 파4 이상에서 추가 할 수 있습니다.",
                      })
                    );
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 홀을 설정하셔야 맵 편집을 할 수 있습니다.",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_DOT) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  var dotInfo = null;

                  for (let i = 0; i < holeDrawInfo.dotInfos.length; i++) {
                    var mbr = [];
                    mbr.push(
                      new window.kakao.maps.LatLng(
                        holeDrawInfo.dotInfos[i].geo.lat + scalePtSize,
                        holeDrawInfo.dotInfos[i].geo.lng - scalePtSize
                      )
                    );
                    mbr.push(
                      new window.kakao.maps.LatLng(
                        holeDrawInfo.dotInfos[i].geo.lat + scalePtSize,
                        holeDrawInfo.dotInfos[i].geo.lng + scalePtSize
                      )
                    );
                    mbr.push(
                      new window.kakao.maps.LatLng(
                        holeDrawInfo.dotInfos[i].geo.lat - scalePtSize,
                        holeDrawInfo.dotInfos[i].geo.lng + scalePtSize
                      )
                    );
                    mbr.push(
                      new window.kakao.maps.LatLng(
                        holeDrawInfo.dotInfos[i].geo.lat - scalePtSize,
                        holeDrawInfo.dotInfos[i].geo.lng - scalePtSize
                      )
                    );

                    if (pointInPolygon(mbr, curPos)) {
                      dotInfo = holeDrawInfo.dotInfos[i];
                      break;
                    }
                  }

                  if (dotInfo) {
                    uiCtrl.dotGp = dotInfo.gp;
                    uiCtrl.dotSeq = dotInfo.seq;
                    dispatch(
                      bunkRedux({
                        hole: uiCtrl.holeNo,
                        save: "",
                        group: dotInfo.gp,
                      })
                    );

                    dispatch(bunkIsMoRedux(true));
                  } else {
                    var lastDotInfo = uiCtrl.lastSeq.find((it) => it.gp === uiCtrl.dotGp);
                    if (lastDotInfo === undefined) {
                      const last = {
                        gp: uiCtrl.dotGp,
                        seq: 0,
                      };

                      uiCtrl.lastSeq.push(last);

                      uiCtrl.dotSeq = 0;
                    } else {
                      lastDotInfo.seq += 1;
                      uiCtrl.dotSeq = lastDotInfo.seq;
                    }

                    initDrawDots();
                    var fItem: any = holeDrawInfo.dotInfos.find(
                      (it) => it.gp === uiCtrl.dotGp && it.seq === uiCtrl.dotSeq
                    );

                    if (fItem) {
                      fItem.geo.lat = curPos.getLat();
                      fItem.geo.lng = curPos.getLng();
                    } else {
                      const dot = {
                        gp: uiCtrl.dotGp,
                        seq: uiCtrl.dotSeq,
                        geo: {
                          lat: curPos.getLat(),
                          lng: curPos.getLng(),
                        },
                      };

                      holeDrawInfo.dotInfos.push(dot);
                    }
                    setDrawDot();
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 홀을 설정하셔야 맵 편집을 할 수 있습니다.",
                    })
                  );
                }
              } else if (uiCtrl.pointType === CD_AREA) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  if (!holeDrawInfo.drawingFlagA) {
                    if (!keybCtrl.isAlt) {
                      holeDrawInfo.drawingFlagA = true;

                      holeDrawInfo.areaGeos = [];
                      holeDrawInfo.areaRectGeos = [];
                      holeDrawInfo.areaLineRectGeos = [];

                      var curPosIf = {
                        sectCd: HOLE_SECT_TEE,
                        seq: holeDrawInfo.areaGeos.length,
                        pos: curPos,
                      };
                      holeDrawInfo.areaGeos.push(curPosIf);

                      curPosIf = {
                        sectCd: HOLE_SECT_TEE,
                        seq: holeDrawInfo.areaGeos.length,
                        pos: curPos,
                      };
                      holeDrawInfo.areaGeos.push(curPosIf);

                      const areaIf = {
                        idx: holeDrawInfo.areaRectGeos.length,
                        area: makeClickArea(curPos, scalePtSize),
                      };
                      holeDrawInfo.areaRectGeos.push(areaIf);

                      holeDrawInfo.isModifyArea = true;
                      holeDrawInfo.idxDragArea = 0;

                      initDrawAreas();
                      setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
                    } else {
                      dispatch(
                        areltRedux({
                          isModal: true,
                          contents:
                            "컨트롤 키는 영역 편집 시 사용해 주세요. Ctrl은 포인트 추가 및 이동이고 Alt는 포인트 제거입니다.",
                        })
                      );
                    }
                  } else {
                    if (!keybCtrl.isAlt) {
                      if (!holeDrawInfo.isModifyArea) {
                        setNotDrag(CD_AREA, curPos);

                        if (holeDrawInfo.idxDragArea !== 99) {
                          setIsDrag(CD_AREA);
                          holeDrawInfo.isModifyArea = true;
                        }
                      } else {
                        if (holeDrawInfo.areaPolys != null) {
                          holeDrawInfo.isModifyArea = false;
                        } else {
                          const len = holeDrawInfo.areaGeos.length;
                          if (len >= 2) {
                            const areaSqIf = {
                              idx: len,
                              area: makeLineToRect(
                                GB_COLLIS_LINE_WIDTH,
                                holeDrawInfo.areaGeos[len - 2].pos,
                                holeDrawInfo.areaGeos[len - 1].pos
                              ),
                            };
                            holeDrawInfo.areaLineRectGeos.push(areaSqIf);
                          }

                          if (
                            holeDrawInfo.areaRectGeos.length >= 3 &&
                            pointInPolygon(holeDrawInfo.areaRectGeos[0].area, curPos)
                          ) {
                            initDrawAreas();
                            setDrawArea(DRAW_AREA_TYPE_CLOSE, null, null);
                          } else {
                            const curPosIf = {
                              sectCd: HOLE_SECT_TEE,
                              seq: holeDrawInfo.areaGeos.length,
                              pos: curPos,
                            };
                            holeDrawInfo.areaGeos.push(curPosIf);

                            const areaIf = {
                              idx: holeDrawInfo.areaRectGeos.length,
                              area: makeClickArea(curPos, scalePtSize),
                            };
                            holeDrawInfo.areaRectGeos.push(areaIf);

                            holeDrawInfo.idxDragArea = holeDrawInfo.idxDragArea + 1;

                            initDrawAreas();
                            setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
                          }
                        }
                      }
                    } else {
                      if (keybCtrl.isAlt === true) {
                        initDrawAreas();

                        if (uiCtrl.areaPtType === DRAW_AREA_TYPE_ADD) {
                          setDrawArea(DRAW_AREA_TYPE_ADD, curPos, scalePtSize);
                        } else if (uiCtrl.areaPtType === DRAW_AREA_TYPE_DEL) {
                          setDrawArea(DRAW_AREA_TYPE_DEL, null, null);
                        } else {
                          setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
                        }
                      }
                    }
                  }
                } else {
                  dispatch(
                    areltRedux({
                      isModal: true,
                      contents: "해당 홀을 설정하셔야 맵 편집을 할 수 있습니다.",
                    })
                  );
                }
              } else {
                var str = "";
                if (uiCtrl.pointType === CD_HOLE_ALL) {
                  str = "홀을 세부 설정(hole, pin, tee, ip, dots)을 하셔야 맵 편집을 할 수 있습니다.";
                } else {
                  str: "해당 코스 및 홀을 설정하셔야 맵 편집을 할 수 있습니다.";
                }
                dispatch(
                  areltRedux({
                    isModal: true,
                    contents: str,
                  })
                );
              }
            });

            // 마우스 이동 리스너
            window.kakao.maps.event.addListener(map, "mousemove", function (mouseEvent) {
              console.log(">>> crs >>> addListener >>> mousemove!!!");

              curPos = mouseEvent.latLng;
              if (uiCtrl.pointType === CD_COURSE) {
                if (uiCtrl.coDiv !== "" && uiCtrl.crsCd != "" && uiCtrl.crsCd != "N") {
                  if (crsDrawInfo.drawingFlagC) {
                    if (!crsDrawInfo.isModBox) {
                      setNotDrag(CD_COURSE, mouseEvent.latLng);
                    } else {
                      const curCoord = calcGeoPosOnImage(mapMbr, curPos, mapGeoSize, mapViewSize);
                      crsDrawInfo.modBoxDelta.y = crsDrawInfo.modBoxInitCoord.y - curCoord.y;
                      crsDrawInfo.modBoxDelta.x = crsDrawInfo.modBoxInitCoord.x - curCoord.x;
                      crsDrawInfo.modBoxInitCoord = curCoord;
                      var centRectGeo = centLine(crsDrawInfo.gbGeos[0], crsDrawInfo.gbGeos[2]);

                      if (crsDrawInfo.idxDragBox >= SCALE_IDX_LT && crsDrawInfo.idxDragBox <= SCALE_IDX_RB) {
                        crsDrawInfo.gbBuf.coords = rectScale(
                          crsDrawInfo.gbCoords,
                          crsDrawInfo.gbInclin,
                          crsDrawInfo.idxDragBox,
                          crsDrawInfo.modBoxDelta,
                          0
                        );
                      } else if (crsDrawInfo.idxDragBox == MOVE_BOX) {
                        crsDrawInfo.gbBuf.coords = rectPos(crsDrawInfo.gbCoords, crsDrawInfo.modBoxDelta);
                      }

                      if (
                        (crsDrawInfo.idxDragBox >= SCALE_IDX_LT && crsDrawInfo.idxDragBox <= SCALE_IDX_RB) ||
                        crsDrawInfo.idxDragBox == MOVE_BOX
                      ) {
                        var rectMbr = convCoords2LatLngs(mapMbr, crsDrawInfo.gbBuf.coords, mapGeoSize, mapViewSize);
                        crsDrawInfo.gbRect.setPath(rectMbr);
                        setGbRectPts(CD_COURSE, rectMbr, true, true);
                        centRectGeo = centLine(rectMbr[0], rectMbr[2]);
                        setGbCentPt(CD_COURSE, new window.kakao.maps.LatLng(centRectGeo.lat, centRectGeo.lng), true);
                        setGbDirTexts(CD_COURSE, rectMbr, true);
                      }
                    }
                  }
                } else {
                  crsDrawInfo.drawingFlagC = false;
                }
              } else if (uiCtrl.pointType === CD_HOLE) {
                if (uiCtrl.holeNo > 0) {
                  if (holeDrawInfo.drawingFlagH) {
                    if (!holeDrawInfo.isModBox) {
                      setNotDrag(CD_HOLE, mouseEvent.latLng);
                    } else {
                      const curCoord = calcGeoPosOnImage(mapMbr, curPos, mapGeoSize, mapViewSize);
                      holeDrawInfo.modBoxDelta.y = holeDrawInfo.modBoxInitCoord.y - curCoord.y;
                      holeDrawInfo.modBoxDelta.x = holeDrawInfo.modBoxInitCoord.x - curCoord.x;
                      holeDrawInfo.modBoxInitCoord = curCoord;
                      var centRectGeo = centLine(holeDrawInfo.gbGeos[0], holeDrawInfo.gbGeos[2]);

                      if (holeDrawInfo.idxDragBox >= SCALE_IDX_LT && holeDrawInfo.idxDragBox <= SCALE_IDX_RB) {
                        holeDrawInfo.gbBuf.coords = rectScale(
                          holeDrawInfo.gbCoords,
                          holeDrawInfo.gbInclin,
                          holeDrawInfo.idxDragBox,
                          holeDrawInfo.modBoxDelta,
                          holeDrawInfo.gbRot
                        );
                      } else if (holeDrawInfo.idxDragBox == MOVE_BOX) {
                        holeDrawInfo.gbBuf.coords = rectPos(holeDrawInfo.gbCoords, holeDrawInfo.modBoxDelta);
                      } else if (holeDrawInfo.idxDragBox == ROTATE_BOX) {
                        const curCoord = calcGeoPosOnImage(mapMbr, curPos, mapGeoSize, mapViewSize);
                        const curRectCoord = calcGeoPosOnImage(
                          mapMbr,
                          new window.kakao.maps.LatLng(centRectGeo.lat, centRectGeo.lng),
                          mapGeoSize,
                          mapViewSize
                        );

                        holeDrawInfo.modBoxDelta.y = curCoord.y - curRectCoord.y;
                        holeDrawInfo.modBoxDelta.x = curCoord.x - curRectCoord.x;

                        const rectData = rectRot(
                          holeDrawInfo.gbCoords,
                          curRectCoord,
                          holeDrawInfo.modBoxDelta,
                          holeDrawInfo.initMbDegree,
                          holeDrawInfo.gbRot
                        );
                        holeDrawInfo.gbBuf.coords = rectData.coords;
                        holeDrawInfo.gbBuf.rot = rectData.rot;
                      }

                      if (
                        (holeDrawInfo.idxDragBox >= SCALE_IDX_LT && holeDrawInfo.idxDragBox <= SCALE_IDX_RB) ||
                        holeDrawInfo.idxDragBox == MOVE_BOX ||
                        holeDrawInfo.idxDragBox == ROTATE_BOX
                      ) {
                        var rectMbr = convCoords2LatLngs(mapMbr, holeDrawInfo.gbBuf.coords, mapGeoSize, mapViewSize);
                        holeDrawInfo.gbRect.setPath(rectMbr);
                        setGbRectPts(CD_HOLE, rectMbr, true, true);
                        centRectGeo = centLine(rectMbr[0], rectMbr[2]);
                        setGbCentPt(CD_HOLE, new window.kakao.maps.LatLng(centRectGeo.lat, centRectGeo.lng), true);
                        setGbDirTexts(CD_HOLE, rectMbr, true);

                        if (holeDrawInfo.idxDragBox >= SCALE_IDX_LT && holeDrawInfo.idxDragBox <= SCALE_IDX_RB) {
                          holeDrawInfo.gbZoomN = setCalcZoomN(rectMbr);
                        }
                      }
                    }
                  }
                } else {
                  holeDrawInfo.drawingFlagH = false;
                }
              } else if (uiCtrl.pointType === CD_IP) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  if (holeDrawInfo.drawingFlagI) {
                    if (!holeDrawInfo.isModifyIp) {
                      setNotDrag(CD_IP, mouseEvent.latLng);
                    } else {
                      if (holeDrawInfo.idxDragIp !== 99) {
                        var path = holeDrawInfo.ipPls.getPath();

                        if (
                          holeDrawInfo.ipGeos.length > holeDrawInfo.idxDragIp + 1 &&
                          path.length > holeDrawInfo.idxDragIp + 1
                        ) {
                          holeDrawInfo.ipGeos[holeDrawInfo.idxDragIp + 1] = curPos;
                          path[holeDrawInfo.idxDragIp + 1] = curPos;

                          holeDrawInfo.ipPls.setPath(path);
                          holeDrawInfo.ipCirPts[holeDrawInfo.idxDragIp].setOptions({
                            center: curPos,
                          });

                          holeDrawInfo.ipDistTexts[holeDrawInfo.idxDragIp].setPosition(curPos);

                          var dist = calDist(
                            convLatLng2Geo(holeDrawInfo.ipGeos[holeDrawInfo.idxDragIp]),
                            convLatLng2Geo(holeDrawInfo.ipGeos[holeDrawInfo.idxDragIp + 1])
                          );
                          holeDrawInfo.ipDistTexts[holeDrawInfo.idxDragIp].setContent(Math.round(dist) + " m");
                        }
                      }
                    }
                  }
                } else {
                  holeDrawInfo.drawingFlagI = false;
                }
              } else if (uiCtrl.pointType === CD_AREA) {
                if (uiCtrl.holeNo != undefined && uiCtrl.holeNo > 0) {
                  if (holeDrawInfo.drawingFlagA) {
                    if (!keybCtrl.isAlt) {
                      if (!holeDrawInfo.isModifyArea) {
                        setNotDrag(CD_AREA, curPos);
                      } else {
                        if (holeDrawInfo.idxDragArea !== 99) {
                          var path = null;
                          if (holeDrawInfo.areaPolys != null) {
                            path = holeDrawInfo.areaPolys.getPath();
                          } else {
                            path = holeDrawInfo.areaPls.getPath();
                          }

                          if (holeDrawInfo.areaPolys != null && path.length >= 3) {
                            if (
                              holeDrawInfo.areaGeos.length > holeDrawInfo.idxDragArea &&
                              path.length > holeDrawInfo.idxDragArea
                            ) {
                              holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea].pos = curPos;
                              holeDrawInfo.areaRectGeos[holeDrawInfo.idxDragArea].area = makeClickArea(
                                curPos,
                                scalePtSize
                              );

                              path[holeDrawInfo.idxDragArea] = curPos;

                              holeDrawInfo.areaPolys.setPath(path);

                              holeDrawInfo.areaCirPts[holeDrawInfo.idxDragArea].setOptions({
                                center: curPos,
                              });

                              if (holeDrawInfo.idxDragArea == 0) {
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.areaLineRectGeos.length - 1].area =
                                  makeLineToRect(
                                    GB_COLLIS_LINE_WIDTH,
                                    holeDrawInfo.areaGeos[holeDrawInfo.areaGeos.length - 1].pos,
                                    curPos
                                  );
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area = makeLineToRect(
                                  GB_COLLIS_LINE_WIDTH,
                                  curPos,
                                  holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea + 1].pos
                                );

                                var bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(
                                    holeDrawInfo.areaLineRectGeos[holeDrawInfo.areaLineRectGeos.length - 1].area[i]
                                  );
                                }
                                holeDrawInfo.areaGuidePolys[holeDrawInfo.areaLineRectGeos.length - 1].setPath(bPaths);

                                var bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area[i]);
                                }
                                holeDrawInfo.areaGuidePolys[holeDrawInfo.idxDragArea].setPath(bPaths);
                              } else if (holeDrawInfo.idxDragArea == holeDrawInfo.areaGeos.length - 1) {
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea - 1].area = makeLineToRect(
                                  GB_COLLIS_LINE_WIDTH,
                                  holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea - 1].pos,
                                  curPos
                                );
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area = makeLineToRect(
                                  GB_COLLIS_LINE_WIDTH,
                                  curPos,
                                  holeDrawInfo.areaGeos[0].pos
                                );

                                var bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea - 1].area[i]);
                                }

                                holeDrawInfo.areaGuidePolys[holeDrawInfo.idxDragArea - 1].setPath(bPaths);

                                bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area[i]);
                                }
                                holeDrawInfo.areaGuidePolys[holeDrawInfo.idxDragArea].setPath(bPaths);
                              } else {
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea - 1].area = makeLineToRect(
                                  GB_COLLIS_LINE_WIDTH,
                                  holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea - 1].pos,
                                  curPos
                                );
                                holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area = makeLineToRect(
                                  GB_COLLIS_LINE_WIDTH,
                                  curPos,
                                  holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea + 1].pos
                                );

                                var bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea - 1].area[i]);
                                }

                                holeDrawInfo.areaGuidePolys[holeDrawInfo.idxDragArea - 1].setPath(bPaths);

                                bPaths = [];
                                for (let i = 0; i < 4; i++) {
                                  bPaths.push(holeDrawInfo.areaLineRectGeos[holeDrawInfo.idxDragArea].area[i]);
                                }
                                holeDrawInfo.areaGuidePolys[holeDrawInfo.idxDragArea].setPath(bPaths);
                              }
                            }
                          } else {
                            if (
                              holeDrawInfo.areaGeos.length > holeDrawInfo.idxDragArea + 1 &&
                              path.length > holeDrawInfo.idxDragArea + 1
                            ) {
                              holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea + 1].pos = curPos;
                              path[holeDrawInfo.idxDragArea + 1] = curPos;

                              holeDrawInfo.areaPls.setPath(path);
                              setAreaCloseDrag(curPos);

                              holeDrawInfo.areaCirPts[holeDrawInfo.idxDragArea].setOptions({
                                center: curPos,
                              });
                            }
                          }
                        }
                      }
                    } else {
                      if (keybCtrl.isAlt === true) {
                        // setAreaDelDrag(curPos);
                        setAreaAddDelDrag(curPos);
                      }
                    }
                  }
                } else {
                  holeDrawInfo.drawingFlagA = false;
                }
              }
            });

            kakao.maps.event.addListener(map, "mouseover", function () {});
            kakao.maps.event.addListener(map, "mouseout", function () {});

            // 마우스 오른쪽 클릭 리스너
            window.kakao.maps.event.addListener(map, "rightclick", function (mouseEvent) {
              console.log(">>>>>>>>>>>>>>>> rightclick !!!");
              if (holeDrawInfo.drawingFlagH) {
                // 창 열기 리덕스
                map.setCursor("default");

                holeDrawInfo.drawingFlagH = false;
              }

              if (holeDrawInfo.drawingFlagT) {
                map.setCursor("default");

                holeDrawInfo.drawingFlagT = false;
              }

              if (holeDrawInfo.drawingFlagI) {
                map.setCursor("default");

                holeDrawInfo.drawingFlagI = false;
              }

              if (holeDrawInfo.drawingFlagA) {
                map.setCursor("default");
                holeDrawInfo.drawingFlagA = false;
              }
            });

            // 드레그 시작 리스너
            kakao.maps.event.addListener(map, "dragstart", function () {});

            // 드레그 중 리스너
            kakao.maps.event.addListener(map, "drag", function () {});

            // 드레그 종료 리스너
            kakao.maps.event.addListener(map, "dragend", function () {});

            // 맵 영역이 변경 리스너
            window.kakao.maps.event.addListener(map, "bounds_changed", function () {
              initBounce();
            });

            window.addEventListener("keydown", (event) => {
              if (event.altKey) {
                keybCtrl.isAlt = true;
                setAreaAddDelDrag(curPos);
              } else {
                keybCtrl.isAlt = false;
              }
            });

            window.addEventListener("keyup", (event) => {
              keybCtrl.isAlt = false;

              setNotDrag(CD_AREA, curPos);
            });
          }

          setCrsDrawData();
        }
      });
    };

    $script.addEventListener("load", onLoadKakaoMap);
  }, [crsInfo]);

  // 위성, 라인 선택 리덕스 처리
  useEffect(() => {
    if (map) {
      if (mapSetValue === "R") {
        map.setMapTypeId(kakao.maps.MapTypeId.ROADMAP);
      } else if (mapSetValue === "H") {
        map.setMapTypeId(kakao.maps.MapTypeId.HYBRID);
      }
    }
  }, [mapSetValue]);

  // 화면 영역(크기)롸 관련 된 정보 초기화
  function initBounce() {
    mapMbr = convBounds2Mbr(map.getBounds());
    mapGeoSize.width = calDist(mapMbr[3], mapMbr[2]);
    mapGeoSize.height = calDist(mapMbr[3], mapMbr[0]);
    mapInfo.zoomBuf = map.getLevel();

    if (uiCtrl.pointType === CD_COURSE) {
      if (crsDrawInfo.gbGeos.length === 4) {
        crsDrawInfo.gbCoords = [];

        for (let i = 0; i < crsDrawInfo.gbGeos.length; i++) {
          var coord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);
          crsDrawInfo.gbCoords.push(coord);
        }

        const centGeo = centLine(crsDrawInfo.gbGeos[0], crsDrawInfo.gbGeos[2]);
        crsDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
        crsDrawInfo.gbCentCoord = calcGeoPosOnImage(mapMbr, crsDrawInfo.gbCentGeo, mapGeoSize, mapViewSize);

        initDrawCrs();
        setDrawRect(CD_COURSE);
      }
    } else if (
      uiCtrl.pointType === CD_HOLE_ALL ||
      uiCtrl.pointType === CD_HOLE ||
      uiCtrl.pointType === CD_PIN ||
      uiCtrl.pointType === CD_TEE ||
      uiCtrl.pointType === CD_IP ||
      uiCtrl.pointType === CD_DOT ||
      uiCtrl.pointType === CD_AREA
    ) {
      if (holeDrawInfo.gbGeos.length === 4 && holeDrawInfo.drawingFlagH === true) {
        holeDrawInfo.gbCoords = [];

        for (let i = 0; i < holeDrawInfo.gbGeos.length; i++) {
          var coord = calcGeoPosOnImage(mapMbr, holeDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);
          holeDrawInfo.gbCoords.push(coord);
        }

        const centGeo = centLine(holeDrawInfo.gbGeos[0], holeDrawInfo.gbGeos[2]);
        holeDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(centGeo.lat, centGeo.lng);
        holeDrawInfo.gbCentCoord = calcGeoPosOnImage(mapMbr, holeDrawInfo.gbCentGeo, mapGeoSize, mapViewSize);

        initDrawHole();
        setDrawRect(CD_HOLE);

        for (let i = 0; i < holeDrawInfo.dotCirPts.length; i++) {
          if (holeDrawInfo.dotCirPts[i] != null) {
            holeDrawInfo.dotCirPts[i].setOptions({
              radius: mapInfo.zoomBuf,
            });
          }
        }

        for (let i = 0; i < holeDrawInfo.ipCirPts.length; i++) {
          if (holeDrawInfo.ipCirPts[i] != null) {
            holeDrawInfo.ipCirPts[i].setOptions({
              radius: mapInfo.zoomBuf,
            });
          }
        }

        for (let i = 0; i < holeDrawInfo.teeCirPts.length; i++) {
          if (holeDrawInfo.teeCirPts[i] != null) {
            holeDrawInfo.teeCirPts[i].setOptions({
              radius: mapInfo.zoomBuf,
            });
          }
        }

        for (let i = 0; i < holeDrawInfo.areaCirPts.length; i++) {
          if (holeDrawInfo.areaCirPts[i] != null) {
            holeDrawInfo.areaCirPts[i].setOptions({
              radius: mapInfo.zoomBuf,
            });
          }
        }

        if (holeDrawInfo.pinCirPt != null) {
          holeDrawInfo.pinCirPt.setOptions({
            radius: mapInfo.zoomBuf,
          });
        }
      }
    }
  }

  // 홀 정보 리덕스 처리
  useEffect(() => {
    if (holeInfo === undefined) {
      initHoleMapData();
      initDrawAll();
    } else {
      if (holeInfo != undefined && !isEmpty(holeInfo)) {
        initHoleMapInfo();

        if (map) setHoleDrawData();
      } else {
        initDrawAll();
      }

      if (
        uiCtrl.pointType !== CD_HOLE &&
        uiCtrl.pointType !== CD_PIN &&
        uiCtrl.pointType !== CD_TEE &&
        uiCtrl.pointType !== CD_IP &&
        uiCtrl.pointType !== CD_DOT &&
        uiCtrl.pointType !== CD_AREA
      ) {
        uiCtrl.pointType = CD_HOLE_ALL;
      }
    }

    // 코스 및 홀에 대한 카카오맵 구성 요소를 초기화 함
    function initHoleMapData() {
      mapInfo.hole.geos = [];
      mapInfo.hole.rot = 0.0;
      mapInfo.hole.zoomN = 0.0;
      mapInfo.hole.centGeo.lat = 0.0;
      mapInfo.hole.centGeo.lng = 0.0;

      uiCtrl.holeNo = 0;
      uiCtrl.par = 3;
      uiCtrl.holeNoNm = "";
      uiCtrl.handi = 0;
      uiCtrl.holeExpl = "";

      holeDrawInfo.gbGeos = [];
      holeDrawInfo.gbCoords = [];
      holeDrawInfo.gbCentGeo = null;
      holeDrawInfo.gbCentCoord = {};
      holeDrawInfo.gbZoomW = 3;
      holeDrawInfo.gbZoomN = 16.0;
      holeDrawInfo.gbRot = 0.0;
      holeDrawInfo.gbInclin.a = 0.0;
      holeDrawInfo.gbInclin.b = 0.0;
      holeDrawInfo.gbBuf.rot = 0.0;
      holeDrawInfo.gbBuf.coords = [];

      holeDrawInfo.drawingFlagH = false;
      holeDrawInfo.initMbDegree = 0.0;
      holeDrawInfo.modBoxInitCoord.x = 0;
      holeDrawInfo.modBoxInitCoord.y = 0;
      holeDrawInfo.modBoxDelta.x = 0;
      holeDrawInfo.modBoxDelta.y = 0;
      holeDrawInfo.isModBox = false;
      holeDrawInfo.idxDragBox = 99;

      holeDrawInfo.pinGeo = null;

      holeDrawInfo.drawingFlagT = false;
      holeDrawInfo.teeInfos = [];
      holeDrawInfo.removTeeInfo.seq = 0;

      holeDrawInfo.ipGeos = [];
      holeDrawInfo.ipRectGeos = [];
      holeDrawInfo.drawingFlagI = false;
      holeDrawInfo.idxDragIp = 99;
      holeDrawInfo.isModifyIp = false;

      holeDrawInfo.dotInfos = [];
      holeDrawInfo.removDotInfo.gp = 0;
      holeDrawInfo.removDotInfo.seq = 0;
      uiCtrl.lastSeq = [];

      holeDrawInfo.areaGeos = [];
      holeDrawInfo.areaRectGeos = [];
      holeDrawInfo.areaLineRectGeos = [];

      holeDrawInfo.drawingFlagA = false;
      holeDrawInfo.idxDragArea = 99;
      holeDrawInfo.isModifyArea = false;
      holeDrawInfo.isCloseArea = false;

      holeDrawInfo.action = "";
    }

    function initHoleMapInfo() {
      if (uiCtrl.coDiv !== "") {
        if (uiCtrl.crsCd !== "N") {
          var scalePtSize = 0.00005;
          const zoom = map.getLevel();
          if (zoom != 2) {
            scalePtSize = GB_SCALE_POINT_SIZE * (zoom - 2);
          }

          initHoleMapData();

          uiCtrl.holeNo = holeInfo.holeNo;
          uiCtrl.par = holeInfo.par;
          uiCtrl.holeNoNm = holeInfo.holeNoNm;
          uiCtrl.handi = holeInfo.handi;
          uiCtrl.holeExpl = holeInfo.holeExpl;

          if (
            holeInfo.tlLaY !== 0 &&
            holeInfo.tlLoX !== 0 &&
            holeInfo.trLaY !== 0 &&
            holeInfo.trLoX !== 0 &&
            holeInfo.brLaY !== 0 &&
            holeInfo.brLoX !== 0 &&
            holeInfo.blLaY !== 0 &&
            holeInfo.blLoX !== 0
          ) {
            holeDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(holeInfo.tlLaY, holeInfo.tlLoX));
            holeDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(holeInfo.trLaY, holeInfo.trLoX));
            holeDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(holeInfo.brLaY, holeInfo.brLoX));
            holeDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(holeInfo.blLaY, holeInfo.blLoX));

            for (let i = 0; i < holeDrawInfo.gbGeos.length; i++) {
              var coord = calcGeoPosOnImage(mapMbr, holeDrawInfo.gbGeos[i], mapGeoSize, mapViewSize);

              holeDrawInfo.gbCoords.push(coord);
            }

            holeDrawInfo.gbCentGeo = new window.kakao.maps.LatLng(holeInfo.centerGeoY, holeInfo.centerGeoX);
            holeDrawInfo.gbCentCoord = calcGeoPosOnImage(mapMbr, holeDrawInfo.gbCentGeo, mapGeoSize, mapViewSize);
            holeDrawInfo.gbZoomW = holeInfo.zoomW;
            holeDrawInfo.gbZoomN = holeInfo.zoomN;
            holeDrawInfo.gbRot = holeInfo.rotate;

            if (holeDrawInfo.gbGeos.length === 4 && holeInfo.centerGeoY !== 0 && holeInfo.centerGeoX !== 0) {
              mapInfo.hole.geos = convLatLngs2Geos(holeDrawInfo.gbGeos);
              mapInfo.hole.centGeo.lat = holeInfo.centerGeoY;
              mapInfo.hole.centGeo.lng = holeInfo.centerGeoX;

              mapInfo.lat = holeInfo.centerGeoY;
              mapInfo.lng = holeInfo.centerGeoX;
              mapInfo.hole.rot = holeInfo.rotate;
              mapInfo.zoomW = holeInfo.zoomW;
              mapInfo.hole.zoomN = holeInfo.zoomN;
            }

            if (holeInfo.pinGeoY !== 0 && holeInfo.pinGeoX !== 0) {
              holeDrawInfo.pinGeo = new window.kakao.maps.LatLng(holeInfo.pinGeoY, holeInfo.pinGeoX);
            }

            if (holeInfo.par > 3 && map) {
              var drawInfo;

              if (holeInfo.ipZGeoY !== 0 && holeInfo.ipZGeoX != 0) {
                holeDrawInfo.ipGeos.push(new window.kakao.maps.LatLng(holeInfo.ipZGeoY, holeInfo.ipZGeoX));
              }

              if (holeInfo.ipFGeoY !== 0 && holeInfo.ipFGeoX != 0) {
                holeDrawInfo.ipGeos.push(new window.kakao.maps.LatLng(holeInfo.ipFGeoY, holeInfo.ipFGeoX));

                var mbr = [];
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[1].getLat() + scalePtSize,
                    holeDrawInfo.ipGeos[1].getLng() - scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[1].getLat() + scalePtSize,
                    holeDrawInfo.ipGeos[1].getLng() + scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[1].getLat() - scalePtSize,
                    holeDrawInfo.ipGeos[1].getLng() + scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[1].getLat() - scalePtSize,
                    holeDrawInfo.ipGeos[1].getLng() - scalePtSize
                  )
                );
                holeDrawInfo.ipRectGeos.push(mbr);
              }

              if (holeInfo.ipSGeoY !== 0 && holeInfo.ipSGeoX != 0) {
                holeDrawInfo.ipGeos.push(new window.kakao.maps.LatLng(holeInfo.ipSGeoY, holeInfo.ipSGeoX));

                var mbr = [];
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[2].getLat() + scalePtSize,
                    holeDrawInfo.ipGeos[2].getLng() - scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[2].getLat() + scalePtSize,
                    holeDrawInfo.ipGeos[2].getLng() + scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[2].getLat() - scalePtSize,
                    holeDrawInfo.ipGeos[2].getLng() + scalePtSize
                  )
                );
                mbr.push(
                  new window.kakao.maps.LatLng(
                    holeDrawInfo.ipGeos[2].getLat() - scalePtSize,
                    holeDrawInfo.ipGeos[2].getLng() - scalePtSize
                  )
                );
                holeDrawInfo.ipRectGeos.push(mbr);
              }
            }

            if (holeDrawInfo.ipGeos.length > 1) {
              holeDrawInfo.drawingFlagI = true;
            }

            if (holeInfo.wmg201s !== undefined) {
              for (let i = 0; i < holeInfo.wmg201s.length; i++) {
                const tee = {
                  seq: holeInfo.wmg201s[i].teeSeq,
                  code: holeInfo.wmg201s[i].teeCode,
                  clr: holeInfo.wmg201s[i].teeClr,
                  nm: holeInfo.wmg201s[i].teeNm,
                  nmSec: holeInfo.wmg201s[i].teeNmSec,
                  geo: {
                    lat: holeInfo.wmg201s[i].teeGeoY,
                    lng: holeInfo.wmg201s[i].teeGeoX,
                  },
                };

                holeDrawInfo.teeInfos.push(tee);
              }
            }

            if (holeInfo.wmg202s !== undefined) {
              for (let i = 0; i < holeInfo.wmg202s.length; i++) {
                var dotInfo = uiCtrl.lastSeq.find((it) => it.gp === holeInfo.wmg202s[i].dotGp);

                if (dotInfo === undefined) {
                  const last = {
                    gp: holeInfo.wmg202s[i].dotGp,
                    seq: holeInfo.wmg202s[i].dotSeq,
                  };

                  uiCtrl.lastSeq.push(last);
                } else {
                  if (dotInfo.seq < holeInfo.wmg202s[i].dotSeq) {
                    dotInfo.seq = holeInfo.wmg202s[i].dotSeq;
                  }
                }

                const dot = {
                  gp: holeInfo.wmg202s[i].dotGp,
                  seq: holeInfo.wmg202s[i].dotSeq,
                  geo: {
                    lat: holeInfo.wmg202s[i].dotGeoY,
                    lng: holeInfo.wmg202s[i].dotGeoX,
                  },
                };

                holeDrawInfo.dotInfos.push(dot);
              }
            }

            if (holeInfo.wmg203s !== undefined) {
              for (let i = 0; i < holeInfo.wmg203s.length; i++) {
                const area = {
                  sectCd: holeInfo.wmg203s[i].areaSectCd,
                  seq: holeInfo.wmg203s[i].areaSeq,
                  pos: new window.kakao.maps.LatLng(holeInfo.wmg203s[i].areaGeoY, holeInfo.wmg203s[i].areaGeoX),
                };
                holeDrawInfo.areaGeos.push(area);

                var mbr = [];
                mbr.push(
                  new window.kakao.maps.LatLng(area.pos.getLat() + scalePtSize, area.pos.getLng() - scalePtSize)
                );
                mbr.push(
                  new window.kakao.maps.LatLng(area.pos.getLat() + scalePtSize, area.pos.getLng() + scalePtSize)
                );
                mbr.push(
                  new window.kakao.maps.LatLng(area.pos.getLat() - scalePtSize, area.pos.getLng() + scalePtSize)
                );
                mbr.push(
                  new window.kakao.maps.LatLng(area.pos.getLat() - scalePtSize, area.pos.getLng() - scalePtSize)
                );

                const areaIf = {
                  idx: holeInfo.wmg203s[i].areaSeq,
                  area: mbr,
                };
                holeDrawInfo.areaRectGeos.push(areaIf);
              }
            }

            const len = holeDrawInfo.areaGeos.length;
            if (len >= 3) {
              holeDrawInfo.drawingFlagA = true;
              holeDrawInfo.isCloseArea = true;

              for (let i = 0; i < len; i++) {
                var endIdx = 0;
                if (i != len - 1) {
                  endIdx = i + 1;
                }

                const areaSqIf = {
                  idx: i,
                  area: makeLineToRect(
                    GB_COLLIS_LINE_WIDTH,
                    holeDrawInfo.areaGeos[i].pos,
                    holeDrawInfo.areaGeos[endIdx].pos
                  ),
                };
                holeDrawInfo.areaLineRectGeos.push(areaSqIf);
              }
            }

            holeDrawInfo.drawingFlagH = true;
          }
        } else {
          uiCtrl.pointType = CD_COMP;
        }
      } else {
        uiCtrl.pointType = undefined;
      }
    }

    function setHoleDrawData() {
      initDrawAll();

      if (uiCtrl.holeNo === 0 || holeDrawInfo.gbGeos.length !== 4) {
        holeDrawInfo.drawingFlagH = false;
        holeDrawInfo.drawingFlagI = false;
        holeDrawInfo.drawingFlagA = false;
      } else {
        if (uiCtrl.pointType === CD_HOLE) {
          holeDrawInfo.drawingFlagH = true;
        } else if (uiCtrl.pointType === CD_IP) {
          holeDrawInfo.drawingFlagI = true;
        } else if (uiCtrl.pointType === CD_AREA) {
          holeDrawInfo.drawingFlagA = true;
        }

        if (!isEmpty(holeDrawInfo.gbGeos) && holeDrawInfo.gbGeos.length > 0) {
          setDrawRect(CD_HOLE);
          setDrawPin();
          setDrawTee();
          setDrawIp();
          setDrawDot();
          setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
        }
      }
    }
  }, [holeInfo]);

  // 화면 메뉴 선택 리덕스 처리
  useEffect(() => {
    if (!isEmpty(menuSelect)) {
      uiCtrl.pointType = menuSelect;

      if (
        uiCtrl.pointType === CD_PIN ||
        uiCtrl.pointType === CD_TEE ||
        uiCtrl.pointType === CD_IP ||
        uiCtrl.pointType === CD_DOT ||
        uiCtrl.pointType === CD_AREA
      ) {
        if (map) {
          map.setCursor("default");
        }
      }
    }
  }, [menuSelect]);

  // 선택 홀 정보 리덕스 처리
  useEffect(() => {
    if (holeReducer !== undefined && !isEmpty(holeReducer)) {
      uiCtrl.holeNo = holeReducer.hole;
      uiCtrl.par = holeReducer.par;
      uiCtrl.holeNoNm = holeReducer.holeNoNm;
      uiCtrl.handi = holeReducer.handi;
      uiCtrl.holeExpl = holeReducer.holeExpl;

      apiUpdHoleInfo();
    }
  }, [holeReducer]);

  // 티 정보 리덕스 처리
  useEffect(() => {
    if (teeReducer !== undefined && !isEmpty(teeReducer)) {
      if (teeReducer === CD_DELETE) {
        holeDrawInfo.drawingFlagT = false;

        holeDrawInfo.removTeeInfo = holeDrawInfo.teeInfos.find((it) => it.seq === uiCtrl.teeSeq);
        holeDrawInfo.teeInfos = holeDrawInfo.teeInfos.filter((it) => it.seq !== uiCtrl.teeSeq);
        holeDrawInfo.action = CD_DELETE;

        apiUpdHoleInfo();
      } else if (teeReducer === CD_CANCLE) {
        holeDrawInfo.drawingFlagT = false;
      } else {
        if (uiCtrl.crsCd !== "" && uiCtrl.crsCd !== "N" && uiCtrl.holeNo != 0) {
          uiCtrl.holeNo = teeReducer.hole;
          uiCtrl.teeSeq = teeReducer.seq;

          holeDrawInfo.drawingFlagT = true;

          var fItem = holeDrawInfo.teeInfos.find((it) => it.seq === uiCtrl.teeSeq);

          if (fItem === undefined) {
            const tee = {
              seq: teeReducer.seq,
              code: teeReducer.code,
              clr: teeReducer.clr,
              nm: teeReducer.nm,
              nmSec: teeReducer.nmSec,
              geo: {
                lat: 0.0,
                lng: 0.0,
              },
            };

            holeDrawInfo.teeInfos.push(tee);
          } else {
            fItem.code = teeReducer.code;
            fItem.clr = teeReducer.clr;
            fItem.nm = teeReducer.nm;
            fItem.nmSec = teeReducer.nmSec;
          }

          holeDrawInfo.action = CD_SAVE;

          apiUpdHoleInfo();
        }
      }
    }
  }, [teeReducer]);

  // 닷 정보 리덕스 처리
  useEffect(() => {
    if (dotReducer !== undefined && !isEmpty(dotReducer)) {
      if (dotReducer === CD_DELETE) {
        holeDrawInfo.removDotInfo = holeDrawInfo.dotInfos.find(
          (it) => it.gp === uiCtrl.dotGp && it.seq === uiCtrl.dotSeq
        );

        holeDrawInfo.dotInfos = holeDrawInfo.dotInfos.filter(
          (it) => !(it.gp === uiCtrl.dotGp && it.seq === uiCtrl.dotSeq)
        );
        holeDrawInfo.action = CD_DELETE;

        apiUpdHoleInfo();
      } else if (dotReducer === CD_CANCLE) {
      } else {
        if (dotReducer.group !== undefined && dotReducer.group !== 99) {
          uiCtrl.dotGp = dotReducer.group;
        }

        if (dotReducer.save !== undefined && dotReducer.save !== "") {
          uiCtrl.dotGp = dotReducer.save;
        }
      }
    }
  }, [dotReducer]);

  // 가이드 박스 정보 리덕스 처리
  useEffect(() => {
    if (guideReducer !== undefined && !isEmpty(guideReducer) && holeDrawInfo.gbCentGeo !== null) {
      if (guideReducer !== 99) {
        baseMapSetInfo.idxBaseMap = guideReducer;

        setGbReversRectPts(holeDrawInfo.gbCentGeo, holeDrawInfo.gbZoomN, holeDrawInfo.gbRot);

        initDrawHole();
        setDrawRect(CD_HOLE);
      } else {
        baseMapSetInfo.idxBaseMap = 0;
      }
    }
  }, [guideReducer]);

  // 핸드폰 가이드 박스 정보 리덕스 처리
  useEffect(() => {
    if (compInfoReducer !== undefined && !isEmpty(compInfoReducer)) {
      for (let i = 0; i < compInfoReducer.mobileInfoData.length; i++) {
        var distWs = [];
        var tdistW = compInfoReducer.mobileInfoData[i].mbBaseDistWidth;
        distWs.push(tdistW);
        distWs.push(tdistW / 2);
        distWs.push(tdistW / 4);
        distWs.push(tdistW / 8);

        var distHs = [];
        var tdistH = compInfoReducer.mobileInfoData[i].mbBaseDistHeight;
        distHs.push(tdistH);
        distHs.push(tdistH / 2);
        distHs.push(tdistH / 4);
        distHs.push(tdistH / 8);

        var distWDeltas = [];
        distWDeltas.push((distWs[0] - distWs[1]) / 10);
        distWDeltas.push((distWs[1] - distWs[2]) / 10);
        distWDeltas.push((distWs[2] - distWs[3]) / 10);

        var distHDeltas = [];
        distHDeltas.push((distHs[0] - distHs[1]) / 10);
        distHDeltas.push((distHs[1] - distHs[2]) / 10);
        distHDeltas.push((distHs[2] - distHs[3]) / 10);

        var halfWidths = [];
        var twidth = compInfoReducer.mobileInfoData[i].mbHalfWidth;
        halfWidths.push(twidth * 2);
        halfWidths.push(twidth);
        halfWidths.push(twidth / 2);
        halfWidths.push(twidth / 4);

        var halfHeights = [];
        var theight = compInfoReducer.mobileInfoData[i].mbHalfHeight;
        halfHeights.push(theight * 2);
        halfHeights.push(theight);
        halfHeights.push(theight / 2);
        halfHeights.push(theight / 4);

        var deviceInfo = {
          seq: compInfoReducer.mobileInfoData[i].mbSeq,
          os: compInfoReducer.mobileInfoData[i].mbOs,
          halfWidths: halfWidths,
          halfHeights: halfHeights,
          distWs: distWs,
          distHs: distHs,
          distWDeltas: distWDeltas,
          distHDeltas: distHDeltas,
          baseZoom: compInfoReducer.mobileInfoData[i].mbBaseZoom,
        };
        baseMapSetInfo.baseMapInfos.push(deviceInfo);
      }
    }
  }, [compInfoReducer]);

  // 저장 관련 리덕스 처리
  useEffect(() => {
    if (saveActInfo === CD_SAVE) {
      holeDrawInfo.action = CD_SAVE;
      mapInfo.zoomW = mapInfo.zoomBuf;
      apiUpdHoleInfo();
    } else if (saveActInfo === CD_CANCLE) {
      if (uiCtrl.pointType === CD_COURSE) {
        crsDrawInfo.drawingFlagC = false;
        crsDrawInfo.isModBox = false;

        initDrawCrs();
      } else if (uiCtrl.pointType === CD_HOLE) {
        holeDrawInfo.drawingFlagH = false;
        holeDrawInfo.isModBox = false;

        initDrawHole();

        if (map) map.setCursor("default");
      } else if (uiCtrl.pointType === CD_PIN) {
        initDrawPin();
      } else if (uiCtrl.pointType === CD_TEE) {
        holeDrawInfo.drawingFlagT = false;

        initDrawTees();
      } else if (uiCtrl.pointType === CD_IP) {
        holeDrawInfo.drawingFlagI = false;
        holeDrawInfo.isModifyIp = false;

        initDrawIps();
      } else if (uiCtrl.pointType === CD_DOT) {
        initDrawDots();
      } else if (uiCtrl.pointType === CD_AREA) {
        holeDrawInfo.drawingFlagA = false;
        holeDrawInfo.isModifyArea = false;
        holeDrawInfo.isCloseArea = false;

        initDrawAreas();
      }
    }
    if (saveActInfo === CD_SAVE || saveActInfo === CD_SAVE) {
      dispatch(btnModalRedux(""));
    }
  }, [saveActInfo]);

  // 키워드로 골프장 찾기 리덕스 처리
  useEffect(() => {
    if (!isEmpty(keyword) && keyword !== "") {
      const ps = new window.kakao.maps.services.Places();
      ps.keywordSearch(keyword, placesSearchCB);
    }

    function placesSearchCB(data, status, pagination) {
      if (status === window.kakao.maps.services.Status.OK) {
        let bounds = new window.kakao.maps.LatLngBounds();
        if (data.length > 0) {
          bounds.extend(new window.kakao.maps.LatLng(data[0].y, data[0].x));
        }
        // for (let i = 0; i < data.length; i++) {
        //   bounds.extend(new window.kakao.maps.LatLng(data[i].y, data[i].x));
        // }

        map.setBounds(bounds);

        var latlng = map.getCenter();
        mapInfo.lat = latlng.getLat();
        mapInfo.lng = latlng.getLng();

        if (map) {
          map.setCenter(new kakao.maps.LatLng(mapInfo.lat, mapInfo.lng));

          crsDrawInfo.drawingFlagC = false;
          crsDrawInfo.isModBox = false;
        }
      }
    }
  }, [keyword]);

  // 코스 및 홀에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawAll() {
    initDrawCrs();
    initDrawHole();
    initDrawPin();
    initDrawTees();
    initDrawIps();
    initDrawDots();
    initDrawAreas();
  }

  // 코스 영역에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawCrs() {
    if (crsDrawInfo.gbRect !== null) {
      crsDrawInfo.gbRect.setMap(null);
      crsDrawInfo.gbRect = null;
    }

    for (let i = 0; i < crsDrawInfo.gbScRectPts.length; i++) {
      if (crsDrawInfo.gbScRectPts[i] !== null) {
        crsDrawInfo.gbScRectPts[i].setMap(null);
        crsDrawInfo.gbScRectPts[i] = null;
      }
    }

    if (crsDrawInfo.gbCentCirPt !== null) {
      crsDrawInfo.gbCentCirPt.setMap(null);
      crsDrawInfo.gbCentCirPt = null;
    }

    for (let i = 0; i < crsDrawInfo.gbDirTexts.length; i++) {
      if (crsDrawInfo.gbDirTexts[i] !== null) {
        crsDrawInfo.gbDirTexts[i].setMap(null);
        crsDrawInfo.gbDirTexts[i] = null;
      }
    }
  }

  // 홀 영역에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawHole() {
    if (holeDrawInfo.gbRect !== null) {
      holeDrawInfo.gbRect.setMap(null);
      holeDrawInfo.gbRect = null;
    }

    for (let i = 0; i < holeDrawInfo.gbScRectPts.length; i++) {
      if (holeDrawInfo.gbScRectPts[i] !== null) {
        holeDrawInfo.gbScRectPts[i].setMap(null);
        holeDrawInfo.gbScRectPts[i] = null;
      }
    }

    if (holeDrawInfo.gbCentCirPt !== null) {
      holeDrawInfo.gbCentCirPt.setMap(null);
      holeDrawInfo.gbCentCirPt = null;
    }

    for (let i = 0; i < holeDrawInfo.gbDirTexts.length; i++) {
      if (holeDrawInfo.gbDirTexts[i] !== null) {
        holeDrawInfo.gbDirTexts[i].setMap(null);
        holeDrawInfo.gbDirTexts[i] = null;
      }
    }
  }

  // 핀정보에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawPin() {
    if (holeDrawInfo.pinCirPt !== null) {
      holeDrawInfo.pinCirPt.setMap(null);
      holeDrawInfo.pinCirPt = null;
    }
  }

  // 티정보에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawTees() {
    for (let i = 0; i < holeDrawInfo.teeCirPts.length; i++) {
      if (holeDrawInfo.teeCirPts[i] !== null) {
        holeDrawInfo.teeCirPts[i].setMap(null);
        holeDrawInfo.teeCirPts[i] = null;
      }
    }
    holeDrawInfo.teeCirPts = [];
  }

  // 아이피정보에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawIps() {
    for (let i = 0; i < holeDrawInfo.ipCirPts.length; i++) {
      if (holeDrawInfo.ipCirPts[i] !== null) {
        holeDrawInfo.ipCirPts[i].setMap(null);
        holeDrawInfo.ipCirPts[i] = null;
      }
    }

    if (holeDrawInfo.ipPls !== null) {
      holeDrawInfo.ipPls.setMap(null);
      holeDrawInfo.ipPls = null;
    }

    for (let i = 0; i < holeDrawInfo.ipDistTexts.length; i++) {
      if (holeDrawInfo.ipDistTexts[i] !== null) {
        holeDrawInfo.ipDistTexts[i].setMap(null);
        holeDrawInfo.ipDistTexts[i] = null;
      }
    }
  }

  // 닷정보에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawDots() {
    for (let i = 0; i < holeDrawInfo.dotCirPts.length; i++) {
      if (holeDrawInfo.dotCirPts[i] !== null) {
        holeDrawInfo.dotCirPts[i].setMap(null);
        holeDrawInfo.dotCirPts[i] = null;
      }
    }
  }

  // 홀 인식 영역에 대한 카카오맵 구성 요소를 초기화 함
  function initDrawAreas() {
    for (let i = 0; i < holeDrawInfo.areaCirPts.length; i++) {
      if (holeDrawInfo.areaCirPts[i] !== null) {
        holeDrawInfo.areaCirPts[i].setMap(null);
        holeDrawInfo.areaCirPts[i] = null;
      }
    }

    holeDrawInfo.areaCirPts = [];

    if (holeDrawInfo.areaPls !== null) {
      holeDrawInfo.areaPls.setMap(null);
      holeDrawInfo.areaPls = null;
    }

    if (holeDrawInfo.areaPolys !== null) {
      holeDrawInfo.areaPolys.setMap(null);
      holeDrawInfo.areaPolys = null;
    }

    for (let i = 0; i < holeDrawInfo.areaGuidePolys.length; i++) {
      if (holeDrawInfo.areaGuidePolys[i] !== null) {
        holeDrawInfo.areaGuidePolys[i].setMap(null);
        holeDrawInfo.areaGuidePolys[i] = null;
      }
    }

    holeDrawInfo.areaGuidePolys = [];
  }

  function makeClickArea(curPos, scalePtSize) {
    var mbr = [];
    mbr.push(new window.kakao.maps.LatLng(curPos.getLat() + scalePtSize, curPos.getLng() - scalePtSize));
    mbr.push(new window.kakao.maps.LatLng(curPos.getLat() + scalePtSize, curPos.getLng() + scalePtSize));
    mbr.push(new window.kakao.maps.LatLng(curPos.getLat() - scalePtSize, curPos.getLng() + scalePtSize));
    mbr.push(new window.kakao.maps.LatLng(curPos.getLat() - scalePtSize, curPos.getLng() - scalePtSize));

    return mbr;
  }

  // 마우스 액션 시 드레그 아닌 상태일때 마우스 아이콘등 처리
  function setNotDrag(type, movePos) {
    var drawInfo;
    if (type === CD_COURSE) {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    if ((type === CD_COURSE || type === CD_HOLE) && drawInfo.gbRect !== null) {
      var isScalePt = true;
      drawInfo.idxDragBox = 99;

      drawInfo.gbRect.setOptions({ fillOpacity: 0.0 });

      for (let i = 0; i < drawInfo.gbScRectGeos.length; i++) {
        drawInfo.gbScRectPts[i].setOptions({
          strokeColor: "#000000",
          fillColor: "#000000",
          fillOpacity: 0.0,
        });
      }

      for (let i = 0; i < drawInfo.gbScRectGeos.length; i++) {
        if (pointInPolygon(drawInfo.gbScRectGeos[i], movePos)) {
          drawInfo.idxDragBox = i;
          isScalePt = false;

          drawInfo.gbCentCirPt.setOptions({
            strokeColor: "#0000FF",
          });

          drawInfo.gbScRectPts[i].setOptions({
            strokeColor: "#0000FF",
            fillColor: "#0000FF",
            fillOpacity: 0.6,
          });

          drawInfo.gbRect.setOptions({
            strokeColor: "#000000",
          });

          break;
        }
      }

      if (isScalePt) {
        if (pointInPolygon(drawInfo.gbGeos, movePos)) {
          drawInfo.idxDragBox = MOVE_BOX;

          drawInfo.gbRect.setOptions({
            strokeColor: "#FF0000",
            fillColor: "#FF0000",
            fillOpacity: 0.2,
          });

          drawInfo.gbCentCirPt.setOptions({
            strokeColor: "#FF0000",
          });

          for (let i = 0; i < drawInfo.gbScRectGeos.length; i++) {
            drawInfo.gbScRectPts[i].setOptions({ strokeColor: "#000000" });
          }
        } else if (!pointInPolygon(drawInfo.gbGeos, movePos)) {
          if (type === CD_HOLE) {
            drawInfo.idxDragBox = ROTATE_BOX;

            drawInfo.gbRect.setOptions({
              strokeColor: "#00FF00",
              fillColor: "#00FF00",
              fillOpacity: 0.2,
            });

            drawInfo.gbCentCirPt.setOptions({
              strokeColor: "#00FF00",
            });

            for (let i = 0; i < drawInfo.gbScRectGeos.length; i++) {
              drawInfo.gbScRectPts[i].setOptions({ strokeColor: "#000000" });
            }
          } else {
            drawInfo.idxDragBox = 99;
          }
        }
      }

      if (type === CD_COURSE) {
        if (drawInfo.idxDragBox >= SCALE_IDX_LT && drawInfo.idxDragBox <= SCALE_IDX_RB) {
          map.setCursor("url(http://3.39.65.102:8081/upload/scale_side_16.png) 8 8, default");
        } else if (drawInfo.idxDragBox === MOVE_BOX) {
          map.setCursor("url(http://3.39.65.102:8081/upload/move_16.png) 8 8, default");
        } else {
          map.setCursor("default");
        }
      } else if (type === CD_HOLE) {
        if (drawInfo.idxDragBox >= SCALE_IDX_LT && drawInfo.idxDragBox <= SCALE_IDX_RB) {
          map.setCursor("url(http://3.39.65.102:8081/upload/scale_side_16.png) 8 8, default");
        } else if (drawInfo.idxDragBox === MOVE_BOX) {
          map.setCursor("url(http://3.39.65.102:8081/upload/move_16.png) 8 8, default");
        } else if (drawInfo.idxDragBox === ROTATE_BOX) {
          map.setCursor("url(http://3.39.65.102:8081/upload/rotate_16.png) 8 8, default");
        } else {
          map.setCursor("default");
        }
      }
    } else if (type === CD_IP) {
      drawInfo.idxDragIp = 99;

      drawInfo.ipPls.setOptions({
        strokeColor: "#00a0e9",
      });

      const len = drawInfo.ipCirPts.length;
      for (let i = 0; i < len; i++) {
        drawInfo.ipCirPts[i].setOptions({
          strokeColor: "#000000",
          fillColor: "#00FFFF",
          fillOpacity: 1,
        });
      }

      for (let i = 0; i < drawInfo.ipRectGeos.length; i++) {
        if (pointInPolygon(drawInfo.ipRectGeos[i], movePos)) {
          drawInfo.idxDragIp = i;

          drawInfo.ipPls.setOptions({
            strokeColor: "#FF0000",
          });

          const len = drawInfo.ipCirPts.length;
          if (len > drawInfo.idxDragIp) {
            drawInfo.ipCirPts[drawInfo.idxDragIp].setOptions({
              strokeColor: "#000000",
              fillColor: "#FF0000",
              fillOpacity: 1,
            });
          }

          break;
        }
      }

      if (drawInfo.idxDragIp !== 99) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    } else if (type === CD_AREA) {
      drawInfo.idxDragArea = 99;

      if (drawInfo.areaPolys != null) {
        drawInfo.areaPolys.setOptions({
          strokeColor: "#FFCF29",
        });
      } else if (drawInfo.areaPls != null) {
        drawInfo.areaPls.setOptions({
          strokeColor: "#FFCF29",
        });
      }

      const len = drawInfo.areaCirPts.length;
      for (let i = 0; i < len; i++) {
        drawInfo.areaCirPts[i].setOptions({
          strokeColor: "#000000",
          fillColor: "#F5BA5E",
          fillOpacity: 1,
        });
      }

      for (let i = 0; i < drawInfo.areaRectGeos.length; i++) {
        if (pointInPolygon(drawInfo.areaRectGeos[i].area, movePos)) {
          drawInfo.idxDragArea = i;

          drawInfo.areaPolys.setOptions({
            strokeColor: "#FF0000",
          });

          const len = drawInfo.areaCirPts.length;
          if (len > drawInfo.idxDragArea) {
            drawInfo.areaCirPts[drawInfo.idxDragArea].setOptions({
              strokeColor: "#000000",
              fillColor: "#FF0000",
              fillOpacity: 1,
            });
          }

          break;
        }
      }

      if (drawInfo.idxDragArea !== 99) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    }
  }

  // 마우스 액션 시 드레그 상태일때 마우스 아이콘등 처리
  function setIsDrag(type) {
    var drawInfo;
    if (type === CD_COURSE) {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    if (type === CD_COURSE) {
      if (drawInfo.idxDragBox >= SCALE_IDX_LT && drawInfo.idxDragBox <= SCALE_IDX_RB) {
        map.setCursor("url(http://3.39.65.102:8081/upload/scale_side_c_16.png) 8 8, default");
      } else if (drawInfo.idxDragBox === MOVE_BOX) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_c_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    } else if (type === CD_HOLE) {
      if (drawInfo.idxDragBox >= SCALE_IDX_LT && drawInfo.idxDragBox <= SCALE_IDX_RB) {
        map.setCursor("url(http://3.39.65.102:8081/upload/scale_side_c_16.png) 8 8, default");
      } else if (drawInfo.idxDragBox === MOVE_BOX) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_c_16.png) 8 8, default");
      } else if (drawInfo.idxDragBox === ROTATE_BOX) {
        map.setCursor("url(http://3.39.65.102:8081/upload/rotate_c_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    } else if (type === CD_IP) {
      drawInfo.ipPls.setOptions({
        strokeColor: "#00a0e9",
      });

      const len = drawInfo.ipCirPts.length;
      if (len > 0) {
        drawInfo.ipCirPts[drawInfo.idxDragIp].setOptions({
          strokeColor: "#000000",
          fillColor: "#00FFFF",
          fillOpacity: 1,
        });
      }

      if (drawInfo.idxDragIp !== 99) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_c_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    } else if (type === CD_AREA) {
      if (drawInfo.areaPolys != null) {
        drawInfo.areaPolys.setOptions({
          strokeColor: "#00a0e9",
        });
      } else {
        drawInfo.areaPls.setOptions({
          strokeColor: "#00a0e9",
        });
      }

      const len = drawInfo.areaCirPts.length;
      if (len > 0) {
        drawInfo.areaCirPts[drawInfo.idxDragArea].setOptions({
          strokeColor: "#000000",
          fillColor: "#00FFFF",
          fillOpacity: 1,
        });
      }

      if (drawInfo.idxDragArea !== 99) {
        map.setCursor("url(http://3.39.65.102:8081/upload/move_c_16.png) 8 8, default");
      } else {
        map.setCursor("default");
      }
    }
  }

  // 홀 인식 영역에 폴리곤 클로우즈(첫 시작점 연경) 시 마우스 아이콘등 처리
  function setAreaCloseDrag(movePos) {
    var drawInfo = holeDrawInfo;

    if (drawInfo.areaRectGeos.length >= 3 && pointInPolygon(drawInfo.areaRectGeos[0].area, movePos)) {
      map.setCursor("url(http://3.39.65.102:8081/upload/conn_16.png) 8 8, default");
    } else {
      map.setCursor("default");
    }
  }

  function setAreaAddDelDrag(movePos) {
    var drawInfo = holeDrawInfo;

    drawInfo.idxDragArea = 99;

    var isAdd = true;
    for (let i = 0; i < drawInfo.areaRectGeos.length; i++) {
      if (pointInPolygon(drawInfo.areaRectGeos[i].area, movePos)) {
        drawInfo.idxDragArea = i;
        uiCtrl.areaPtType = DRAW_AREA_TYPE_DEL;

        map.setCursor("url(http://3.39.65.102:8081/upload/subtract_16.png) 8 8, default");
        isAdd = false;
        break;
      }
    }

    if (isAdd) {
      const addLen = holeDrawInfo.areaLineRectGeos.length;
      for (let i = 0; i < addLen; i++) {
        if (pointInPolygon(drawInfo.areaLineRectGeos[i].area, movePos)) {
          drawInfo.idxDragArea = i;
          uiCtrl.areaPtType = DRAW_AREA_TYPE_ADD;

          map.setCursor("url(http://3.39.65.102:8081/upload/plus_16.png) 8 8, default");
          break;
        }
      }
    }

    if (drawInfo.idxDragArea === 99) {
      uiCtrl.areaPtType = DRAW_AREA_TYPE_NONE;

      map.setCursor("default");
    }
  }

  // 핸드폰 가이드 박스 비율로 리스케일
  function setGbReversRectPts(centGeo, zoom, rotate) {
    var rectGeos = rectZoomToScale(centGeo, zoom);
    var rectCoords = [];

    for (let i = 0; i < rectGeos.length; i++) {
      var coord = calcGeoPosOnImage(mapMbr, rectGeos[i], mapGeoSize, mapViewSize);
      rectCoords.push(coord);
    }

    var centCoord = calcGeoPosOnImage(mapMbr, centGeo, mapGeoSize, mapViewSize);
    const retData = rectDegToRot(rectCoords, centCoord, rotate);
    holeDrawInfo.gbCoords = retData.coords;

    holeDrawInfo.gbGeos = [];
    for (let i = 0; i < holeDrawInfo.gbCoords.length; i++) {
      const geo = calcGeoPosOnTouch(
        mapMbr,
        holeDrawInfo.gbCoords[i].x,
        holeDrawInfo.gbCoords[i].y,
        mapGeoSize,
        mapViewSize
      );

      holeDrawInfo.gbGeos.push(new window.kakao.maps.LatLng(geo.lat, geo.lng));
    }

    if (holeDrawInfo.gbGeos.length === 4 && holeInfo.centerGeoY !== 0 && holeInfo.centerGeoX !== 0) {
      mapInfo.hole.geos = convLatLngs2Geos(holeDrawInfo.gbGeos);
    }
  }

  // 홀영역가지고 역으로 줌 레벨 추출
  function setCalcZoomN(rectMbr) {
    var retZoom = 16.0;

    var zoomDistH = calDist(
      { lat: rectMbr[0].getLat(), lng: rectMbr[0].getLng() },
      { lat: rectMbr[3].getLat(), lng: rectMbr[3].getLng() }
    );
    const idxBm = baseMapSetInfo.idxBaseMap;
    const mapBaseInfo = baseMapSetInfo.baseMapInfos[idxBm];

    if (zoomDistH > mapBaseInfo.distHs[0]) {
      retZoom = 14.5;
    } else if (mapBaseInfo.distHs[0] >= zoomDistH && zoomDistH > mapBaseInfo.distHs[1]) {
      const offVal = ((zoomDistH - mapBaseInfo.distHs[1]) / mapBaseInfo.distHDeltas[0]) * 0.1;
      retZoom = 16 - Number(offVal.toFixed(1));
    } else if (mapBaseInfo.distHs[1] >= zoomDistH && zoomDistH > mapBaseInfo.distHs[2]) {
      const offVal = ((zoomDistH - mapBaseInfo.distHs[2]) / mapBaseInfo.distHDeltas[1]) * 0.1;
      retZoom = 17 - Number(offVal.toFixed(1));
    } else if (mapBaseInfo.distHs[2] >= zoomDistH && zoomDistH > mapBaseInfo.distHs[3]) {
      const offVal = ((zoomDistH - mapBaseInfo.distHs[3]) / mapBaseInfo.distHDeltas[2]) * 0.1;
      retZoom = 18 - Number(offVal.toFixed(1));
    } else {
      retZoom = 18.5;
    }

    return retZoom;
  }

  function rectZoomToScale(centGeo, zoom) {
    const idxBm = baseMapSetInfo.idxBaseMap;
    const mapBaseInfo = baseMapSetInfo.baseMapInfos[idxBm];

    var deltaDist = {
      x: 0,
      y: 0,
    };

    if (zoom <= 18 && zoom > 17) {
      deltaDist.x = mapBaseInfo.halfWidths[3] + (mapBaseInfo.halfWidths[2] - mapBaseInfo.halfWidths[1]) * (18 - zoom);
      deltaDist.y =
        mapBaseInfo.halfHeights[3] + (mapBaseInfo.halfHeights[2] - mapBaseInfo.halfHeights[1]) * (18 - zoom);
    } else if (zoom <= 17 && zoom > 16) {
      deltaDist.x = mapBaseInfo.halfWidths[2] + (mapBaseInfo.halfWidths[1] - mapBaseInfo.halfWidths[2]) * (17 - zoom);
      deltaDist.y =
        mapBaseInfo.halfHeights[2] + (mapBaseInfo.halfHeights[1] - mapBaseInfo.halfHeights[2]) * (17 - zoom);
    } else if (zoom <= 16 && zoom > 15) {
      deltaDist.x = mapBaseInfo.halfWidths[1] + (mapBaseInfo.halfWidths[0] - mapBaseInfo.halfWidths[1]) * (16 - zoom);
      deltaDist.y =
        mapBaseInfo.halfHeights[1] + (mapBaseInfo.halfHeights[0] - mapBaseInfo.halfHeights[1]) * (16 - zoom);
    }

    var rectGeos = [];

    rectGeos.push(new window.kakao.maps.LatLng(centGeo.getLat() + deltaDist.y, centGeo.getLng() - deltaDist.x));
    rectGeos.push(new window.kakao.maps.LatLng(centGeo.getLat() + deltaDist.y, centGeo.getLng() + deltaDist.x));
    rectGeos.push(new window.kakao.maps.LatLng(centGeo.getLat() - deltaDist.y, centGeo.getLng() + deltaDist.x));
    rectGeos.push(new window.kakao.maps.LatLng(centGeo.getLat() - deltaDist.y, centGeo.getLng() - deltaDist.x));

    return rectGeos;
  }

  // 사각 영역 그리기
  function setDrawRect(type) {
    var drawInfo;
    if (type === CD_COURSE) {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    drawInfo.gbRect = new window.kakao.maps.Polygon({
      map: map,
      path: drawInfo.gbGeos,
      strokeWeight: 1.5,
      strokeColor: "#FF0000",
      strokeOpacity: 1,
      strokeStyle: "solid",
      fillColor: "#FF0000",
      fillOpacity: 0.0,
    });

    setGbDirTexts(type, drawInfo.gbGeos, false);
    setGbRectPts(type, drawInfo.gbGeos, true, false);
    setGbCentPt(type, drawInfo.gbCentGeo, false);

    map.setCursor("url(http://3.39.65.102:8081/upload/move_16.png) 8, 8, default");
  }

  // 사각 영역에 중점 표시
  function setGbRectPts(type, srcGeos, isView, isMod) {
    var drawInfo;
    var scalePtSize = 0.00005;
    const zoom = map.getLevel();
    if (zoom != 2) {
      scalePtSize = GB_SCALE_POINT_SIZE * (zoom - 2);
    }

    if (type === CD_COURSE) {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    for (let i = 0; i < 8; i++) {
      var geos = [];

      if (i == SCALE_IDX_LT || i == SCALE_IDX_RT || i == SCALE_IDX_LB || i == SCALE_IDX_RB) {
        var idx = 0;
        if (i == SCALE_IDX_LT) {
          idx = 0;
        } else if (i == SCALE_IDX_RT) {
          idx = 1;
        } else if (i == SCALE_IDX_LB) {
          idx = 3;
        } else if (i == SCALE_IDX_RB) {
          idx = 2;
        }

        geos.push(
          new window.kakao.maps.LatLng(srcGeos[idx].getLat() + scalePtSize, srcGeos[idx].getLng() - scalePtSize)
        );
        geos.push(
          new window.kakao.maps.LatLng(srcGeos[idx].getLat() + scalePtSize, srcGeos[idx].getLng() + scalePtSize)
        );
        geos.push(
          new window.kakao.maps.LatLng(srcGeos[idx].getLat() - scalePtSize, srcGeos[idx].getLng() + scalePtSize)
        );
        geos.push(
          new window.kakao.maps.LatLng(srcGeos[idx].getLat() - scalePtSize, srcGeos[idx].getLng() - scalePtSize)
        );
      } else if (i == SCALE_IDX_MT || i == SCALE_IDX_LM || i == SCALE_IDX_RM || i == SCALE_IDX_MB) {
        var centP: { lat: number; lng: number } = { lat: 0, lng: 0 };
        if (i == SCALE_IDX_MT) {
          centP = centLine(srcGeos[0], srcGeos[1]);
        } else if (i == SCALE_IDX_LM) {
          centP = centLine(srcGeos[0], srcGeos[3]);
        } else if (i == SCALE_IDX_RM) {
          centP = centLine(srcGeos[1], srcGeos[2]);
        } else if (i == SCALE_IDX_MB) {
          centP = centLine(srcGeos[2], srcGeos[3]);
        }

        geos.push(new window.kakao.maps.LatLng(centP.lat + scalePtSize, centP.lng - scalePtSize));
        geos.push(new window.kakao.maps.LatLng(centP.lat + scalePtSize, centP.lng + scalePtSize));
        geos.push(new window.kakao.maps.LatLng(centP.lat - scalePtSize, centP.lng + scalePtSize));
        geos.push(new window.kakao.maps.LatLng(centP.lat - scalePtSize, centP.lng - scalePtSize));
      }

      drawInfo.gbScRectGeos[i] = geos;

      if (isView) {
        var rectBounds = new kakao.maps.LatLngBounds(geos[LB], geos[RT]);

        if (isMod) {
          drawInfo.gbScRectPts[i].setBounds(rectBounds);
        } else {
          drawInfo.gbScRectPts[i] = new window.kakao.maps.Rectangle({
            map: map,
            bounds: rectBounds,
            strokeWeight: 2,
            strokeColor: "#999999",
            strokeOpacity: 1,
            fillColor: "#999999",
            fillOpacity: 0.0,
          });
        }
      }
    }
  }

  // 사각 영역 컨트롤 포인트에 컨트롤 영역 처리
  function setGbCentPt(type, srcGeo, isMod) {
    var radius = 4;
    const zoom = map.getLevel();
    radius = radius * (zoom - 2);
    var drawInfo;
    if (type === "C") {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    if (isMod) {
      drawInfo.gbCentCirPt.setOptions({
        center: srcGeo,
      });
    } else {
      drawInfo.gbCentCirPt = new window.kakao.maps.Circle({
        center: srcGeo,
        radius: radius,
        strokeWeight: 2,
        strokeColor: "#FF0000",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#FF0000",
        fillOpacity: 0.0,
      });

      drawInfo.gbCentCirPt.setMap(map);
    }
  }

  // 사각 영역 컨트롤 포인트에 방향성 표시
  function setGbDirTexts(type, srcGeos, isMod) {
    var drawInfo;
    if (type === "C") {
      drawInfo = crsDrawInfo;
    } else {
      drawInfo = holeDrawInfo;
    }

    if (isMod) {
      for (let i = 0; i < srcGeos.length; i++) {
        drawInfo.gbDirTexts[i].setPosition(srcGeos[i]);
      }
    } else {
      let dirComments = ["TL", "TR", "BR", "BL"];
      let xAnchors = [1.2, -0.2, -0.2, 1.2];
      let yAnchors = [0.5, 0.5, 0.5, 0.5];

      for (let i = 0; i < drawInfo.gbGeos.length; i++) {
        var content = '<div class="info">' + dirComments[i] + "</div>";
        drawInfo.gbDirTexts[i] = new window.kakao.maps.CustomOverlay({
          map: map,
          content: content,
          xAnchor: xAnchors[i],
          yAnchor: yAnchors[i],
          position: drawInfo.gbGeos[i],
        });
      }
    }
  }

  // 핀 그리기
  function setDrawPin() {
    if (holeDrawInfo.pinGeo != null) {
      holeDrawInfo.pinCirPt = new window.kakao.maps.Circle({
        map: map,
        center: holeDrawInfo.pinGeo,
        radius: mapInfo.zoomBuf,
        strokeWeight: 1,
        strokeColor: "#FF0000",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#FFFFFF",
        fillOpacity: 1,
      });
    }
  }

  // 티 그리기
  function setDrawTee() {
    holeDrawInfo.teeCirPts = [];

    for (let i = 0; i < holeDrawInfo.teeInfos.length; i++) {
      const cir = new window.kakao.maps.Circle({
        map: map,
        center: new window.kakao.maps.LatLng(holeDrawInfo.teeInfos[i].geo.lat, holeDrawInfo.teeInfos[i].geo.lng),
        radius: mapInfo.zoomBuf,
        strokeWeight: 1,
        strokeColor: "#333333",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: holeDrawInfo.teeInfos[i].clr,
        fillOpacity: 1,
      });

      holeDrawInfo.teeCirPts.push(cir);
    }
  }

  // 아이피 그리기
  function setDrawIp() {
    holeDrawInfo.ipCirPts = [];
    holeDrawInfo.ipDistTexts = [];

    var paths = [];
    const len = holeDrawInfo.ipGeos.length;

    for (let i = 0; i < len; i++) {
      paths.push(holeDrawInfo.ipGeos[i]);
    }

    holeDrawInfo.ipPls = new window.kakao.maps.Polyline({
      map: map,
      path: paths,
      strokeWeight: 1,
      strokeColor: "#00a0e9",
      strokeOpacity: 1,
      strokeStyle: "solid",
    });

    for (let i = 0; i < len; i++) {
      if (i > 0) {
        var ipCir = new window.kakao.maps.Circle({
          map: map,
          center: holeDrawInfo.ipGeos[i],
          radius: mapInfo.zoomBuf,
          strokeWeight: 1,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#00FFFF",
          fillOpacity: 1,
        });
        holeDrawInfo.ipCirPts.push(ipCir);

        var dist = calDist(convLatLng2Geo(holeDrawInfo.ipGeos[i - 1]), convLatLng2Geo(holeDrawInfo.ipGeos[i]));
        const distTxt = new window.kakao.maps.CustomOverlay({
          map: map,
          content: Math.round(dist) + " m",
          xAnchor: 1.2,
          yAnchor: 0.5,
          position: holeDrawInfo.ipGeos[i],
        });

        holeDrawInfo.ipDistTexts.push(distTxt);
      }
    }
  }

  // 닷 그리기
  function setDrawDot() {
    holeDrawInfo.dotCirPts = [];

    for (let i = 0; i < holeDrawInfo.dotInfos.length; i++) {
      const cir = new window.kakao.maps.Circle({
        map: map,
        center: new window.kakao.maps.LatLng(holeDrawInfo.dotInfos[i].geo.lat, holeDrawInfo.dotInfos[i].geo.lng),
        radius: mapInfo.zoomBuf,
        strokeWeight: 1,
        strokeColor: "#333333",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#FF00FF",
        fillOpacity: 1,
      });

      holeDrawInfo.dotCirPts.push(cir);
    }
  }

  // 홀 인식 영역 그리기
  function setDrawArea(type, curPos, scalePtSize) {
    if (type === DRAW_AREA_TYPE_ALL) {
      holeDrawInfo.areaCirPts = [];

      var paths = [];
      const len = holeDrawInfo.areaGeos.length;
      for (let i = 0; i < len; i++) {
        paths.push(holeDrawInfo.areaGeos[i].pos);
      }

      if ((holeDrawInfo.isCloseArea === true || holeDrawInfo.areaPolys != null) && len >= 3) {
        holeDrawInfo.areaPolys = new window.kakao.maps.Polygon({
          map: map,
          path: paths,
          strokeWeight: 1,
          strokeColor: "#00a0e9",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#000000",
          fillOpacity: 0.0,
        });
      } else {
        if (len >= 2) {
          holeDrawInfo.areaPls = new window.kakao.maps.Polyline({
            map: map,
            path: paths,
            strokeWeight: 1,
            strokeColor: "#00a0e9",
            strokeOpacity: 1,
            strokeStyle: "solid",
          });
        }
      }

      for (let i = 0; i < len; i++) {
        var areaCir = new window.kakao.maps.Circle({
          map: map,
          center: holeDrawInfo.areaGeos[i].pos,
          radius: mapInfo.zoomBuf,
          strokeWeight: 1,
          strokeColor: "#000000",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#F5BA5E",
          fillOpacity: 1,
        });
        holeDrawInfo.areaCirPts.push(areaCir);
      }
    } else if (type === DRAW_AREA_TYPE_CLOSE) {
      const gLenth = holeDrawInfo.areaGeos.length;
      if (gLenth >= 4) {
        holeDrawInfo.areaGeos.pop();

        var paths = [];
        const len = holeDrawInfo.areaGeos.length;
        for (let i = 0; i < len; i++) {
          paths.push(holeDrawInfo.areaGeos[i].pos);
        }

        holeDrawInfo.areaPolys = new window.kakao.maps.Polygon({
          map: map,
          path: paths,
          strokeWeight: 1,
          strokeColor: "#00a0e9",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#000000",
          fillOpacity: 0.0,
        });

        for (let i = 0; i < len; i++) {
          var areaCir = new window.kakao.maps.Circle({
            map: map,
            center: holeDrawInfo.areaGeos[i].pos,
            radius: mapInfo.zoomBuf,
            strokeWeight: 1,
            strokeColor: "#000000",
            strokeOpacity: 1,
            strokeStyle: "solid",
            fillColor: "#F5BA5E",
            fillOpacity: 1,
          });
          holeDrawInfo.areaCirPts.push(areaCir);
        }

        holeDrawInfo.isModifyArea = false;
        holeDrawInfo.isCloseArea = true;
      }
    } else if (type === DRAW_AREA_TYPE_ADD) {
      const gLenth = holeDrawInfo.areaGeos.length;
      if (gLenth > 3 && holeDrawInfo.idxDragArea !== 99) {
        console.log(">>>>>>>>> idxDragArea : " + holeDrawInfo.idxDragArea);

        var nIdx = 0;
        if (holeDrawInfo.idxDragArea < gLenth - 1) {
          nIdx = holeDrawInfo.idxDragArea + 1;
        }

        const nGeo = newGeoOnLine(
          curPos,
          holeDrawInfo.areaGeos[holeDrawInfo.idxDragArea].pos,
          holeDrawInfo.areaGeos[nIdx].pos
        );

        var curPosIf = {
          sectCd: HOLE_SECT_TEE,
          seq: 0,
          pos: nGeo,
        };
        holeDrawInfo.areaGeos.splice(holeDrawInfo.idxDragArea + 1, 0, curPosIf);

        for (let i = 0; i < holeDrawInfo.areaGeos.length; i++) {
          holeDrawInfo.areaGeos[i].seq = i;
        }

        const areaIf = {
          idx: 0,
          area: makeClickArea(nGeo, scalePtSize),
        };
        holeDrawInfo.areaRectGeos.splice(holeDrawInfo.idxDragArea + 1, 0, areaIf);
        for (let i = 0; i < holeDrawInfo.areaRectGeos.length; i++) {
          holeDrawInfo.areaRectGeos[i].idx = i;
        }

        holeDrawInfo.areaLineRectGeos = [];
        initDrawAreas();
        drawArea();
      }
    } else if (type === DRAW_AREA_TYPE_DEL) {
      const gLenth = holeDrawInfo.areaGeos.length;

      if (gLenth > 3 && holeDrawInfo.idxDragArea !== 99) {
        holeDrawInfo.areaGeos = holeDrawInfo.areaGeos.filter((it) => !(it.seq === holeDrawInfo.idxDragArea));
        for (let i = 0; i < holeDrawInfo.areaGeos.length; i++) {
          holeDrawInfo.areaGeos[i].seq = i;
        }

        holeDrawInfo.areaRectGeos = holeDrawInfo.areaRectGeos.filter((it) => !(it.idx === holeDrawInfo.idxDragArea));
        for (let i = 0; i < holeDrawInfo.areaRectGeos.length; i++) {
          holeDrawInfo.areaRectGeos[i].idx = i;
        }

        holeDrawInfo.areaLineRectGeos = [];
        initDrawAreas();
        drawArea();
      } else {
        holeDrawInfo.drawingFlagA = false;
        holeDrawInfo.idxDragArea = 99;
        holeDrawInfo.isModifyArea = false;
        holeDrawInfo.isCloseArea = false;

        holeDrawInfo.areaGeos = [];
        holeDrawInfo.areaRectGeos = [];
        holeDrawInfo.areaLineRectGeos = [];

        initDrawAreas();
      }
    }

    if (type === DRAW_AREA_TYPE_ALL || type === DRAW_AREA_TYPE_CLOSE) {
      const tLen = holeDrawInfo.areaLineRectGeos.length;
      for (let i = 0; i < tLen; i++) {
        var testPaths = [];
        for (let j = 0; j < 4; j++) {
          testPaths.push(holeDrawInfo.areaLineRectGeos[i].area[j]);
        }

        const areaGuidePoly = new window.kakao.maps.Polygon({
          map: map,
          path: testPaths,
          strokeWeight: 2,
          strokeColor: "#0000FF",
          strokeOpacity: 1,
          strokeStyle: "solid",
          fillColor: "#FF0000",
          fillOpacity: 0.1,
        });

        holeDrawInfo.areaGuidePolys.push(areaGuidePoly);
      }
    }
  }

  function drawArea() {
    var paths = [];

    const len = holeDrawInfo.areaGeos.length;
    for (let i = 0; i < len; i++) {
      paths.push(holeDrawInfo.areaGeos[i].pos);
    }

    holeDrawInfo.areaPolys = new window.kakao.maps.Polygon({
      map: map,
      path: paths,
      strokeWeight: 1,
      strokeColor: "#00a0e9",
      strokeOpacity: 1,
      strokeStyle: "solid",
      fillColor: "#000000",
      fillOpacity: 0.0,
    });

    for (let i = 0; i < len; i++) {
      var areaCir = new window.kakao.maps.Circle({
        map: map,
        center: holeDrawInfo.areaGeos[i].pos,
        radius: mapInfo.zoomBuf,
        strokeWeight: 1,
        strokeColor: "#000000",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#F5BA5E",
        fillOpacity: 1,
      });

      holeDrawInfo.areaCirPts.push(areaCir);
    }

    const aLen = holeDrawInfo.areaGeos.length;
    if (aLen >= 2) {
      for (let i = 0; i < aLen; i++) {
        var endIdx = 0;
        if (i != aLen - 1) {
          endIdx = i + 1;
        }
        const areaSqIf = {
          idx: aLen,
          area: makeLineToRect(GB_COLLIS_LINE_WIDTH, holeDrawInfo.areaGeos[i].pos, holeDrawInfo.areaGeos[endIdx].pos),
        };

        holeDrawInfo.areaLineRectGeos.push(areaSqIf);
      }
    }

    const rLen = holeDrawInfo.areaLineRectGeos.length;
    for (let i = 0; i < rLen; i++) {
      var rPaths = [];
      for (let j = 0; j < 4; j++) {
        rPaths.push(holeDrawInfo.areaLineRectGeos[i].area[j]);
      }

      const areaGuidePoly = new window.kakao.maps.Polygon({
        map: map,
        path: rPaths,
        strokeWeight: 2,
        strokeColor: "#0000FF",
        strokeOpacity: 1,
        strokeStyle: "solid",
        fillColor: "#FF0000",
        fillOpacity: 0.1,
      });

      holeDrawInfo.areaGuidePolys.push(areaGuidePoly);
    }
  }

  // 홀에 맵 구성 정보를 서버에 전송
  function apiUpdHoleInfo() {
    var data = null;

    if (uiCtrl.pointType === CD_COURSE) {
      if (mapInfo.crs.geos.length == 4) {
        data = {
          courData: [
            {
              cgDiv: "",
              coDiv: uiCtrl.coDiv,
              crsCd: uiCtrl.crsCd,
              // crsSeq: crsInfo.crsSeq,
              // crsName: crsInfo.crsName,
              tlLaY: mapInfo.crs.geos[0].lat,
              tlLoX: mapInfo.crs.geos[0].lng,
              trLaY: mapInfo.crs.geos[1].lat,
              trLoX: mapInfo.crs.geos[1].lng,
              brLaY: mapInfo.crs.geos[2].lat,
              brLoX: mapInfo.crs.geos[2].lng,
              blLaY: mapInfo.crs.geos[3].lat,
              blLoX: mapInfo.crs.geos[3].lng,
              centerGeoY: mapInfo.crs.centGeo.lat,
              centerGeoX: mapInfo.crs.centGeo.lng,
              // rotate: 0,
              zoomW: mapInfo.zoomW,
              // zoomN: crsInfo.zoomN,
              // useYn: crsInfo.useYn,
              // updateDatetime: crsInfo.updateDatetime,
            },
          ],
        };
      }
    } else if (uiCtrl.pointType === CD_HOLE) {
      data = madeHoleData();
    } else if (uiCtrl.pointType === CD_PIN) {
      data = madePinData();
    } else if (uiCtrl.pointType === CD_TEE) {
      data = madeTeeData();
    } else if (uiCtrl.pointType === CD_IP) {
      data = madeIpData();
    } else if (uiCtrl.pointType === CD_DOT) {
      data = madeDotData();
    } else if (uiCtrl.pointType === CD_AREA) {
      data = madeAreaData();
    }

    if (data !== null) {
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify(data);
      console.log(">>> apiUpdHoleInfo >>>>>>>>>>>>>>>>>> raw : " + raw);

      var requestOptions: any = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      if (uiCtrl.pointType === CD_COURSE) {
        fetch(`${process.env.WMG_API_URL}gi/upd_crs_info`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);
            mapInfo.lat = mapInfo.crs.centGeo.lat;
            mapInfo.lng = mapInfo.crs.centGeo.lng;
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else if (
        uiCtrl.pointType === CD_HOLE ||
        uiCtrl.pointType === CD_PIN ||
        (uiCtrl.pointType === CD_IP && uiCtrl.par > 3)
      ) {
        fetch(`${process.env.WMG_API_URL}gi/upd_hole_info`, requestOptions)
          .then((response) => response.text())
          .then((result) => {
            console.log(result);

            if (uiCtrl.pointType === CD_HOLE) {
              if (mapInfo.hole.centGeo.lat !== 0 && mapInfo.hole.centGeo.lng !== 0) {
                mapInfo.lat = mapInfo.hole.centGeo.lat;
                mapInfo.lng = mapInfo.hole.centGeo.lng;
              }

              holeDrawInfo.gbGeos = [];
              holeDrawInfo.gbCoords = [];
              holeDrawInfo.gbCentGeo = null;
              holeDrawInfo.gbCentCoord = {};
              holeDrawInfo.gbZoomW = 3;
              holeDrawInfo.gbZoomN = 16.0;
              holeDrawInfo.gbRot = 0.0;

              holeDrawInfo.drawingFlagH = false;
              holeDrawInfo.isModBox = false;

              const holeData: HoleData = madeHoleData();
              const pinData: PinData = madePinData();
              const teeData: any = madeTeeData();
              const ipData: IpData = madeIpData();
              const dotData: any = madeDotData();
              const areaData: any = madeAreaData();

              // console.log(">>> useSelector >>> teeData : " + JSON.stringify(teeData));
              // console.log(">>> useSelector >>> teeData.tees : " + JSON.stringify(teeData.tees));

              // console.log(">>> holeData >>> holeData.holeInfo.cgDiv : " + holeData.holeInfo.cgDiv);
              // console.log(">>> holeData >>> holeData.holeInfo.coDiv : " + holeData.holeInfo.coDiv);
              // console.log(">>> holeData >>> holeData.holeInfo.crsCd : " + holeData.holeInfo.crsCd);
              // console.log(">>> holeData >>> holeData.holeInfo.crsName : " + holeData.holeInfo.crsName);
              // console.log(">>> holeData >>> holeData.holeInfo.holeNo : " + holeData.holeInfo.holeNo);
              // console.log(">>> holeData >>> holeData.holeInfo.holeNoNm : " + holeData.holeInfo.holeNoNm);
              // console.log(">>> holeData >>> holeData.holeInfo.par : " + holeData.holeInfo.par);
              // console.log(">>> holeData >>> holeData.holeInfo.handi : " + holeData.holeInfo.handi);
              // console.log(">>> holeData >>> holeData.holeInfo.tlLaY : " + holeData.holeInfo.tlLaY);
              // console.log(">>> holeData >>> holeData.holeInfo.tlLoX : " + holeData.holeInfo.tlLoX);
              // console.log(">>> holeData >>> holeData.holeInfo.trLaY : " + holeData.holeInfo.trLaY);
              // console.log(">>> holeData >>> holeData.holeInfo.trLoX : " + holeData.holeInfo.trLoX);
              // console.log(">>> holeData >>> holeData.holeInfo.blLaY : " + holeData.holeInfo.blLaY);
              // console.log(">>> holeData >>> holeData.holeInfo.blLoX : " + holeData.holeInfo.blLoX);
              // console.log(">>> holeData >>> holeData.holeInfo.blLoX : " + holeData.holeInfo.blLoX);
              // console.log(">>> holeData >>> holeData.holeInfo.brLoX : " + holeData.holeInfo.brLoX);
              // console.log(">>> holeData >>> holeData.holeInfo.centerGeoY : " + holeData.holeInfo.centerGeoY);
              // console.log(">>> holeData >>> holeData.holeInfo.centerGeoX : " + holeData.holeInfo.centerGeoX);
              // console.log(">>> holeData >>> holeData.holeInfo.rotate : " + holeData.holeInfo.rotate);
              // console.log(">>> holeData >>> holeData.holeInfo.zoomW : " + holeData.holeInfo.zoomW);
              // console.log(">>> holeData >>> holeData.holeInfo.zoomN : " + holeData.holeInfo.zoomN);
              // console.log(">>> holeData >>> pinData.holeInfo.pinGeoY : " + pinData.holeInfo.pinGeoY);
              // console.log(">>> holeData >>> pinData.holeInfo.pinGeoX : " + pinData.holeInfo.pinGeoX);
              // console.log(">>> holeData >>> ipData : " + ipData);
              // console.log(">>> holeData >>> ipData.holeInfo : " + ipData.holeInfo);
              // console.log(">>> holeData >>> ipData.holeInfo.ipZGeoY : " + ipData.holeInfo.ipZGeoY);
              // console.log(">>> holeData >>> ipData.holeInfo.ipZGeoX : " + ipData.holeInfo.ipZGeoX);
              // console.log(">>> holeData >>> ipData.holeInfo.ipFGeoY : " + ipData.holeInfo.ipFGeoY);
              // console.log(">>> holeData >>> ipData.holeInfo.ipFGeoX : " + ipData.holeInfo.ipFGeoX);
              // console.log(">>> holeData >>> ipData.holeInfo.ipSGeoY : " + ipData.holeInfo.ipSGeoY);
              // console.log(">>> holeData >>> ipData.holeInfo.ipSGeoX : " + ipData.holeInfo.ipSGeoX);
              // console.log(">>> holeData >>> holeData.holeInfo.holeExpl : " + holeData.holeInfo.holeExpl);

              if (ipData.holeInfo.ipZGeoY === undefined) ipData.holeInfo.ipZGeoY = 0.0;
              if (ipData.holeInfo.ipZGeoX === undefined) ipData.holeInfo.ipZGeoX = 0.0;
              if (ipData.holeInfo.ipFGeoY === undefined) ipData.holeInfo.ipFGeoY = 0.0;
              if (ipData.holeInfo.ipFGeoX === undefined) ipData.holeInfo.ipFGeoX = 0.0;
              if (ipData.holeInfo.ipSGeoY === undefined) ipData.holeInfo.ipSGeoY = 0.0;
              if (ipData.holeInfo.ipSGeoX === undefined) ipData.holeInfo.ipSGeoX = 0.0;

              var reduxData = {
                cgDiv: holeData.holeInfo.cgDiv,
                coDiv: holeData.holeInfo.coDiv,
                crsCd: holeData.holeInfo.crsCd,
                crsName: holeData.holeInfo.crsName,
                holeNo: holeData.holeInfo.holeNo,
                holeNoNm: holeData.holeInfo.holeNoNm,
                par: holeData.holeInfo.par,
                handi: holeData.holeInfo.handi,
                tlLaY: holeData.holeInfo.tlLaY,
                tlLoX: holeData.holeInfo.tlLoX,
                trLaY: holeData.holeInfo.trLaY,
                trLoX: holeData.holeInfo.trLoX,
                blLaY: holeData.holeInfo.blLaY,
                blLoX: holeData.holeInfo.blLoX,
                brLaY: holeData.holeInfo.brLaY,
                brLoX: holeData.holeInfo.brLoX,
                centerGeoY: holeData.holeInfo.centerGeoY,
                centerGeoX: holeData.holeInfo.centerGeoX,
                rotate: holeData.holeInfo.rotate,
                zoomW: holeData.holeInfo.zoomW,
                zoomN: holeData.holeInfo.zoomN,
                pinGeoY: pinData.holeInfo.pinGeoY,
                pinGeoX: pinData.holeInfo.pinGeoX,
                ipZGeoY: ipData.holeInfo.ipZGeoY,
                ipZGeoX: ipData.holeInfo.ipZGeoX,
                ipFGeoY: ipData.holeInfo.ipFGeoY,
                ipFGeoX: ipData.holeInfo.ipFGeoX,
                ipSGeoY: ipData.holeInfo.ipSGeoY,
                ipSGeoX: ipData.holeInfo.ipSGeoX,
                holeExpl: holeData.holeInfo.holeExpl,
                wmg201s: teeData.tees,
                wmg202s: dotData.dots,
                wmg203s: areaData.areas,
              };

              console.log(">>> useSelector >>> holeData.holeInfo : " + JSON.stringify(reduxData));

              dispatch(holeSelectRedux(reduxData));
            } else if (uiCtrl.pointType === CD_PIN) {
            } else if (uiCtrl.pointType === CD_IP) {
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      } else if (uiCtrl.pointType === CD_TEE || uiCtrl.pointType === CD_DOT || uiCtrl.pointType === CD_AREA) {
        if (holeDrawInfo.action === CD_DELETE) {
          if (uiCtrl.pointType === CD_TEE) {
            fetch(`${process.env.WMG_API_URL}gi/remov_tee_info`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                console.log(result);

                initDrawTees();
                setDrawTee();
              })
              .catch((error) => {
                console.log("error", error);
              });
          } else if (uiCtrl.pointType === CD_DOT) {
            fetch(`${process.env.WMG_API_URL}gi/remov_dot_info`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                console.log(result);

                initDrawDots();
                setDrawDot();
              })
              .catch((error) => {
                console.log("error", error);
              });
          } else if (uiCtrl.pointType === CD_AREA) {
            fetch(`${process.env.WMG_API_URL}gi/remov_area_info`, requestOptions)
              .then((response) => response.text())
              .then((result) => {
                console.log(result);

                initDrawAreas();
                setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
              })
              .catch((error) => {
                console.log("error", error);
              });
          }
        } else {
          fetch(`${process.env.WMG_API_URL}gi/upd_point_info`, requestOptions)
            .then((response) => response.text())
            .then((result) => {
              console.log(result);

              if (uiCtrl.pointType === CD_TEE) {
                dispatch(teeRedux({}));

                initDrawTees();
                setDrawTee();
              } else if (uiCtrl.pointType === CD_DOT) {
                initDrawDots();
                setDrawDot();
              } else if (uiCtrl.pointType === CD_AREA) {
                initDrawAreas();
                setDrawArea(DRAW_AREA_TYPE_ALL, null, null);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      }
    }
  }

  // 홀 데이터 셋팅(api_update)
  function madeHoleData() {
    var _tlLaY = 0.0;
    var _tlLoX = 0.0;
    var _trLaY = 0.0;
    var _trLoX = 0.0;
    var _brLaY = 0.0;
    var _brLoX = 0.0;
    var _blLaY = 0.0;
    var _blLoX = 0.0;

    if (mapInfo.hole.geos.length == 4) {
      _tlLaY = mapInfo.hole.geos[0].lat;
      _tlLoX = mapInfo.hole.geos[0].lng;
      _trLaY = mapInfo.hole.geos[1].lat;
      _trLoX = mapInfo.hole.geos[1].lng;
      _brLaY = mapInfo.hole.geos[2].lat;
      _brLoX = mapInfo.hole.geos[2].lng;
      _blLaY = mapInfo.hole.geos[3].lat;
      _blLoX = mapInfo.hole.geos[3].lng;
    }

    return {
      holeInfo: {
        cgDiv: uiCtrl.cgDiv,
        coDiv: uiCtrl.coDiv,
        crsCd: uiCtrl.crsCd,
        crsName: crsInfo.crsName,
        holeNo: uiCtrl.holeNo,
        holeNoNm: uiCtrl.holeNoNm,
        par: uiCtrl.par,
        handi: uiCtrl.handi,
        tlLaY: _tlLaY,
        tlLoX: _tlLoX,
        trLaY: _trLaY,
        trLoX: _trLoX,
        brLaY: _brLaY,
        brLoX: _brLoX,
        blLaY: _blLaY,
        blLoX: _blLoX,
        centerGeoY: mapInfo.hole.centGeo.lat,
        centerGeoX: mapInfo.hole.centGeo.lng,
        rotate: mapInfo.hole.rot,
        zoomW: mapInfo.zoomW,
        zoomN: mapInfo.hole.zoomN,
        holeExpl: uiCtrl.holeExpl,
      },
    };
  }

  // 핀 데이터 셋팅(api_update)
  function madePinData() {
    var _pinGeoY = 0.0;
    var _pinGeoX = 0.0;

    if (holeDrawInfo.pinGeo != null) {
      _pinGeoY = holeDrawInfo.pinGeo.getLat();
      _pinGeoX = holeDrawInfo.pinGeo.getLng();
    }

    return {
      holeInfo: {
        cgDiv: uiCtrl.cgDiv,
        coDiv: uiCtrl.coDiv,
        crsCd: uiCtrl.crsCd,
        holeNo: uiCtrl.holeNo,
        pinGeoY: _pinGeoY,
        pinGeoX: _pinGeoX,
      },
    };
  }

  // 티 데이터 셋팅(api_update)
  function madeTeeData() {
    if (holeDrawInfo.action === CD_DELETE) {
      return {
        cgDiv: uiCtrl.cgDiv,
        coDiv: uiCtrl.coDiv,
        crsCd: uiCtrl.crsCd,
        holeNo: uiCtrl.holeNo,
        teeSeq: holeDrawInfo.removTeeInfo.seq,
      };
    } else {
      var data = {
        tees: [],
      };

      for (let i = 0; i < holeDrawInfo.teeInfos.length; i++) {
        const tee = {
          cgDiv: uiCtrl.cgDiv,
          coDiv: uiCtrl.coDiv,
          crsCd: uiCtrl.crsCd,
          holeNo: uiCtrl.holeNo,
          teeSeq: holeDrawInfo.teeInfos[i].seq,
          teeCode: holeDrawInfo.teeInfos[i].code,
          teeClr: holeDrawInfo.teeInfos[i].clr,
          teeNm: holeDrawInfo.teeInfos[i].nm,
          teeNmSec: holeDrawInfo.teeInfos[i].nmSec,
          teeGeoY: holeDrawInfo.teeInfos[i].geo.lat,
          teeGeoX: holeDrawInfo.teeInfos[i].geo.lng,
        };
        data.tees.push(tee);
      }

      return data;
    }
  }

  // 아이피 데이터 셋팅(api_update)
  function madeIpData() {
    if (uiCtrl.par > 3) {
      if (
        (uiCtrl.par === 4 && holeDrawInfo.ipGeos.length > 1) ||
        (uiCtrl.par === 5 && holeDrawInfo.ipGeos.length === 2)
      ) {
        return {
          holeInfo: {
            cgDiv: uiCtrl.cgDiv,
            coDiv: uiCtrl.coDiv,
            crsCd: uiCtrl.crsCd,
            holeNo: uiCtrl.holeNo,
            ipZGeoY: holeDrawInfo.ipGeos[0].getLat(),
            ipZGeoX: holeDrawInfo.ipGeos[0].getLng(),
            ipFGeoY: holeDrawInfo.ipGeos[1].getLat(),
            ipFGeoX: holeDrawInfo.ipGeos[1].getLng(),
            ipSGeoY: 0.0,
            ipSGeoX: 0.0,
          },
        };
      } else if (uiCtrl.par === 5 && holeDrawInfo.ipGeos.length > 2) {
        return {
          holeInfo: {
            cgDiv: uiCtrl.cgDiv,
            coDiv: uiCtrl.coDiv,
            crsCd: uiCtrl.crsCd,
            holeNo: uiCtrl.holeNo,
            ipZGeoY: holeDrawInfo.ipGeos[0].getLat(),
            ipZGeoX: holeDrawInfo.ipGeos[0].getLng(),
            ipFGeoY: holeDrawInfo.ipGeos[1].getLat(),
            ipFGeoX: holeDrawInfo.ipGeos[1].getLng(),
            ipSGeoY: holeDrawInfo.ipGeos[2].getLat(),
            ipSGeoX: holeDrawInfo.ipGeos[2].getLng(),
          },
        };
      } else {
        return {
          holeInfo: {
            cgDiv: uiCtrl.cgDiv,
            coDiv: uiCtrl.coDiv,
            crsCd: uiCtrl.crsCd,
            holeNo: uiCtrl.holeNo,
            ipZGeoY: 0.0,
            ipZGeoX: 0.0,
            ipFGeoY: 0.0,
            ipFGeoX: 0.0,
            ipSGeoY: 0.0,
            ipSGeoX: 0.0,
          },
        };
      }
    } else {
      return {
        holeInfo: {
          cgDiv: uiCtrl.cgDiv,
          coDiv: uiCtrl.coDiv,
          crsCd: uiCtrl.crsCd,
          holeNo: uiCtrl.holeNo,
          ipZGeoY: 0.0,
          ipZGeoX: 0.0,
          ipFGeoY: 0.0,
          ipFGeoX: 0.0,
          ipSGeoY: 0.0,
          ipSGeoX: 0.0,
        },
      };
    }
  }

  // 닷 데이터 셋팅(api_update)
  function madeDotData() {
    if (holeDrawInfo.action === CD_DELETE) {
      return {
        cgDiv: uiCtrl.cgDiv,
        coDiv: uiCtrl.coDiv,
        crsCd: uiCtrl.crsCd,
        holeNo: uiCtrl.holeNo,
        dotGp: holeDrawInfo.removDotInfo.gp,
        dotSeq: holeDrawInfo.removDotInfo.seq,
      };
    } else {
      var data = {
        dots: [],
      };

      for (let i = 0; i < holeDrawInfo.dotInfos.length; i++) {
        const dot = {
          cgDiv: uiCtrl.cgDiv,
          coDiv: uiCtrl.coDiv,
          crsCd: uiCtrl.crsCd,
          holeNo: uiCtrl.holeNo,
          dotGp: holeDrawInfo.dotInfos[i].gp,
          dotSeq: holeDrawInfo.dotInfos[i].seq,
          dotGeoY: holeDrawInfo.dotInfos[i].geo.lat,
          dotGeoX: holeDrawInfo.dotInfos[i].geo.lng,
        };
        data.dots.push(dot);
      }
      return data;
    }
  }

  // 홀 인식 데이터 셋팅(api_update)
  function madeAreaData() {
    var data = {
      areas: [],
    };

    for (let i = 0; i < holeDrawInfo.areaGeos.length; i++) {
      const area = {
        cgDiv: uiCtrl.cgDiv,
        coDiv: uiCtrl.coDiv,
        crsCd: uiCtrl.crsCd,
        holeNo: uiCtrl.holeNo,

        areaSectCd: holeDrawInfo.areaGeos[i].sectCd,
        areaSeq: holeDrawInfo.areaGeos[i].seq,
        areaGeoY: holeDrawInfo.areaGeos[i].pos.getLat(),
        areaGeoX: holeDrawInfo.areaGeos[i].pos.getLng(),
      };
      data.areas.push(area);
    }
    return data;
  }

  return <KakaomapComponent ref={kakaoMap} />;

  function isEmpty(obj) {
    for (var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }

    return JSON.stringify(obj) === JSON.stringify({});
  }
};

export default Map;
