import React, { useContext } from "react";
import { DaoContext } from "../../context/DaoContext";

const ReviewInfo = () => {
  const { createDaoForm } = useContext(DaoContext);

  return (
    <div className="text-white block mt-6 font-lg mb-10">
      <p className="mt-3 font-semibold">DAO Name : {createDaoForm.daoName}</p>
      <p className="mt-3 font-semibold">
        Description : {createDaoForm.daoDesc}
      </p>
      <p className="mt-3 font-semibold">
        NFT Image : {createDaoForm.image.name}
      </p>
      <p className="mt-3 font-semibold">
        Max. Supply for NFT : {createDaoForm.nftNumber}
      </p>
      <p className="mt-3 font-semibold">
        Min. Staking Amount : {createDaoForm.stakingAmount} USDC
      </p>
      <p className="mt-3 font-semibold">ipfs URI : {createDaoForm.ipfsURI}</p>
    </div>
  );
};

export default ReviewInfo;
