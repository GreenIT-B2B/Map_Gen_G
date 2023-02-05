"use strict";
(() => {
var exports = {};
exports.id = 888;
exports.ids = [888];
exports.modules = {

/***/ 8172:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ _app)
});

// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(997);
;// CONCATENATED MODULE: external "redux"
const external_redux_namespaceObject = require("redux");
;// CONCATENATED MODULE: external "redux-thunk"
const external_redux_thunk_namespaceObject = require("redux-thunk");
var external_redux_thunk_default = /*#__PURE__*/__webpack_require__.n(external_redux_thunk_namespaceObject);
;// CONCATENATED MODULE: external "@redux-devtools/extension"
const extension_namespaceObject = require("@redux-devtools/extension");
;// CONCATENATED MODULE: external "next-redux-wrapper"
const external_next_redux_wrapper_namespaceObject = require("next-redux-wrapper");
// EXTERNAL MODULE: ./store/types.ts
var types = __webpack_require__(2232);
;// CONCATENATED MODULE: ./store/reducers/mapReducer.ts

const initialState = {
    keyword: "",
    coDiv: "",
    crsCd: "",
    holeNo: 0,
    pointType: "N",
    wmg0050s: [],
    wmg0100s: [],
    wmg0200s: [],
    wmgLastAct: [],
    loading: true,
    isSave: false,
    isCancel: false,
    cmMsg: {}
};
const mapReducer = (state = initialState, action)=>{
    // console.log(">>> mapReducer >>> action.type : " + action.type);
    switch(action.type){
        case types/* SEARCH_KWD */.ng:
            return {
                ...state,
                keyword: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEL_COMP */.UK:
            return {
                ...state,
                coDiv: action.payload,
                // crsCd: 'N',
                // holeNo: 0,
                // pointType: 'N',
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEL_CRS */.qK:
            return {
                ...state,
                // coDiv: '',
                crsCd: action.payload,
                // holeNo: 0,
                // pointType: 'N',
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEL_HOLE */.OJ:
            return {
                ...state,
                // coDiv: '',
                // crsCd: 'N',
                holeNo: action.payload,
                // pointType: 'N',
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEL_POINT_TYPE */.H9:
            return {
                ...state,
                // coDiv: '',
                // crsCd: 'N',
                // holeNo: 0,
                pointType: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEND_COMP_INFO */.RF:
            return {
                ...state,
                wmg0050s: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEND_CRS_INFO */.Ef:
            return {
                ...state,
                wmg0100s: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEND_HOLE_INFO */.AY:
            return {
                ...state,
                wmg0200s: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SEND_LAST_ACT_INFO */.zv:
            return {
                ...state,
                wmgLastAct: action.payload,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* SAVE_HOLE_DATA */.oO:
            return {
                ...state,
                isSave: true,
                isCancel: false,
                loading: false
            };
        case types/* CANCEL_HOLE_DATA */.yK:
            return {
                ...state,
                isSave: false,
                isCancel: true,
                loading: false
            };
        case types/* RESET_HOLE_DATA_STATE */.GX:
            return {
                ...state,
                isSave: false,
                isCancel: false,
                loading: false
            };
        case types/* COMMON_MESSAGE */.uz:
            return {
                ...state,
                cmMsg: action.payload,
                loading: false
            };
        case types/* _ERROR */.aU:
            return {
                keyword: "",
                coDiv: "",
                crsCd: "N",
                holeNo: 0,
                pointType: "N",
                wmg0050s: [],
                wmg0100s: [],
                wmg0200s: [],
                wmgLastAct: {},
                cmMsg: {},
                loading: false,
                error: action.payload
            };
        default:
            return state;
    }
};
/* harmony default export */ const reducers_mapReducer = (mapReducer);

// EXTERNAL MODULE: ./store/reducers/newwsReducer.ts
var newwsReducer = __webpack_require__(1094);
// EXTERNAL MODULE: ./store/reducers/holeReducer.ts
var holeReducer = __webpack_require__(9135);
// EXTERNAL MODULE: external "@reduxjs/toolkit"
var toolkit_ = __webpack_require__(5184);
;// CONCATENATED MODULE: ./store/reducers/pinReducer.ts

const pinReducer_initialState = {
    pinReducer: {}
};
const pinReducer = (0,toolkit_.createSlice)({
    name: "pinReducer",
    initialState: pinReducer_initialState,
    reducers: {
        pinRedux (state, action) {
            state.pinReducer = action.payload;
        }
    }
});
/* harmony default export */ const reducers_pinReducer = (pinReducer.reducer);
const { pinRedux  } = pinReducer.actions;

// EXTERNAL MODULE: ./store/reducers/teeReducer.ts
var teeReducer = __webpack_require__(1227);
// EXTERNAL MODULE: ./store/reducers/bunkReducer.ts
var bunkReducer = __webpack_require__(3715);
// EXTERNAL MODULE: ./store/reducers/searchReducer.ts
var searchReducer = __webpack_require__(2306);
// EXTERNAL MODULE: ./store/reducers/compInfoReducer.ts
var compInfoReducer = __webpack_require__(8118);
// EXTERNAL MODULE: ./store/reducers/areltReducer.ts
var areltReducer = __webpack_require__(266);
// EXTERNAL MODULE: ./store/reducers/codivSelectReducer.ts
var codivSelectReducer = __webpack_require__(4453);
// EXTERNAL MODULE: ./store/reducers/holeSelectReducer.ts
var holeSelectReducer = __webpack_require__(9688);
// EXTERNAL MODULE: ./store/reducers/menuSelectReducer.ts
var menuSelectReducer = __webpack_require__(3404);
// EXTERNAL MODULE: ./store/reducers/crsSelectReducer.ts
var crsSelectReducer = __webpack_require__(5590);
// EXTERNAL MODULE: ./store/reducers/btnModalReducer.ts
var btnModalReducer = __webpack_require__(5604);
// EXTERNAL MODULE: ./store/reducers/guideReducer.ts
var guideReducer = __webpack_require__(1079);
// EXTERNAL MODULE: ./store/reducers/teeIsMoReducer.ts
var teeIsMoReducer = __webpack_require__(2643);
// EXTERNAL MODULE: ./store/reducers/bunkIsMoReducer.ts
var bunkIsMoReducer = __webpack_require__(5310);
// EXTERNAL MODULE: ./store/reducers/mapChangeReducer.ts
var mapChangeReducer = __webpack_require__(5156);
// EXTERNAL MODULE: ./store/reducers/inputAlertReducer.ts
var inputAlertReducer = __webpack_require__(6127);
// EXTERNAL MODULE: ./store/reducers/areaReducer.ts
var areaReducer = __webpack_require__(4496);
;// CONCATENATED MODULE: ./store/reducers/index.ts





















/* harmony default export */ const reducers = ((0,external_redux_namespaceObject.combineReducers)({
    mapData: reducers_mapReducer,
    newWorkSpace: newwsReducer/* default */.Z,
    holeReducer: holeReducer/* default */.Z,
    pinReducer: reducers_pinReducer,
    teeReducer: teeReducer/* default */.Z,
    bunkReducer: bunkReducer/* default */.Z,
    searchReducer: searchReducer/* default */.Z,
    compInfoReducer: compInfoReducer/* default */.Z,
    areltReducer: areltReducer/* default */.Z,
    codivSelectReducer: codivSelectReducer/* default */.Z,
    holeSelectReducer: holeSelectReducer/* default */.Z,
    menuSelectReducer: menuSelectReducer/* default */.Z,
    crsSelectReducer: crsSelectReducer/* default */.Z,
    btnModalReducer: btnModalReducer/* default */.Z,
    guideReducer: guideReducer/* default */.Z,
    teeIsMoReducer: teeIsMoReducer/* default */.Z,
    bunkIsMoReducer: bunkIsMoReducer/* default */.Z,
    mapChangeReducer: mapChangeReducer/* default */.Z,
    inputAlertReducer: inputAlertReducer/* default */.Z,
    areaReducer: areaReducer/* default */.Z
}));

;// CONCATENATED MODULE: ./store/store.ts





// initial states here
const initalState = {};
// middleware
const middleware = [
    (external_redux_thunk_default())
];
// creating store
const store = (0,external_redux_namespaceObject.createStore)(reducers, initalState, (0,extension_namespaceObject.composeWithDevTools)((0,external_redux_namespaceObject.applyMiddleware)(...middleware)));
// assigning store to next wrapper
const makeStore = ()=>store;
const wrapper = (0,external_next_redux_wrapper_namespaceObject.createWrapper)(makeStore);

// EXTERNAL MODULE: external "react-redux"
var external_react_redux_ = __webpack_require__(6022);
;// CONCATENATED MODULE: ./pages/_app.tsx





function MyApp({ Component , pageProps  }) {
    return /*#__PURE__*/ jsx_runtime_.jsx(jsx_runtime_.Fragment, {
        children: /*#__PURE__*/ jsx_runtime_.jsx(external_react_redux_.Provider, {
            store: store,
            children: /*#__PURE__*/ jsx_runtime_.jsx(Component, {
                ...pageProps
            })
        })
    });
}
/* harmony default export */ const _app = (wrapper.withRedux(MyApp));


/***/ }),

/***/ 5184:
/***/ ((module) => {

module.exports = require("@reduxjs/toolkit");

/***/ }),

/***/ 6022:
/***/ ((module) => {

module.exports = require("react-redux");

/***/ }),

/***/ 997:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [199], () => (__webpack_exec__(8172)));
module.exports = __webpack_exports__;

})();