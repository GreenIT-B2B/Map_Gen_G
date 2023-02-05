const PI = 3.14159265358979323846264338327950288;
const HALF_PI = 1.5707963267948966;
const COS_67P5 = 0.38268343236508977;
const AD_C = 1.0026;

export const GT_GEO = 0;
export const GT_KATEC = 1;
export const GT_TM = 2;
export const GT_GRS80 = 3;

const EPSLN = 0.0000000001;

var ind = [];
var es = [];
var esp = [];
var src = [];
var dst = [];

const majors = [6378137.0, 6377397.155, 6377397.15];
const minors = [6356752.3142, 6356078.9633422494, 6356078.9633422494];

const scaleFactors = [1, 0.999, 1.0];
const lonCenters = [0.0, 2.23402144255274, 2.21661859489671];
const latCenters = [0.0, 0.663225115757845, 0.663225115757845];
const falseNorthings = [0.0, 600000.0, 500000.0];
const falseEastings = [0.0, 400000.0, 200000.0];

const datumParams = [-146.43, 507.89, 681.46];

function init() {
  for (let i = 0; i < 3; i++) {
    const tmp = minors[i] / majors[i];
    es[i] = 1.0 - tmp * tmp;
    esp[i] = es[i] / (1.0 - es[i]);

    if (es[i] < 0.00001) ind[i] = 1.0;
    else ind[i] = 0.0;

    src[i] = majors[i] * mlfn(e0fn(es[i]), e1fn(es[i]), e2fn(es[i]), e3fn(es[i]), latCenters[i]);
    dst[i] = majors[i] * mlfn(e0fn(es[i]), e1fn(es[i]), e2fn(es[i]), e3fn(es[i]), latCenters[i]);
  }
}

function e0fn(x) {
  return 1.0 - 0.25 * x * (1.0 + (x / 16.0) * (3.0 + 1.25 * x));
}

function e1fn(x) {
  return 0.375 * x * (1.0 + 0.25 * x * (1.0 + 0.46875 * x));
}

function e2fn(x) {
  return 0.05859375 * x * x * (1.0 + 0.75 * x);
}

function e3fn(x) {
  return x * x * x * (35.0 / 3072.0);
}

function mlfn(e0, e1, e2, e3, phi) {
  return e0 * phi - e1 * Math.sin(2.0 * phi) + e2 * Math.sin(4.0 * phi) - e3 * Math.sin(6.0 * phi);
}

function D2R(degree) {
  return (degree * PI) / 180.0;
}

function R2D(radian) {
  return (radian * 180.0) / PI;
}

function asinz(value) {
  if (Math.abs(value) > 1.0) value = value > 0 ? 1 : -1;
  return Math.asin(value);
}

// 측지 좌표계에서 중심 좌표계 변환
function geodeticToGeocentric(type, p) {
  var lng = p.lng;
  var lat = p.lat;
  var height = p.height;
  var x;
  var y;
  var z;

  var rn;
  var sinLat;
  var sin2Lat;
  var cosLat;

  if (lat < -HALF_PI && lat > -1.001 * HALF_PI) {
    lat = -HALF_PI;
  } else if (lat > HALF_PI && lat < 1.001 * HALF_PI) {
    lat = HALF_PI;
  } else if (lat < -HALF_PI || lat > HALF_PI) {
    return p;
  }

  if (lng > PI) lng -= 2 * PI;

  sinLat = Math.sin(lat);
  cosLat = Math.cos(lat);
  sin2Lat = sinLat * sinLat;
  rn = majors[type] / Math.sqrt(1.0 - es[type] * sin2Lat);
  x = (rn + height) * cosLat * Math.cos(lng);

  y = (rn + height) * cosLat * Math.sin(lng);
  z = (rn * (1 - es[type]) + height) * sinLat;

  p.lng = x;
  p.lat = y;
  p.height = z;

  return p;
}

