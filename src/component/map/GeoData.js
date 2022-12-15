import { calcGeoPosOnImage, calcGeoPosOnTouch } from "./GeoMath";

var convGeos2LatLngs = function convGeos2LatLngs(geos) {
  var rectMbr = [];

  for (let i = 0; i < geos.length; i++) {
    rectMbr.push(new window.kakao.maps.LatLng(geos[i].lat, geos[i].lng));
  }

  return rectMbr;
};

export { convGeos2LatLngs };

var convLatLngs2Geos = function convLatLngs2Geos(latlng) {
  var rectGeos = [];

  for (let i = 0; i < latlng.length; i++) {
    var geo = {
      lat: latlng[i].getLat(),
      lng: latlng[i].getLng(),
    };

    rectGeos.push(geo);
  }

  return rectGeos;
};

export { convLatLngs2Geos };

var convLatLng2Geo = function convLatLng2Geo(latlng) {
  var rectGeos = {
    lat: latlng.getLat(),
    lng: latlng.getLng(),
  };

  return rectGeos;
};

export { convLatLng2Geo };

var convCoords2LatLngs = function convCoords2LatLngs(mbr, coords, geoMapSize, viewSize) {
  var rectMbr = [];

  for (let i = 0; i < coords.length; i++) {
    const geo = calcGeoPosOnTouch(mbr, coords[i].x, coords[i].y, geoMapSize, viewSize);
    rectMbr.push(new window.kakao.maps.LatLng(geo.lat, geo.lng));
  }

  return rectMbr;
};

export { convCoords2LatLngs };

var convBounds2Mbr = function convBounds2Mbr(bounds) {
  var mapMbr = [];

  var swLatlng = bounds.getSouthWest();
  var neLatlng = bounds.getNorthEast();

  var geo = {
    lat: neLatlng.getLat(),
    lng: swLatlng.getLng(),
  };
  mapMbr.push(geo);
  geo = {
    lat: neLatlng.getLat(),
    lng: neLatlng.getLng(),
  };
  mapMbr.push(geo);
  geo = {
    lat: swLatlng.getLat(),
    lng: neLatlng.getLng(),
  };
  mapMbr.push(geo);
  geo = {
    lat: swLatlng.getLat(),
    lng: swLatlng.getLng(),
  };
  mapMbr.push(geo);

  return mapMbr;
};

export { convBounds2Mbr };
