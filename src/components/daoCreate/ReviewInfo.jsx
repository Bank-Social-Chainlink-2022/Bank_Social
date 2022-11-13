import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const ReviewInfo = () => {
  const { formData } = useContext(DaoContext);

  return (
    <div className="text-white block mt-2 text-semibold font-lg">
      <p className="mt-1">DAO Name: {formData.DaoName}</p>
      <p className="mt-1">Logo: {formData.Logo}</p>
      <p className="mt-1">Header: {formData.Header}</p>
      <p className="mt-1">Description: {formData.DaoDesc}</p>
      <p className="mt-1">Discord Link: {formData.DaoName}</p>
    </div>
  );
};

export default ReviewInfo;
