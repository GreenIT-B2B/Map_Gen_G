import React, { Component } from "react";

import { convert, GT_GEO, GT_TM } from "./GeoTrans";

const PI = 3.14159265358979323846;

const SCALE_IDX_LT = 0;
const SCALE_IDX_MT = 1;
const SCALE_IDX_RT = 2;
const SCALE_IDX_LM = 3;
const SCALE_IDX_RM = 4;
const SCALE_IDX_LB = 5;
const SCALE_IDX_MB = 6;
const SCALE_IDX_RB = 7;

const LT = 0;
const RT = 1;
const RB = 2;
const LB = 3;

// 각에서 라디언
var deg2rad = function deg2rad(deg) {
  return (deg * PI) / 180.0;
};

// 라디언 에서 각
var rad2deg = function rad2deg(rad) {
  return (rad * 180.0) / PI;
};

// 두 위치 좌표에 거리
var dist = function dist(lat1, lon1, lat2, lon2, unit) {
  var theta = lon1 - lon2;
  var dist =
    Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60 * 1.1515;
  if (unit === "k") {
    dist = dist * 1.609344;
  } else if (unit === "m") {
    dist = dist * 1.609344 * 1000;
  } else if (unit === "y") {
    dist = dist * 1.609344 * 1000 * 1.094;
  } else if (unit === "n") {
    dist = dist * 0.8684;
  }
  return dist;
};

export { dist };

// 두 위치 좌표에 거리
var calDist = function calDist(pt1, pt2) {
  var earthR, rad, radLat1, radLat2, radDist;
  var dist, ret;

  earthR = 6371000.0;
  rad = PI / 180;
  radLat1 = rad * pt1.lat;
  radLat2 = rad * pt2.lat;
  radDist = rad * (pt1.lng - pt2.lng);

  dist = Math.sin(radLat1) * Math.sin(radLat2);
  dist = dist + Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radDist);

  return earthR * Math.acos(dist);
};

export { calDist };

// 두 위치 좌표에 거리
function distByGeo(pt1, pt2) {
  const lat1 = deg2rad(pt1.lat);
  const lon1 = deg2rad(pt1.lng);
  const lat2 = deg2rad(pt2.lat);
  const lon2 = deg2rad(pt2.lng);

  const longitude = lon2 - lon1;
  const latitude = lat2 - lat1;

  const a =
    Math.pow(Math.sin(latitude / 2.0), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(longitude / 2.0), 2);
  return 6376.5 * 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a));
}

// 두점에 중점
var centLine = function centLine(src1, src2) {
  var geo = {
    lat: 0.0,
    lng: 0.0,
  };

  geo.lat = (src1.getLat() + src2.getLat()) / 2;
  geo.lng = (src1.getLng() + src2.getLng()) / 2;

  return geo;
};

export { centLine };

// 폴리곤 영역 체크
var pointInPolygon = function pointInPolygon(mbr, point) {
  var polySides = mbr.length;
  var j = polySides - 1;
  var oddNodes = false;

  for (let i = 0; i < polySides; i++) {
    if (
      ((mbr[i].getLat() < point.getLat() && mbr[j].getLat() >= point.getLat()) ||
        (mbr[j].getLat() < point.getLat() && mbr[i].getLat() >= point.getLat())) &&
      (mbr[i].getLng() <= point.getLng() || mbr[j].getLng() <= point.getLng())
    ) {
      oddNodes ^=
        mbr[i].getLng() +
          ((point.getLat() - mbr[i].getLat()) / (mbr[j].getLat() - mbr[i].getLat())) *
            (mbr[j].getLng() - mbr[i].getLng()) <
        point.getLng();
    }

    j = i;
  }

  if (oddNodes === 1) {
    oddNodes = true;
  } else if (oddNodes === 0) {
    oddNodes = false;
  }

  return oddNodes;
};

export { pointInPolygon };

// 사각형 이동
var rectPos = function rectPos(coords, delta) {
  for (let i = 0; i < coords.length; i++) {
    coords[i].y -= delta.y;
    coords[i].x -= delta.x;
  }

  return coords;
};

export { rectPos };

