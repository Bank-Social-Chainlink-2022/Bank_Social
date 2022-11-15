import React, { useState, useContext } from "react";
import Modal from "react-modal";
//import CreateOrJoin from "./CreateOrJoin";
import { Form, CreateOrJoin, DaoList } from ".";

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
    height: "500px",
    width: "600px",
    border: "4px solid rgb(119, 3, 173)",
    borderRadius: "50px",
    zIndex: "50",
  },
};

function ModalBox(props) {
  const {
    openModalBox,
    setOpenModalBox,
    createDaoOpen,
    setCreateDaoOpen,
    joinDaoOpen,
    setJoinDaoOpen,
  } = useContext(DaoContext);

  let subtitle;

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = "white";
  }

  function closeModal() {
    setOpenModalBox(false);
    setCreateDaoOpen(false);
    setJoinDaoOpen(false);
  }

  const goBack = () => {
    setCreateDaoOpen(false);
    setJoinDaoOpen(false);
  };
  return (
    <div>
      <Modal
        isOpen={openModalBox}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
        ariaHideApp={false}
        shouldCloseOnOverlayClick={false}
      >
        <h2
          ref={(_subtitle) => (subtitle = _subtitle)}
          className="text-center font-Roboto font-semibold text-3xl mt-5"
        >
          Let's Get You Started &nbsp; 💜
        </h2>

        {/* Place for the content of the modal */}
        {!createDaoOpen && !joinDaoOpen ? <CreateOrJoin /> : <></>}
        {createDaoOpen && !joinDaoOpen ? <Form /> : <></>}
        {!createDaoOpen && joinDaoOpen ? <DaoList /> : <></>}

        <div className="mt-3 absolute left-0 top-0 ml-5">
          <button
            onClick={closeModal}
            className="text-white bg-red-500 rounded-md hover:bg-red-700 h-7 w-16 float-right"
          >
            Close
          </button>
        </div>
        <div className="mt-3 absolute right-4 top-0 ml-5">
          <button
            onClick={goBack}
            className="text-white hover:bg-gray-400 h-7 w-16 float-right rounded-md"
          >
            Back
          </button>{" "}
        </div>
      </Modal>
    </div>
  );
}

export default ModalBox;
