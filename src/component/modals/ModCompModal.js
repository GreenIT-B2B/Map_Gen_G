import React from "react";
import { Modal, Header, Button } from "semantic-ui-react";
import PropTypes from "prop-types";

class ModCompModal extends React.Component {
  confirmClick = (event, data) => {
    this.props.handleClose();
  };

  render() {
    return (
      <Modal open={this.props.modalOpen} size="small" closeOnEscape={true} closeOnRootNodeClick={true}>
        <Header icon="browser" content="업장 수정" />
        <Modal.Content>
          <h3>업장 수정은 추후 업데이트합니다.</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.confirmClick} content="Ok" />
        </Modal.Actions>
      </Modal>
    );
  }
}

ModCompModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  valueIntoModal: PropTypes.string.isRequired,
};

export default ModCompModal;