// 중심 좌표계에서 측지 좌표계 변환
function geocentricToGeodetic(type, p) {
  const x = p.lng;
  const y = p.lat;
  const z = p.height;
  var lng;
  var lat;
  var height;

  var w;
  var w2;
  var t0;
  var t1;
  var s0;
  var s1;
  var sinB0;
  var sin3B0;
  var cosB0;
  var sinP1;
  var cosP1;
  var rn;
  var sum;
  var atPole;

  atPole = false;
  if (x != 0.0) {
    lng = Math.atan2(y, x);
  } else {
    if (y > 0) {
      lng = HALF_PI;
    } else if (y < 0) {
      lng = -HALF_PI;
    } else {
      atPole = true;
      lng = 0.0;

      if (z > 0.0) {
        lat = HALF_PI;
      } else if (z < 0.0) {
        lat = -HALF_PI;
      } else {
        lat = HALF_PI;
        height = -minors[type];

        return p;
      }
    }
  }

  w2 = x * x + y * y;
  w = Math.sqrt(w2);
  t0 = z * AD_C;
  s0 = Math.sqrt(t0 * t0 + w2);
  sinB0 = t0 / s0;
  cosB0 = w / s0;
  sin3B0 = sinB0 * sinB0 * sinB0;
  t1 = z + minors[type] * esp[type] * sin3B0;

  sum = w - majors[type] * es[type] * cosB0 * cosB0 * cosB0;
  s1 = Math.sqrt(t1 * t1 + sum * sum);

  sinP1 = t1 / s1;
  cosP1 = sum / s1;
  rn = majors[type] / Math.sqrt(1.0 - es[type] * sinP1 * sinP1);

  if (cosP1 >= COS_67P5) {
    height = w / cosP1 - rn;
  } else if (cosP1 <= -COS_67P5) {
    height = w / -cosP1 - rn;
  } else {
    height = z / sinP1 + rn * (es[type] - 1.0);
  }

  if (!atPole) {
    lat = Math.atan(sinP1 / cosP1);
  }

  p.lng = lng;
  p.lat = lat;
  p.height = height;

  return p;
}

// 중심 좌표계에서 세계 측지 좌표계 변환
function geocentricToWgs84(p) {
  p.lng = p.lng + datumParams[0];
  p.lat = p.lat + datumParams[1];
  p.height = p.height + datumParams[2];

  return p;
}

// 세계 측지 좌표계에서 중심 좌표계 변환
function geocentricFromWgs84(p) {
  p.lng = p.lng - datumParams[0];
  p.lat = p.lat - datumParams[1];
  p.height = p.height - datumParams[2];

  return p;
}

// 측지 좌표계 변환
function transform(srcType, dstType, point) {
  if (srcType == dstType) return;

  if (srcType != 0 || dstType != 0) {
    point = geodeticToGeocentric(srcType, point);

    if (srcType != 0) {
      point = geocentricToWgs84(point);
    }

    if (dstType != 0) {
      point = geocentricFromWgs84(point);
    }
    point = geocentricToGeodetic(dstType, point);
  }

  return point;
}

// 평면 좌표계를 위치 좌표계로 변환
function tm2geo(srctype, inPt, outPt) {
  var pointGeo = {
    lat: inPt.lat,
    lng: inPt.lng,
    height: 0,
  };
  const nMaxIter = 6;

  if (ind[srctype] != 0) {
    const f = Math.exp(inPt.lng / (majors[srctype] * scaleFactors[srctype]));
    const g = 0.5 * (f - 1.0 / f);
    const temp = latCenters[srctype] + pointGeo.lat / (majors[srctype] * scaleFactors[srctype]);
    const h = Math.cos(temp);
    const con = Math.sqrt((1.0 - h * h) / (1.0 + g * g));
    outPt.lat = asinz(con);

    if (temp < 0) outPt.lat = outPt.lat * -1;

    if (g == 0 && h == 0) outPt.lng = lonCenters[srctype];
    else outPt.lng = Math.atan(g / h) + lonCenters[srctype];
  }

  pointGeo.lng = pointGeo.lng - falseEastings[srctype];
  pointGeo.lat = pointGeo.lat - falseNorthings[srctype];

  const con = (src[srctype] + pointGeo.lat / scaleFactors[srctype]) / majors[srctype];
  var phi = con;

  let i = 0;
  while (true) {
    const delta_Phi =
      (con +
        e1fn(es[srctype]) * Math.sin(2.0 * phi) -
        e2fn(es[srctype]) * Math.sin(4.0 * phi) +
        e3fn(es[srctype]) * Math.sin(6.0 * phi)) /
        e0fn(es[srctype]) -
      phi;
    phi = phi + delta_Phi;

    if (Math.abs(delta_Phi) <= EPSLN) break;

    if (i >= nMaxIter) {
      break;
    }
    i++;
  }

  if (Math.abs(phi) < PI / 2) {
    const sin_phi = Math.sin(phi);
    const cos_phi = Math.cos(phi);
    const tan_phi = Math.tan(phi);
    const c = esp[srctype] * cos_phi * cos_phi;
    const cs = c * c;
    const t = tan_phi * tan_phi;
    const ts = t * t;
    const cont = 1.0 - es[srctype] * sin_phi * sin_phi;
    const n = majors[srctype] / Math.sqrt(cont);
    const r = (n * (1.0 - es[srctype])) / cont;
    const d = pointGeo.getLon() / (n * scaleFactors[srctype]);
    const ds = d * d;
    outPt.lat =
      phi -
      ((n * tan_phi * ds) / r) *
        (0.5 -
          (ds / 24.0) *
            (5.0 +
              3.0 * t +
              10.0 * c -
              4.0 * cs -
              9.0 * esp[srctype] -
              (ds / 30.0) * (61.0 + 90.0 * t + 298.0 * c + 45.0 * ts - 252.0 * esp[srctype] - 3.0 * cs)));
    outPt.lng =
      lonCenters[srctype] +
      (d *
        (1.0 -
          (ds / 6.0) *
            (1.0 +
              2.0 * t +
              c -
              (ds / 20.0) * (5.0 - 2.0 * c + 28.0 * t - 3.0 * cs + 8.0 * esp[srctype] + 24.0 * ts)))) /
        cos_phi;
  } else {
    outPt.lat = PI * 0.5 * Math.sin(pointGeo.lat);
    outPt.lng = lonCenters[srctype];
  }

  outPt = transform(srctype, GT_GEO, outPt);

  return outPt;
}

