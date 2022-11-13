import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const CreateOrJoin = () => {
  const { setCreateDaoOpen } = useContext(DaoContext);

  return (
    <div>
      <h2 className="text-start font-Roboto font-medium text-xl ml-4 text-white mt-14">
        What do you wanna do?
      </h2>
      <div className="grid gap-x-5 w-2/3 mx-auto mt-12 grid-flow-col">
        <button
          className="h-20 w-40 rounded-lg text-xl font-semibold font-Roboto bg-white shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white"
          onClick={() => setCreateDaoOpen(true)}
        >
          Create A DAO
        </button>
        <button className="bg-white h-20 w-40 rounded-lg text-xl font-semibold font-Roboto shadow-md hover:scale-110 ease-out transition delay-150 hover:bg-indigo-600 hover:text-white">
          Join A DAO
        </button>
      </div>
    </div>
  );
};

export default CreateOrJoin;
