import {
  SEARCH_KWD,
  SEL_COMP,
  SEL_CRS,
  SEL_HOLE,
  SEL_POINT_TYPE,
  SEND_COMP_INFO,
  SEND_CRS_INFO,
  SEND_HOLE_INFO,
  SEND_LAST_ACT_INFO,
  SAVE_HOLE_DATA,
  CANCEL_HOLE_DATA,
  RESET_HOLE_DATA_STATE,
  COMMON_MESSAGE,
  _ERROR,
} from "../types";

export const getActKwd = (keyword) => async (dispatch) => {
  try {
    dispatch({
      type: SEARCH_KWD,
      payload: keyword,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSelComp = (coDiv) => async (dispatch) => {
  try {
    dispatch({
      type: SEL_COMP,
      payload: coDiv,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSelCrs = (crsCd) => async (dispatch) => {
  try {
    dispatch({
      type: SEL_CRS,
      payload: crsCd,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSelHole = (holeNo) => async (dispatch) => {
  try {
    dispatch({
      type: SEL_HOLE,
      payload: holeNo,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSelPointType = (pointType) => async (dispatch) => {
  try {
    dispatch({
      type: SEL_POINT_TYPE,
      payload: pointType,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSendCompInfo = (wmg0050s) => async (dispatch) => {
  try {
    dispatch({
      type: SEND_COMP_INFO,
      payload: wmg0050s,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSendCrsInfo = (wmg0100s) => async (dispatch) => {
  try {
    dispatch({
      type: SEND_CRS_INFO,
      payload: wmg0100s,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSendHoleInfo = (wmg0200s) => async (dispatch) => {
  try {
    dispatch({
      type: SEND_HOLE_INFO,
      payload: wmg0200s,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSendLastAct = (wmgLastAct) => async (dispatch) => {
  try {
    dispatch({
      type: SEND_LAST_ACT_INFO,
      payload: wmgLastAct,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActSaveGeoData = () => async (dispatch) => {
  try {
    dispatch({
      type: SAVE_HOLE_DATA,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActCancelGeoData = () => async (dispatch) => {
  try {
    dispatch({
      type: CANCEL_HOLE_DATA,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActResetGeoDataState = () => async (dispatch) => {
  try {
    dispatch({
      type: RESET_HOLE_DATA_STATE,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};

export const getActCmMsg = (cmMsg) => async (dispatch) => {
  try {
    // console.log(">>> action >>> getActCmMsg >>> cmMsg : " + cmMsg);

    dispatch({
      type: COMMON_MESSAGE,
      payload: cmMsg,
    });
  } catch (error) {
    dispatch({
      type: _ERROR,
      payload: "error message",
    });
  }
};
