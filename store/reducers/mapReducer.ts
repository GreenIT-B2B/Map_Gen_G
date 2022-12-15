import { SEARCH_KWD,
  SEL_COMP, SEL_CRS, SEL_HOLE, SEL_POINT_TYPE,
  SEND_COMP_INFO, SEND_CRS_INFO, SEND_HOLE_INFO, SEND_LAST_ACT_INFO,
  SAVE_HOLE_DATA, CANCEL_HOLE_DATA, RESET_HOLE_DATA_STATE,
  COMMON_MESSAGE, _ERROR } from "../types";

const initialState = {
  keyword: '',

  coDiv: '',
  crsCd: '',
  holeNo: 0,
  pointType: 'N',

  wmg0050s: [],
  wmg0100s: [],
  wmg0200s: [],
  wmgLastAct: [],
  loading: true,

  isSave: false,
  isCancel: false,

  cmMsg: {},
};

const mapReducer = (state = initialState, action) => {
// console.log(">>> mapReducer >>> action.type : " + action.type);
switch (action.type) {
  case SEARCH_KWD:
    return {
      ...state,
      keyword: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEL_COMP:
    return {
      ...state,
      coDiv: action.payload,
      // crsCd: 'N',
      // holeNo: 0,
      // pointType: 'N',
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEL_CRS:
    return {
      ...state,
      // coDiv: '',
      crsCd: action.payload,
      // holeNo: 0,
      // pointType: 'N',
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEL_HOLE:
    return {
      ...state,
      // coDiv: '',
      // crsCd: 'N',
      holeNo: action.payload,
      // pointType: 'N',
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEL_POINT_TYPE:
    return {
      ...state,
      // coDiv: '',
      // crsCd: 'N',
      // holeNo: 0,
      pointType: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };




  case SEND_COMP_INFO:
    return {
      ...state,
      wmg0050s: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };  

  case SEND_CRS_INFO:
    return {
      ...state,
      wmg0100s: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEND_HOLE_INFO:
    return {
      ...state,
      wmg0200s: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };

  case SEND_LAST_ACT_INFO:
    return {
      ...state,
      wmgLastAct: action.payload,
      isSave: false,
      isCancel: false,
      loading: false,
    };



  case SAVE_HOLE_DATA:
    return {
      ...state,
      isSave: true,
      isCancel: false,
      loading: false,
    };

  case CANCEL_HOLE_DATA:
      return {
        ...state,
        isSave: false,
        isCancel: true,
        loading: false,
      };

  case RESET_HOLE_DATA_STATE:
    return {
      ...state,
      isSave: false,
      isCancel: false,
      loading: false,
    };      








  case COMMON_MESSAGE:
    return {
      ...state,
      cmMsg: action.payload,
      loading: false,
    };

  case _ERROR:
    return {
      keyword: '',
      coDiv: '',
      crsCd: 'N',
      holeNo: 0,
      pointType: 'N',
      
      wmg0050s: [],
      wmg0100s: [],
      wmg0200s: [],
      wmgLastAct: {},
    
      cmMsg: {},

      loading: false,
      error: action.payload,
    };

  default:
    return state;
  }
};

export default mapReducer;