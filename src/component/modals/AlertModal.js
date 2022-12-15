import React from "react";
import { Modal, Header, Button } from "semantic-ui-react";

export default function AlertModal(props) {
  const confirmClick = () => {
    props.handleClose();
  };
  return (
    <Modal open={props.modalOpen} size="small" closeOnEscape={true} closeOnRootNodeClick={true}>
      <Header icon="browser" content="알림" />
      <Modal.Content>
        <h3>{props.contents}</h3>
      </Modal.Content>
      <Modal.Actions>
        <Button positive onClick={confirmClick} content="확인" />
      </Modal.Actions>
    </Modal>
  );
}
