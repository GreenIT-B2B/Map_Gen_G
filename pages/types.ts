export interface KeybCtrlParam {
  isAlt: boolean;
}

export interface UiCtrlParam {
  cgDiv: string;
  coDiv: string;
  crsCd: string;
  crsSeq: number;
  crsName: string;
  holeNo: number;
  holeNoNm: string;
  par: number;
  handi: number;
  holeExpl: string;
  teeSeq: number;
  dotGp: number;
  dotSeq: number;
  areaSectCd: string;
  areaSeq: number;
  areaPtType: number;
  lastSeq: any;
  pointType: string;
  action: string;
}

export interface MapInfo {
  lat: number;
  lng: number;
  zoomW: number;
  zoomBuf: number;

  crs: {
    geos: { lat: number; lng: number }[];
    centGeo: {
      lat: number;
      lng: number;
    };
  };

  hole: {
    geos: { lat: number; lng: number }[];
    rot: number;
    zoomN: number;
    centGeo: {
      lat: number;
      lng: number;
    };
  };
}

export interface CrsDrawInfo {
  idxDragBox: number;
  isModBox: boolean;

  gbRect: any;
  gbScRectPts: any;
  gbCentCirPt: any;
  gbDirTexts: any;

  gbGeos: { lat: number; lng: number }[];
  gbCoords: { x: number; y: number }[];
  gbScRectGeos: [];
  gbCentGeo: {};
  gbCentCoord: {};
  gbZoomW: number;
  gbInclin: {
    a: number;
    b: number;
  };

  initMbDegree: number;
  gbBuf: {
    coords: [];
  };

  drawingFlagC: boolean;
  modBoxInitCoord: {
    x: number;
    y: number;
  };
  modBoxDelta: {
    x: number;
    y: number;
  };
}

export interface HoleDrawInfo {
  idxDragBox: number;
  isModBox: boolean;

  gbRect: any;
  gbScRectPts: any;
  gbCentCirPt: any;
  gbDirTexts: any;

  gbGeos: { lat: number; lng: number }[];
  gbCoords: { x: number; y: number }[];
  gbScRectGeos: [];
  gbCentGeo: {};
  gbCentCoord: {};
  gbZoomW: number;
  gbZoomN: number;
  gbRot: number;
  gbInclin: {
    a: number;
    b: number;
  };

  gbBuf: {
    rot: number;
    coords: { x: number; y: number }[];
  };

  drawingFlagH: boolean;
  initMbDegree: number;
  modBoxInitCoord: {
    x: number;
    y: number;
  };
  modBoxDelta: {
    x: number;
    y: number;
  };

  pinGeo: { getLat: any; getLng: any };
  pinCirPt: any;

  drawingFlagT: boolean;
  teeInfos: any;
  teeCirPts: any;
  removTeeInfo: { seq: number };

  drawingFlagI: boolean;
  idxDragIp: number;
  isModifyIp: boolean;
  ipGeos: { x: number; y: number; getLat: any; getLng: any }[];
  ipRectGeos: any[];

  ipCirPts: any;
  ipPls: any;
  ipDistTexts: any;

  dotInfos: {
    gp: number;
    seq: number;
    geo: {
      lat: number;
      lng: number;
    };
  }[];
  dotCirPts: any;
  removDotInfo: { gp: number; seq: number };

  drawingFlagA: boolean;
  idxDragArea: number;
  isModifyArea: boolean;
  isCloseArea: boolean;
  areaGeos: { sectCd: string; seq: number; pos: any }[];
  areaRectGeos: any[];
  areaLineRectGeos: any[];

  // areaInfos: {
  //   sectCd: string;
  //   seq: number;
  //   geo: {
  //     lat: number;
  //     lng: number;
  //   };
  // }[];
  areaCirPts: any;
  areaPolys: any;
  areaPls: any;

  areaGuidePolys: any[];

  action: string;
}

export interface HoleData {
  holeInfo: {
    cgDiv: string;
    coDiv: string;
    crsCd: string;
    crsName: string;
    holeNo: number;
    holeNoNm: string;
    par: number;
    handi: number;
    tlLaY: number;
    tlLoX: number;
    trLaY: number;
    trLoX: number;
    brLaY: number;
    brLoX: number;
    blLaY: number;
    blLoX: number;
    centerGeoY: number;
    centerGeoX: number;
    rotate: number;
    zoomW: number;
    zoomN: number;
    holeExpl: string;
  };
}

export interface PinData {
  holeInfo: {
    cgDiv: string;
    coDiv: string;
    crsCd: string;
    holeNo: number;
    pinGeoY: number;
    pinGeoX: number;
  };
}

export interface IpData {
  holeInfo: {
    cgDiv: string;
    coDiv: string;
    crsCd: string;
    holeNo: number;
    ipZGeoY: number;
    ipZGeoX: number;
    ipFGeoY: number;
    ipFGeoX: number;
    ipSGeoY?: number;
    ipSGeoX?: number;
  };
}
