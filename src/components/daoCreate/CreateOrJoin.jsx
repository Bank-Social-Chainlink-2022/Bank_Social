import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const CreateOrJoin = () => {
  const { setCreateDaoOpen, setJoinDaoOpen } = useContext(DaoContext);

  const openCreateDaoForm = () => {
    setCreateDaoOpen(true);
    setJoinDaoOpen(false);
  };

  const openDaoListPage = () => {
    setCreateDaoOpen(false);
    setJoinDaoOpen(true);
  };
  return (
    <div>
      <h2 className="text-start font-Roboto font-medium text-3xl ml-4 text-white mt-20">
        What do you wanna do?
      </h2>
      <div className="grid gap-x-10 w-2/3 mx-auto mt-20 grid-flow-col">
        <button
          className="h-20 w-40 rounded-lg text-xl font-semibold font-Roboto bg-white shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white"
          onClick={() => openCreateDaoForm()}
        >
          Create A DAO
        </button>
        <button
          className="bg-white h-20 w-40 rounded-lg text-xl font-semibold font-Roboto shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white"
          onClick={() => openDaoListPage()}
        >
          Join A DAO
        </button>
      </div>
      <div className="flex justify-center mt-20">
        <p className="text-white">PS: It's gonna be fun.</p>
      </div>
    </div>
  );
};

export default CreateOrJoin;
