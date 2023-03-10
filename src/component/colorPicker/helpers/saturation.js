Object.defineProperty(exports, "__esModule", {
  value: true,
});
var calculateChange = (exports.calculateChange = function calculateChange(e, hsl, container) {
  var _container$getBoundin = container.getBoundingClientRect(),
    containerWidth = _container$getBoundin.width,
    containerHeight = _container$getBoundin.height;

  var x = typeof e.pageX === "number" ? e.pageX : e.touches[0].pageX;
  var y = typeof e.pageY === "number" ? e.pageY : e.touches[0].pageY;
  var left = x - (container.getBoundingClientRect().left + window.pageXOffset);
  var top = y - (container.getBoundingClientRect().top + window.pageYOffset);

  if (left < 0) {
    left = 0;
  } else if (left > containerWidth) {
    left = containerWidth;
  }

  if (top < 0) {
    top = 0;
  } else if (top > containerHeight) {
    top = containerHeight;
  }

  var saturation = left / containerWidth;
  var bright = 1 - top / containerHeight;

  return {
    h: hsl.h,
    s: saturation,
    v: bright,
    a: hsl.a,
    source: "hsv",
  };
});
