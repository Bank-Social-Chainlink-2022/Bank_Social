import React from 'react'
import Modal from 'react-modal';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    backgroundColor: "rgb(6, 3, 36)",
    height: "400px",
    width: "600px",
    border: "4px solid rgb(119, 3, 173)",
    borderRadius: "50px",
  },
};

const ModalBox = () => {
  let subtitle;
  const [modalIsOpen, setIsOpen] = React.useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function afterOpenModal() {
    // references are now sync'd and can be accessed.
    subtitle.style.color = 'white';
  }

  function closeModal() {
    setIsOpen(false);
  }


  return (
    <div>
      <button onClick={openModal} className="bg-white">Open Modal</button>
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      > 
        <h2 ref={(_subtitle) => (subtitle = _subtitle)} className="text-center font-Bangers font-semibold text-3xl">Let's Get You Started 💜</h2>
        <h2 className='text-start font-Roboto font-medium text-xl ml-4 text-white mt-14'>What do you wanna do?</h2>
        <div className='grid gap-x-5 w-2/3 mx-auto mt-12 grid-flow-col'>
        <button className='h-20 w-40 rounded-lg text-xl font-semibold font-Roboto bg-white shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white'>Create A DAO</button>
        <button className='bg-white h-20 w-40 rounded-lg text-xl font-semibold font-Roboto shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white'>Join A DAO</button>
        </div>
        <div className="mt-16 flex justify-center">
        <button onClick={closeModal} className="text-white bg-red-500 rounded-md hover:bg-red-700 h-8 w-24">Close</button>
        </div>
        
      </Modal>
    </div>

  )
}


export default ModalBox;