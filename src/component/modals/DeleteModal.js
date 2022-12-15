import { Modal, Header, Button, Item } from "semantic-ui-react";

export default function DeleteModal(props) {
  const confirmClick = () => {
    props.handleClose();
  };

  const crsNameVal = props.crsNameVal;
  const holeNameVal = props.holeNameVal.replace(" 홀", "");

  return (
    <Modal
      className="deleteWrap"
      open={props.modalOpen}
      size="small"
      closeOnEscape={true}
      closeOnRootNodeClick={true}
      style={{ width: "300px" }}
    >
      <Header
        content={
          // `${crsNameVal} ${holeNameVal}Hole`
          "삭제 팝업"
        }
        style={{ borderWidth: "0", padding: "14px" }}
      />
      <Modal.Content style={{ display: "flex", paddingBottom: "5px", padding: "14px" }}>
        <Item>정보를 삭제하시겠습니까?</Item>
      </Modal.Content>
      <Modal.Actions style={{ display: "flex", justifyContent: "flex-end", borderWidth: "0", padding: "14px" }}>
        <Button
          type="button"
          className="red"
          onClick={confirmClick}
          style={{ padding: "7px 25px", marginRight: "20px" }}
          content="삭제"
        />
        <Button
          type="button"
          className="gray"
          style={{ background: "#757675", color: "#fff", padding: "7px 25px", marginLeft: "0" }}
          onClick={confirmClick}
          content="취소"
        />
      </Modal.Actions>
    </Modal>
  );
}
