import React, { useContext } from "react";
import { useState } from "react";
import CreateDao from "./CreateDao";
import DetailsForDao from "./DetailsForDao";
import DiscordIntegration from "./DiscordIntegration";
import ReviewInfo from "./ReviewInfo";
import CreateOrJoin from "./CreateOrJoin";

import { DaoContext } from "../../context/DaoContext";

import { useCreateDAO } from "wagmi-banksocial";

const Form = () => {
  const { setOpenModalBox, openModalBox, createDaoOpen, contractCreateDAO } =
    useContext(DaoContext);
  const [page, setPage] = useState(0);

  const FormTitles = [
    "Create a DAO",
    "Enter Details",
    "Discord Integration",
    "Review",
  ];

  const PageDisplay = () => {
    if (page === 0) {
      return <CreateDao />;
    }
    if (page === 1) {
      return <DetailsForDao />;
    }
    if (page === 2) {
      return <DiscordIntegration />;
    } else if (page === 3) {
      return <ReviewInfo />;
    }
  };
  return (
    <div className="h-full w-full">
      {!createDaoOpen ? (
        <CreateOrJoin />
      ) : (
        <div>
          <div className="flex justify-center">
            <div className="progressbar">
              <div
                style={{
                  width:
                    page === 0
                      ? "25%"
                      : page === 1
                      ? "50%"
                      : page === 2
                      ? "75%"
                      : "100%",
                }}
              ></div>
            </div>
          </div>
          <p className="text-white text-xl font-bold bg-clip-text bg-gradient-to-r from-white via-sky-400 to-indigo-700 text-transparent">
            {FormTitles[page]}
          </p>
          <div>{PageDisplay()}</div>
          <div className="flex justify-center mt-5">
            <button
              hidden={page === 0}
              className="rounded-md bg-blue-500 py-2 px-7 text-white font-Roboto font-semibold mr-3"
              onClick={() => {
                setPage((currpage) => currpage - 1);
              }}
            >
              Previous
            </button>
            <button
              className="rounded-md bg-blue-500 py-2 px-7 text-white font-Roboto font-semibold"
              onClick={() => {
                if (page === FormTitles.length - 1) {
                } else {
                  setPage((currpage) => currpage + 1);
                }
              }}
            >
              {page === FormTitles.length - 1 ? "Launch Dao 🚀" : "Next"}
            </button>
            <button
              className="rounded-md bg-blue-500 py-2 px-7 text-white font-Roboto font-semibold"
              onClick={() => contractCreateDAO()}
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Form;
