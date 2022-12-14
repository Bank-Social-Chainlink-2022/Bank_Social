import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { DaoContext } from "../context/DaoContext";

const ProposalCard = ({
  proposalId,
  tokenId,
  title,
  description,
  yesRate,
  noRate,
  voteInfo,
}) => {
  const { vote, setVoteInfo } = useContext(DaoContext);

  const yesVote = () => {
    setVoteInfo({ vote: true, proposalId: proposalId, tokenId: tokenId });
    vote();
  };

  const noVote = () => {
    setVoteInfo({ vote: false, proposalId: proposalId, tokenId: tokenId });
    vote();
  };

  return (
    <div className="w-full h-[450px] bg-sub-bg border-4 rounded-xl border-color py-4 px-6 flex flex-col gap-7">
      <div className="h-20 pt-6">
        <h1 className="text-title-text text-4xl">{title}</h1>
      </div>
      <div className="border-t-[3.5px] border-b-[3.5px] border-color text-sub-text w-[90%] mx-auto text-md py-2 px-3 mt-2 overflow-x-auto">
        <p>{description}</p>
      </div>
      <div className="w-[90%] text-sub-text text-2xl font-normal flex mx-auto gap-2">
        <div className="flex flex-col w-full gap-5">
          <button
            className="h-14  border-[3.5px] border-color rounded-3xl hover:bg-title-text hover:text-[#0C0F26] hover:font-semibold hover:border-transparent duration-300 transition-all"
            onClick={() => yesVote()}
          >
            YES
          </button>
          <p>{yesRate}%</p>
        </div>
        <div className="flex flex-col w-full gap-5">
          <button
            className="h-14 border-[3.5px] border-color rounded-3xl hover:bg-title-text hover:text-[#0C0F26] hover:font-semibold hover:border-transparent duration-300 transition-all"
            onClick={() => noVote()}
          >
            NO
          </button>
          <p>{noRate}%</p>
        </div>
      </div>
      <Link to={`/proposaldetail/${tokenId}/${proposalId}`}>
        <button className="text-title-text w-[90%] h-16 text-3xl mx-auto bg-blue-btn rounded-3xl mt-2 cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold">
          DETAILS
        </button>
      </Link>
    </div>
  );
};

export default ProposalCard;
