import React, { useState, useContext } from "react";
import Modal from "react-modal";
//import CreateOrJoin from "./CreateOrJoin";
import { Form } from ".";
import { DaoContext } from "../context/DaoContext";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgb(6, 3, 36)",
    height: "400px",
    width: "600px",
    border: "4px solid rgb(119, 3, 173)",
    borderRadius: "50px",
    zIndex: "50",
  },
};

function ModalBox(props) {
  const { openModalBox, setOpenModalBox } = useContext(DaoContext);

  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "white";
  }

  function closeModal() {
    setOpenModalBox(false);
  }

  return (
    <div>
      <Modal
        isOpen={openModalBox}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
      >
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          className="text-center font-Bangers font-semibold text-3xl"
        >
          Let's Get You Started &nbsp; 💜
        </h2>

        {/* Place for the content of the modal */}
        <Form />
        {/* <ConnectButton /> */}

        <div className="mt-16 flex justify-center">
          <button
            onClick={closeModal}
            className="text-white bg-red-500 rounded-md hover:bg-red-700 h-8 w-24"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalBox;
