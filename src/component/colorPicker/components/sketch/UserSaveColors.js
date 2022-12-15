Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.UserSaveColors = undefined;

var _extends =
  Object.assign ||
  function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _propTypes = require("prop-types");

var _propTypes2 = _interopRequireDefault(_propTypes);

var _reactcss = require("reactcss");

var _reactcss2 = _interopRequireDefault(_reactcss);

var _common = require("../common");

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

var UserSaveColors = (exports.UserSaveColors = function UserSaveColors(_ref) {
  var colors = _ref.colors,
    rgb = _ref.rgb,
    _ref$onClick = _ref.onClick,
    onClick = _ref$onClick === undefined ? function () {} : _ref$onClick,
    onSwatchHover = _ref.onSwatchHover;
  var displayColorPicker = _ref.displayColorPicker;

  var styles = (0, _reactcss2.default)(
    {
      default: {
        colors: {
          margin: "0 -10px",
          padding: "10px 0 0 10px",
          borderTop: "1px solid #eee",
          display: "flex",
          flexWrap: "wrap",
          position: "relative",
        },
        swatchWrap: {
          width: "16px",
          height: "16px",
          margin: "0 10px 10px 0",
        },
        swatch: {
          borderRadius: "3px",
          boxShadow: "inset 0 0 0 1px rgba(0,0,0,.15)",
          position: "rerative",
        },
        input: {
          position: "absolute",
          margin: "0",
          width: "16px",
          height: "16px",
          cursor: "pointer",
          opacity: "0",
        },
      },
      "no-presets": {
        colors: {
          display: "none",
        },
      },
    },
    {
      "no-presets": !colors || !colors.length,
    }
  );

  const userSaveColor = document.querySelector("input[name='userSaveColor']:checked");
  const userSaveColors = document.querySelectorAll("input[name='userSaveColor']");
  userSaveColors.forEach((el, index) => {
    if (colors[index] !== "") {
      el.setAttribute("color", colors[index]);
    }
  });

  if (userSaveColor) {
    userSaveColor.parentNode.style.background = "rgb(" + _ref.rgb.r + "," + _ref.rgb.g + "," + _ref.rgb.b + ")";
    userSaveColor.setAttribute("color", _ref.hex);
  }

  var SaveClick = function handleClick(hex, e) {
    const defaultColor = document.querySelector("input[name='defaultColor']:checked");
    if (defaultColor) {
      defaultColor.checked = false;
    }
    const userColor = document.querySelectorAll(".userColor");
    userColor.forEach((el) => {
      el.style.boxShadow = "rgb(0 0 0 / 15%) 0px 0px 0px 0px inset";
    });
    e.target.parentNode.parentNode.parentNode.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ";
    const save_btn = document.querySelector(".save_btn");
    save_btn.style.color = "#333";
    save_btn.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 0px 2px";
  };
  var handleClick = function handleClick(hex, e) {
    const defaultColor = document.querySelector("input[name='defaultColor']:checked");
    if (defaultColor) {
      defaultColor.checked = false;
    }
    const userColor = document.querySelectorAll(".userColor");
    userColor.forEach((el) => {
      el.style.boxShadow = "rgb(0 0 0 / 15%) 0px 0px 0px 0px inset";
    });
    e.target.parentNode.parentNode.parentNode.style.boxShadow = "inset 0 0 0 1px rgba(0,0,0,.15), 0 0 4px ";
    const save_btn = document.querySelector(".save_btn");
    save_btn.style.color = "#333";
    save_btn.style.boxShadow = "rgba(0, 0, 0, 0.6) 0px 0px 2px";

    onClick(
      {
        hex: hex,
        source: "hex",
      },
      e
    );
  };

  var save = function () {
    const userSaveColor = document.querySelectorAll("input[name='userSaveColor']");
    userSaveColor.forEach((el) => {
      colors[el.id] = el.getAttribute("color");
    });
  };

  return _react2.default.createElement(
    "div",
    { style: styles.colors, className: "flexbox-fix" },
    colors.map(function (colorObjOrString, index) {
      var c = typeof colorObjOrString === "string" ? { color: colorObjOrString } : colorObjOrString;
      var key = index;
      return _react2.default.createElement(
        "div",
        { key: key, style: styles.swatchWrap, className: "userColor" },
        _react2.default.createElement(
          _common.Swatch,
          _extends({}, c, {
            style: styles.swatch,
            onClick: colors[index] === "" ? SaveClick : handleClick,
            onHover: onSwatchHover,
          }),
          _react2.default.createElement("input", {
            style: styles.input,
            type: "radio",
            name: "userSaveColor",
            id: index,
            color: colors[index],
          })
        )
      );
    }),
    _react2.default.createElement(_common.Button, { rgb: rgb, save: save, displayColorPicker: displayColorPicker })
  );
});

UserSaveColors.propTypes = {
  colors: _propTypes2.default.arrayOf(
    _propTypes2.default.oneOfType([
      _propTypes2.default.string,
      _propTypes2.default.shape({
        color: _propTypes2.default.string,
        title: _propTypes2.default.string,
      }),
    ])
  ).isRequired,
};

exports.default = UserSaveColors;
