import React from "react";
import { useState } from "react";
import CreateDao from "./CreateDao";
import DaoCategories from "./DaoCategories";
import DetailsForDao from "./DetailsForDao";
import DiscordIntegration from "./DiscordIntegration";
import ReviewInfo from "./ReviewInfo";
import "../App.css"

const FormInputs = () => {
  const [page, setPage] = useState(0);
    const [formData, setFormData] = useState({
      DaoName: "",
      DaoDesc: "",
      Logo: "",
      Header: "",
      DiscordLink: "",
      DiscordChannel: "",
      Input: "",
    });

  const FormTitles = [
    "Create a DAO",
    "Enter Details",
    "DAo Category",
    "Discord Integration",
    "Review",
  ];

  const PageDisplay = () => {
    if (page === 0) {
      return <CreateDao formData={formData} setFormData={setFormData}/>;
    } else if (page === 1) {
      return <DetailsForDao/>;
    } else if ( page === 2){
      return <DaoCategories/>;
    } else if ( page === 3){
        return <DiscordIntegration formData={formData} setFormData={setFormData}/>;
    } else if ( page ===4){
        return <ReviewInfo/>;
    }
  };
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-indigo-900 h-full w-full">
      <div>
      <div className="progressbar">
            <div
              style={{
                width: page === 0 ? "20%" : page === 1 ? "40%" : page === 2 ? "60%" : page === 3 ? "80%" : "100%",
              }}
            ></div>
        </div>
        <p className="text-white">{FormTitles[page]}</p>
        <div>
            {PageDisplay()}
        </div>
        <button
          hidden= {page === 0}
          className="bg-white"
          onClick={() => {
            setPage((currpage) => currpage - 1);
          }}
        >
          prev
        </button>
        <button
          className="bg-white"
          onClick={() => {
            if(page === FormTitles.length - 1){
                alert("form submitted")
                console.log(formData)
            }else{
            setPage((currpage) => currpage + 1);
            }
          }}
        >
          {page === FormTitles.length - 1 ? "Launch Dao" : "Next"}
        </button>
      </div>
      <div></div>
    </div>
  );
};

export default FormInputs;
