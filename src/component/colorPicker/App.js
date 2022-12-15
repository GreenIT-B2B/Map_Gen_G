import React from "react";
import reactCSS from "reactcss";
import Sketch from "./Sketch";

class SketchExample extends React.Component {
  state = {
    displayColorPicker: false,
    color: {
      r: Math.floor(Math.random() * 250),
      g: Math.floor(Math.random() * 250),
      b: Math.floor(Math.random() * 250),
      // r: "241",
      // g: "112",
      // b: "19",
      a: "1",
    },
    hex: "#000",
  };

  handleClick = () => {
    this.setState({ displayColorPicker: !this.state.displayColorPicker });
    if (this.props.onSketch) {
      this.props.onSketch(true);
    }
  };

  handleClose = (event) => {
    this.setState({ displayColorPicker: false });
    if (this.props.onSketch) {
      this.props.onSketch(false);
    }
    if (document.querySelector(`.colorPickGroupNum${this.props.isPage}colorNum${this.props.index}`)) {
      document.querySelector(`.colorPickGroupNum${this.props.isPage}colorNum${this.props.index}`).style.background =
        "#" + document.querySelector(".hexInput").value;
      document
        .querySelector(`.colorPickGroupNum${this.props.isPage}colorNum${this.props.index}`)
        .setAttribute("color", "#" + document.querySelector(".hexInput").value);
    } else if (document.querySelector(".colorPickerWrap")) {
      document.querySelector(".colorPickerWrap").style.background = "#" + document.querySelector(".hexInput").value;
      document.querySelector(".colorPickerWrap").setAttribute("color", "#" + document.querySelector(".hexInput").value);
    }
  };
  coverClose = (event) => {
    this.setState({ displayColorPicker: false });
    if (this.props.onSketch) {
      this.props.onSketch(false);
    }
  };

  handleChange = (color) => {
    this.setState({ color: color.rgb });
    this.setState({ hex: color.hex });
    // console.log(this.state.hex);
  };

  render() {
    const colorPickerindex = this.props.index;
    const isSketch = this.props.isSketch;
    const checkGroup = this.props.isPage;
    const groupNum = this.props.groupNum;
    var hex = this.state.hex;
    const ok_btn = document.querySelector(".ok_btn");

    if (ok_btn !== null) {
      // console.log(this.state.color);
      ok_btn.addEventListener("click", () => {
        if (checkGroup) {
          const myColorPick = document.querySelector(`.colorPickGroupNum${checkGroup}colorNum${colorPickerindex}`);
          myColorPick.style.background = `${hex}`;
          myColorPick.setAttribute("color", `${hex}`);
        } else if (isSketch) {
          const myColorPick = document.querySelector(".colorPickerWrap");

          myColorPick.setAttribute("color", `${hex}`);
        }
      });
    }
    if (document.querySelector(".hexInput")) {
      hex = "#" + document.querySelector(".hexInput").value;
    }

    const styles = reactCSS({
      default: {
        myColorPick: {
          width: "20px",
          height: "20px",
          borderRadius: ".28571429rem",
          border: "1px solid rgba(34,36,38,.15)",
          textShadow: "0 1px 0 #fff",
          marginRight: "2px",
        },
        swatch: {
          padding: "5px",
          background: "#fff",
          borderRadius: "1px",
          boxShadow: "0 0 0 1px rgba(0,0,0,.1)",
          display: "inline-block",
          cursor: "pointer",
        },
        popover: { position: "absolute", zIndex: "9999" },
        cover: {
          position: "fixed",
          top: "0px",
          right: "0px",
          bottom: "0px",
          left: "0px",
        },
      },
    });

    return (
      <>
        <div
          // key="colorPickerBlock"
          style={styles.myColorPick}
          className={
            colorPickerindex
              ? `colorPickGroupNum${groupNum + 1}colorNum${colorPickerindex} colorPickerWrap`
              : `colorPickerWrap`
          }
          onClick={this.handleClick}
          color="#fff"
        />

        {this.state.displayColorPicker ? (
          <div style={styles.popover} className="colorPickerBg">
            <div style={styles.cover} onClick={this.coverClose} />
            <Sketch
              key={"colorPickerWrap"}
              color={this.state.color}
              onChange={this.handleChange}
              displayColorPicker={this.handleClose}
            />
          </div>
        ) : null}
      </>
    );
  }
}

export default SketchExample;
