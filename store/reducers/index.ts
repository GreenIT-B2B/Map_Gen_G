import { combineReducers } from "redux";
import mapReducer from "./mapReducer";
import newWorkSpace from "./newwsReducer";
import holeReducer from "./holeReducer";
import pinReducer from "./pinReducer";
import teeReducer from "./teeReducer";
import bunkReducer from "./bunkReducer";
import searchReducer from "./searchReducer";
import compInfoReducer from "./compInfoReducer";
import areltReducer from "./areltReducer";
import codivSelectReducer from "./codivSelectReducer";
import holeSelectReducer from "./holeSelectReducer";
import menuSelectReducer from "./menuSelectReducer";
import crsSelectReducer from "./crsSelectReducer";
import btnModalReducer from "./btnModalReducer";
import guideReducer from "./guideReducer";
import teeIsMoReducer from "./teeIsMoReducer";
import bunkIsMoReducer from "./bunkIsMoReducer";
import mapChangeReducer from "./mapChangeReducer";
import inputAlertReducer from "./inputAlertReducer";
import areaReducer from "./areaReducer";

export default combineReducers({
  mapData: mapReducer,
  newWorkSpace: newWorkSpace, // 업장 추가 / 수정
  holeReducer: holeReducer, // 홀 메뉴 팝업 데이터 저장
  pinReducer: pinReducer, // 핀 메뉴 팝업 데이터 저장
  teeReducer: teeReducer, // 티 메뉴 팝업 데이터 저장
  bunkReducer: bunkReducer, // 닷 메뉴 팝업 데이터 저장
  searchReducer: searchReducer, // 키워드 검색
  compInfoReducer: compInfoReducer, // 업장불러오기
  areltReducer: areltReducer, // 알림창
  codivSelectReducer: codivSelectReducer, // 업장 선택
  holeSelectReducer: holeSelectReducer, // 홀 선택  (테스트 : undefined)
  menuSelectReducer: menuSelectReducer, //메뉴 선택
  crsSelectReducer: crsSelectReducer, //코스 선택
  btnModalReducer: btnModalReducer, //취소 저장 버튼  (취소 : C / 저장 : S)
  guideReducer: guideReducer, // 디바이스 저장
  teeIsMoReducer: teeIsMoReducer, // 티 팝업창
  bunkIsMoReducer: bunkIsMoReducer, // 닷 팝업창
  mapChangeReducer: mapChangeReducer, //지도 변경 기본값: L
  inputAlertReducer: inputAlertReducer,
  areaReducer: areaReducer,
});