// 위치 좌표계를 평면 좌표계로 변환
function geo2tm(dstType, inPt, outPt) {
  var x = 0.0;
  var y = 0.0;

  inPt = transform(GT_GEO, dstType, inPt);

  const deltaLon = inPt.lng - lonCenters[dstType];
  const sinPhi = Math.sin(inPt.lat);
  const cosphi = Math.cos(inPt.lat);

  if (ind[dstType] != 0) {
    const b = cosphi * Math.sin(deltaLon);

    if (Math.abs(Math.abs(b) - 1.0) < EPSLN) {
    }
  } else {
    var b = 0;
    x = 0.5 * majors[dstType] * scaleFactors[dstType] * Math.log((1.0 + b) / (1.0 - b));
    var con = Math.acos((cosphi * Math.cos(deltaLon)) / Math.sqrt(1.0 - b * b));

    if (inPt.lat < 0) {
      con = con * -1;
      y = majors[dstType] * scaleFactors[dstType] * (con - latCenters[dstType]);
    }
  }

  const al = cosphi * deltaLon;
  const als = al * al;
  const c = esp[dstType] * cosphi * cosphi;
  const tq = Math.tan(inPt.lat);
  const t = tq * tq;
  const cont = 1.0 - es[dstType] * sinPhi * sinPhi;
  const n = majors[dstType] / Math.sqrt(cont);
  const ml =
    majors[dstType] * mlfn(e0fn(es[dstType]), e1fn(es[dstType]), e2fn(es[dstType]), e3fn(es[dstType]), inPt.lat);

  outPt.lng =
    scaleFactors[dstType] *
      n *
      al *
      (1.0 + (als / 6.0) * (1.0 - t + c + (als / 20.0) * (5.0 - 18.0 * t + t * t + 72.0 * c - 58.0 * esp[dstType]))) +
    falseEastings[dstType];

  outPt.lat =
    scaleFactors[dstType] *
      (ml -
        dst[dstType] +
        n *
          tq *
          (als *
            (0.5 +
              (als / 24.0) *
                (5.0 -
                  t +
                  9.0 * c +
                  4.0 * c * c +
                  (als / 30.0) * (61.0 - 58.0 * t + t * t + 600.0 * c - 330.0 * esp[dstType]))))) +
    falseNorthings[dstType];

  return outPt;
}

// 좌표계 변환
var convert = function convert(srcType, dstType, inPt) {
  init();

  var pointGeo1 = {
    lat: 0.0,
    lng: 0.0,
    height: 0.0,
  };
  var pointGeo2 = {
    lat: 0.0,
    lng: 0.0,
    height: 0.0,
  };

  if (srcType == GT_GEO) {
    pointGeo1.lng = D2R(inPt.lng);
    pointGeo1.lat = D2R(inPt.lat);
  } else {
    pointGeo1 = tm2geo(srcType, inPt, pointGeo1);
  }

  if (dstType == GT_GEO) {
    pointGeo2.lng = R2D(pointGeo1.lng);
    pointGeo2.lat = R2D(pointGeo1.lat);
  } else {
    pointGeo2 = geo2tm(dstType, pointGeo1, pointGeo2);
  }

  return pointGeo2;
};

export { convert };
