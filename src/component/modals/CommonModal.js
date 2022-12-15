import React from "react";
import { Modal, Header, Button } from "semantic-ui-react";
import PropTypes from "prop-types";

class CommonModal extends React.Component {
  confirmClick = (event, data) => {
    this.props.handleClose();
  };

  render() {
    return (
      <Modal open={this.props.modalOpen} size="small" closeOnEscape={true} closeOnRootNodeClick={true}>
        <Header icon="browser" content="알림" />
        <Modal.Content>
          <h3>{this.props.contents}</h3>
        </Modal.Content>
        <Modal.Actions>
          <Button positive onClick={this.confirmClick} content="확인" />
        </Modal.Actions>
      </Modal>
    );
  }
}

CommonModal.propTypes = {
  modalOpen: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  contents: PropTypes.string.isRequired,
};

export default CommonModal;
