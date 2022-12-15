Object.defineProperty(exports, "__esModule", {
  value: true,
});
exports.Button = undefined;

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }
  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var _react = require("react");

var _react2 = _interopRequireDefault(_react);

var _reactcss = require("reactcss");

var _reactcss2 = _interopRequireDefault(_reactcss);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _possibleConstructorReturn(self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return call && (typeof call === "object" || typeof call === "function") ? call : self;
}

function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: { value: subClass, enumerable: false, writable: true, configurable: true },
  });
  if (superClass)
    Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : (subClass.__proto__ = superClass);
}

var Button = (exports.Button = function Button(_ref) {
  _inherits(Button, _ref);

  function Button(props) {
    _classCallCheck(this, Button);

    var _this = _possibleConstructorReturn(this, (Button.__proto__ || Object.getPrototypeOf(Button)).call(this));
    _this.rgb = props.rgb;
    _this.close = props.displayColorPicker;
    _this.save = props.save;

    _this.state = {
      value: String(props.value).toUpperCase(),
      blurValue: String(props.value).toUpperCase(),
    };

    return _this;
  }

  _createClass(Button, [
    {
      key: "componentDidUpdate",
      value: function componentDidUpdate(prevProps, prevState) {
        if (
          this.props.value !== this.state.value &&
          (prevProps.value !== this.props.value || prevState.value !== this.state.value)
        ) {
          if (this.input === document.activeElement) {
            this.setState({ blurValue: String(this.props.value).toUpperCase() });
          } else {
            this.setState({
              value: String(this.props.value).toUpperCase(),
              blurValue: !this.state.blurValue && String(this.props.value).toUpperCase(),
            });
          }
        }
      },
    },

    {
      key: "render",
      value: function render() {
        var _this2 = this;

        var styles = (0, _reactcss2.default)({
          default: {
            wrap: {
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
              paddingBottom: "10px",
            },
            btn: {
              borderRadius: this.props.radius,
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
              fontSize: "12px",
              color: "#333",
              cursor: "pointer",
            },
            container: {
              padding: "0 2px",
              position: "relative",
              height: "100%",
              borderRadius: this.props.radius,
            },

            slider: {
              // marginTop: "1px",
              width: "4px",
              borderRadius: "1px",
              height: "10px",
              boxShadow: "0 0 2px rgba(0, 0, 0, 0.6)",
              background: "#fff",
              transform: "translateX(-2px)",
            },
          },
          vertical: {},
        });
        return _react2.default.createElement(
          "div",
          { style: styles.wrap },
          _react2.default.createElement(
            "button",
            { style: styles.btn, className: "save_btn", onClick: _this2.save },
            "SAVE"
          ),
          _react2.default.createElement(
            "button",
            { style: styles.btn, className: "ok_btn", onClick: _this2.close },
            "OK"
          )
        );
      },
    },
  ]);

  return Button;
})(_react.PureComponent || _react.Component);

exports.default = Button;
