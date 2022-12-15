import React, { useEffect, useState } from "react";

export default function AddCours(props) {
  const countInput = props.countInput;

  const labelStyle = {
      background: "#fff",
      color: "#000",
      width: "20px",
      height: "20px",
      border: "1px solid #DEDFDF",
      "border-radius": "2px",
      display: "inline-block",
      "text-align": "center",
      cursor: "pointer",
      margin: "0 0 0 5px",
    },
    active = {
      background: "#4282CA",
      color: "#fff",
      width: "20px",
      height: "20px",
      border: "1px solid #DEDFDF",
      "border-radius": "2px",
      display: "inline-block",
      "text-align": "center",
      cursor: "pointer",
      margin: "0 0 0 5px",
    };

  useEffect(() => {
    const menuitem = document.querySelectorAll(".menuitem")[props.isPage - 1];
    if (menuitem) {
      menuitem.querySelectorAll(".addCours > div label input").forEach((el) => {
        if (document.querySelectorAll(".addCours > div label input").length === 1) {
          document.querySelectorAll(".addCours > div label input")[0].checked = true;
        }
        el.onchange = (e) => {
          props.findGroup(e.target.value);
          const width = document.querySelector(".coursName").getBoundingClientRect().width;
          let transition = width * (e.target.value - 1);
          document.querySelectorAll(".coursNameInner")[
            props.isPage - 1
          ].style.transform = `translateX(${-transition}px)`;

          document.querySelectorAll(".addCours > div label").forEach((el) => {
            el.setAttribute(
              "style",
              JSON.stringify(labelStyle).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
            );
          });
          if (el.value === e.target.value) {
            e.target.parentNode.setAttribute(
              "style",
              JSON.stringify(active).replace(/"/g, "").replace(/,/g, "; ").replace(/{/g, "").replace(/}/g, "")
            );
          }
        };
      });
    }
  });

  return (
    <div
      className="addCours"
      style={{
        display: "flex",
        width: "54%",
        height: "41px",
        overflowY: "scroll",
      }}
    >
      <div>
        {countInput.map((list, index) => {
          return (
            <label
              key={"addCours" + index}
              htmlFor={`addCours${props.index + 1}_COURS${index + 1}`}
              style={{
                width: "20px",
                height: "20px",
                border: "1px solid #DEDFDF",
                borderRadius: "2px",
                display: "inline-block",
                textAlign: "center",
                cursor: "pointer",
                margin: "0 0 0 5px",
              }}
            >
              <input
                name={`addCours${props.index + 1}Radio`}
                id={`addCours${props.index + 1}_COURS${index + 1}`}
                className="gropInputRadio"
                type="radio"
                value={index + 1}
                style={{
                  position: "absolute",
                  top: "0",
                  opacity: "0",
                }}
              />
              {index + 1}
            </label>
          );
        })}
      </div>
    </div>
  );
}
