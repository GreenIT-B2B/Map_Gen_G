import { Menu, Button, Input } from "semantic-ui-react";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { btnModalRedux } from "store/reducers/btnModalReducer";
import { searchRedux } from "store/reducers/searchReducer";

export default function SearchModal(props) {
  const searchReducer = useSelector((state) => state.searchReducer.searchReducer);
  const newwsReducer = useSelector((state) => state.newWorkSpace.newWorkSpace);

  const dispatch = useDispatch();

  useEffect(() => {
    const searchWrap = document.querySelector(".searchWrap");

    if (searchWrap) {
      searchWrap.parentNode.style.background = "rgba(255,255,255,0)";
      document.querySelector(".searchInput").onfocus = (event) => {
        event.target.style.border = "border: 1px solid #85b7d9";
      };
    }
  }, []);

  const onClick = (e, target, value) => {
    dispatch(btnModalRedux(value));
  };

  useEffect(() => {
    console.log(searchReducer);
  }, [searchReducer]);
  return (
    <>
      {newwsReducer.isModal ? (
        <Menu
          vertical
          className="searchWrap"
          style={{
            position: "absolute",
            bottom: "-3.5%",
            right: "0.3%",
            width: "165px",
            // height: "100px",
            zIndex: "2000",
          }}
        >
          <Menu.Item
            style={{
              background: "#fff",
              borderRadius: "3px",
              padding: "10px 5px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Input
              type="text"
              className="searchInput"
              placeholder="키워드 검색..."
              style={{
                height: "32px",
                padding: "0",
                borderRadius: "5px",
              }}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  const data = event.target.value;
                  dispatch(searchRedux(data));
                  setTimeout(() => {
                    event.target.value = "";
                  }, 10);
                }
              }}
            />
          </Menu.Item>
          {/* <Dropdown
            text="코스"
            // direction="left"
            pointing="bottom left"
            className="searchDropDown"
            style={{
              display: "flex",
              flexDirection: "row-reverse",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "10px 5px",
            }}
          >
            <Dropdown.Menu>
              {newwsReducer.contents
                ? newwsReducer.contents.compData[0].courData.map((cours, index) => {
                    return (
                      <Dropdown.Item key={cours.crsCd} text={cours.crsName} text2={cours} onClick={handleSelCrs} />
                    );
                  })
                : ""}
            </Dropdown.Menu>
          </Dropdown> */}
          <Menu.Item
            className="searchBtnModalWrap"
            style={{
              padding: "0",
              pointerEvents: "auto",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "5px 10px",
            }}
          >
            <Button
              style={{ width: "48%", fontSize: "12px", color: "rgba(3,3,3,0.5)" }}
              onClick={(e, target) => {
                onClick(e, target, "X");
              }}
            >
              취소
            </Button>
            <Button
              className="blue"
              style={{ width: "48%", fontSize: "12px", marginRight: "0", color: "rgba(3,3,3,0.5)" }}
              onClick={(e, target) => {
                onClick(e, target, "S");
              }}
            >
              저장
            </Button>
          </Menu.Item>
        </Menu>
      ) : (
        ""
      )}
    </>
  );
}
