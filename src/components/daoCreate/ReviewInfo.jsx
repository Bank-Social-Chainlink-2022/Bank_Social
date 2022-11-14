import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const ReviewInfo = () => {
  const { createDaoForm } = useContext(DaoContext);

  return (
    <div className="text-white block mt-6 font-lg mb-14">
      <p className="mt-3 font-semibold">DAO Name : {createDaoForm.DaoName}</p>
      <p className="mt-3 font-semibold">
        Description : {createDaoForm.DaoDesc}
      </p>
      <p className="mt-3 font-semibold">NFT Image : {createDaoForm.Logo}</p>
      {/* <p className="mt-1">Header : {createDaoForm.Header}</p> /}
      {/ <p className="mt-1">Discord Link: {createDaoForm.DaoName}</p> */}
      <p className="mt-3 font-semibold">
        Max. Supply for NFT : {createDaoForm.NFTNumber}
      </p>
      <p className="mt-3 font-semibold">
        Min. Staking Amount : {createDaoForm.StakingAmount} USDC
      </p>
    </div>
  );
};

export default ReviewInfo;