// 사각형 회전
var rectRot = function rectRot(coords, centCoord, delta, iDegree, curDegree) {
  var retData = {
    rot: 0.0,
    coords: [],
  };

  var dDegree = Math.atan2(delta.y, delta.x);

  let cDegree = (dDegree - iDegree) * 100;
  if (cDegree >= 360) cDegree -= 360;
  if (cDegree < 0) cDegree += 360;
  if (cDegree >= 360) cDegree -= 360;

  var cosRad = Math.cos(deg2rad(cDegree));
  var sinRad = Math.sin(deg2rad(cDegree));

  var angle = (cDegree * PI) / 180.0;

  for (let i = 0; i < coords.length; i++) {
    var coord = {
      x: Math.cos(angle) * (coords[i].x - centCoord.x) - Math.sin(angle) * (coords[i].y - centCoord.y) + centCoord.x,
      y: Math.sin(angle) * (coords[i].x - centCoord.x) + Math.cos(angle) * (coords[i].y - centCoord.y) + centCoord.y,
    };

    retData.coords.push(coord);
  }

  var rDegree = curDegree + cDegree;
  if (rDegree >= 360) rDegree -= 360;
  retData.rot = rDegree;

  return retData;
};
export { rectRot };

// 사각형 포인트 별 스케일
var rectScale = function rectScale(coords, inclin, selP, delta, deg) {
  const rad = deg2rad(deg);

  if (selP == SCALE_IDX_LT) {
    coords[LT].x -= delta.x;
    const ypos = calcInclinY(inclin, coords[LT].x);
    delta.y = coords[LT].y - ypos;
    coords[LT].y -= delta.y;

    coords[RT].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[RT].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
    coords[LB].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[LB].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
  } else if (selP == SCALE_IDX_MT) {
    coords[LT].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[LT].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
    coords[RT].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[RT].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
  } else if (selP == SCALE_IDX_RT) {
    coords[RT].x -= delta.x;
    const ypos = calcInclinY(inclin, coords[RT].x);
    delta.y = coords[RT].y - ypos;
    coords[RT].y -= delta.y;

    coords[LT].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[LT].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
    coords[RB].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[RB].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
  } else if (selP == SCALE_IDX_LM) {
    coords[LT].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[LT].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
    coords[LB].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[LB].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
  } else if (selP == SCALE_IDX_RM) {
    coords[RT].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[RT].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
    coords[RB].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[RB].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
  } else if (selP == SCALE_IDX_LB) {
    coords[LB].x -= delta.x;
    const ypos = calcInclinY(inclin, coords[LB].x);
    delta.y = coords[LB].y - ypos;
    coords[LB].y -= delta.y;

    coords[LT].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[LT].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
    coords[RB].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[RB].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
  } else if (selP == SCALE_IDX_MB) {
    coords[LB].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[LB].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
    coords[RB].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[RB].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
  } else if (selP == SCALE_IDX_RB) {
    coords[RB].x -= delta.x;
    const ypos = calcInclinY(inclin, coords[RB].x);
    delta.y = coords[RB].y - ypos;
    coords[RB].y -= delta.y;

    coords[RT].x -= delta.x * Math.cos(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.sin(rad);
    coords[RT].y -= delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.sin(rad) * Math.sin(rad);
    coords[LB].x -= delta.x * Math.sin(rad) * Math.sin(rad) + -delta.y * Math.sin(rad) * Math.cos(rad);
    coords[LB].y -= -delta.x * Math.sin(rad) * Math.cos(rad) + delta.y * Math.cos(rad) * Math.cos(rad);
  }

  return coords;
};

export { rectScale };

// 사각형 회전
var rectDegToRot = function rectDegToRot(coords, centCoord, curDegree) {
  var retData = {
    rot: 0.0,
    coords: [],
  };

  var cosRad = Math.cos(deg2rad(curDegree));
  var sinRad = Math.sin(deg2rad(curDegree));

  var angle = (curDegree * PI) / 180.0;

  for (let i = 0; i < coords.length; i++) {
    var coord = {
      x: Math.cos(angle) * (coords[i].x - centCoord.x) - Math.sin(angle) * (coords[i].y - centCoord.y) + centCoord.x,
      y: Math.sin(angle) * (coords[i].x - centCoord.x) + Math.cos(angle) * (coords[i].y - centCoord.y) + centCoord.y,
    };

    retData.coords.push(coord);
  }

  var rDegree = curDegree;
  if (rDegree >= 360) rDegree -= 360;
  retData.rot = rDegree;

  return retData;
};

export { rectDegToRot };

// 두점에 잇는 직선에서 특정 거리만큼 넓이는 가진 사각형
var makeLineToRect = function makeLineToRect(dist, geo1, geo2) {
  const rGeos = [];

  var incl = calcInclinGeo(geo1, geo2);

  var inclPp = calcInclinPerPen(incl, geo1);
  var bGeos = intersecSq(geo1, dist, inclPp);

  rGeos.push(new window.kakao.maps.LatLng(bGeos[0].lat, bGeos[0].lng));
  rGeos.push(new window.kakao.maps.LatLng(bGeos[1].lat, bGeos[1].lng));

  inclPp = calcInclinPerPen(incl, geo2);
  bGeos = intersecSq(geo2, dist, inclPp);

  rGeos.push(new window.kakao.maps.LatLng(bGeos[1].lat, bGeos[1].lng));
  rGeos.push(new window.kakao.maps.LatLng(bGeos[0].lat, bGeos[0].lng));

  return rGeos;
};

export { makeLineToRect };

// 두점을 잇는 직선에 특정 좌표에 대한 수선발 좌표
var newGeoOnLine = function newGeoOnLine(baseGeo, stGeo, edGeo) {
  let nGeo = {
    lat: 0.0,
    lng: 0.0,
  };

  if (stGeo.getLng() === edGeo.getLng()) {
    nGeo.lng = stGeo.getLng();
    nGeo.lat = baseGeo.getLat();
  } else if (stGeo.getLat() === edGeo.getLat()) {
    nGeo.lng = baseGeo.getLng();
    nGeo.lat = stGeo.getLat();
  } else {
    const m1 = (edGeo.getLat() - stGeo.getLat()) / (edGeo.getLng() - stGeo.getLng());
    const k1 = -m1 * stGeo.getLng() + stGeo.getLat();

    const m2 = -1 / m1;
    const k2 = -m2 * baseGeo.getLng() + baseGeo.getLat();

    nGeo.lng = (k2 - k1) / (m1 - m2);
    nGeo.lat = m1 * nGeo.lng + k1;
  }
  return new window.kakao.maps.LatLng(nGeo.lat, nGeo.lng);
};

export { newGeoOnLine };

// 직선 위에 한 점에서 특정 거리에 있는 수직 직선위에 좌표
function intersecSq(geo, r, incl) {
  var retGeos = [];

  var A, B1, C, D;
  var GEO = {
    lat: 0.0,
    lng: 0.0,
  };

  if (incl.a < -3 || incl.a > 3) {
    var rGeo = {
      lat: geo.getLat() + r,
      lng: geo.getLng(),
    };
    retGeos.push(rGeo);

    rGeo = {
      lat: geo.getLat() - r,
      lng: geo.getLng(),
    };
    retGeos.push(rGeo);
  } else {
    A = incl.a * incl.a + 1;
    B1 = incl.a * incl.b - incl.a * geo.getLat() - geo.getLng();
    C = geo.getLng() * geo.getLng() + geo.getLat() * geo.getLat() - r * r + incl.b * incl.b - 2 * incl.b * geo.getLat();
    D = B1 * B1 - A * C;

    GEO.lng = -(B1 + Math.sqrt(D)) / A;
    GEO.lat = incl.a * GEO.lng + incl.b;

    var rGeo = {
      lat: GEO.lat,
      lng: GEO.lng,
    };
    retGeos.push(rGeo);

    GEO.lng = -(B1 - Math.sqrt(D)) / A;
    GEO.lat = incl.a * GEO.lng + incl.b;

    rGeo = {
      lat: GEO.lat,
      lng: GEO.lng,
    };
    retGeos.push(rGeo);
  }

  return retGeos;
}

// 벡터애 투영된 길이 값
function thetaDotProduct(O, a, b) {
  a.lng -= O.lng;
  a.lat -= O.lat;
  b.lng -= O.lng;
  b.lat -= O.lat;

  const dot = dotProduct(a, b);
  const ab = Math.sqrt(a.lng * a.lng + a.lat * a.lat) * Math.sqrt(b.lng * b.lng + b.lat * b.lat);
  const costheta = dot / ab;

  const theta = Math.acos(costheta);
  const degree = (theta * 180) / PI;

  return theta;
}

function dotProduct(a, b) {
  return a.lng * b.lng + a.lat * b.lat;
}

// 두 화면 좌표에 대한 직선 정보(기울기, y절편)
var calcInclin = function calcInclin(coord1, coord2) {
  const va = (coord1.y - coord2.y) / (coord1.x - coord2.x);
  const vb = coord1.y - va * coord1.x;

  return {
    a: va,
    b: vb,
  };
};
export { calcInclin };

// 직선에 x 좌표에 대한 y좌표
function calcInclinY(inclin, x) {
  return inclin.a * x + inclin.b;
}

// 직선과 위치 좌표의 수평발에 대한 좌표
function calcInclinPerPen(inclin, geo) {
  const retLincl = {
    a: 0.0,
    b: 0.0,
  };
  if (inclin.a == 0) {
    retLincl.a = 1;
  } else {
    retLincl.a = -1 / inclin.a;
  }
  retLincl.b = geo.getLat() - retLincl.a * geo.getLng();

  return retLincl;
}

// 두 위치 좌표에 직선 정보(기울기, y절편)
function calcInclinGeo(geo1, geo2) {
  const va = (geo1.getLat() - geo2.getLat()) / (geo1.getLng() - geo2.getLng());
  const vb = geo1.getLat() - va * geo1.getLng();

  return {
    a: va,
    b: vb,
  };
}

// 두 위치 좌표의 각도
function coordToRad(geo1, geo2) {
  return Math.atan2(geo2.getLat() - geo1.getLat(), geo2.getLng() - geo1.getLng());
}

// 위치 좌표를 이미지 좌표로 변환
function calcGeoPosOnImage(mbr, geo, geoMapSize, viewSize) {
  if (mbr == null || mbr[0] == null || mbr[3] == null) return null;

  var ox = mbr[3].lng;
  var oy = mbr[3].lat;
  var x1 = mbr[0].lng;
  var y1 = mbr[0].lat;
  var px = geo.getLng();
  var py = geo.getLat();

  const O = convert(GT_GEO, GT_TM, { lat: oy, lng: ox, height: 0 });
  const A = convert(GT_GEO, GT_TM, { lat: y1, lng: x1, height: 0 });
  const P = convert(GT_GEO, GT_TM, { lat: py, lng: px, height: 0 });

  const theta = thetaDotProduct(O, A, P);
  const opDist = distByGeo({ lat: oy, lng: ox }, { lat: py, lng: px }) * 1000;

  const s = Math.cos(theta) * opDist;
  const b = Math.sqrt(opDist * opDist - s * s);

  const moveToRatioW = b / geoMapSize.width;
  const moveToRatioH = s / geoMapSize.height;

  var posX = 0;
  var posY = 0;

  if (!isNaN(moveToRatioW)) {
    posX = parseInt(viewSize.width * moveToRatioW);
  }

  if (!isNaN(moveToRatioH)) {
    posY = viewSize.height - parseInt(viewSize.height * moveToRatioH);
  } else {
    posY = viewSize.height;
  }

  return { x: posX, y: posY };
}

export { calcGeoPosOnImage };

// 터치 및 클릭한 화면 좌표를 위치 좌표로 변환
function calcGeoPosOnTouch(mbr, x, y, geoMapSize, viewSize) {
  if (geoMapSize.width == 0 && geoMapSize.height == 0) {
    return null;
  }

  var geoX = mbr[3].lng + (mbr[2].lng - mbr[3].lng) * (x / viewSize.width);
  var geoY = mbr[3].lat + (mbr[2].lat - mbr[3].lat) * (x / viewSize.width);

  geoX = geoX + (mbr[1].lng - mbr[2].lng) * ((viewSize.height - y) / viewSize.height);
  geoY = geoY + (mbr[1].lat - mbr[2].lat) * ((viewSize.height - y) / viewSize.height);

  return { lat: geoY, lng: geoX };
}

export { calcGeoPosOnTouch };
