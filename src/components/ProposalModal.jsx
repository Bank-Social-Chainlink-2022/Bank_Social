import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { AiOutlineCloseCircle } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import { votedAddress, dummyData } from "../assets/dummy";
import { shortenAddress } from "../utils/shortenAddress";
import { DaoContext } from "../context/DaoContext";

import { useBankSocialActivity } from "wagmi-banksocial";
import { daoABI } from "../constants/constants";

const VotedAccount = ({ address, result, transaction }) => {
  return (
    <div className="mx-3 flex justify-between border-color border-b-2 py-3 text-sm ">
      <p>{shortenAddress(address)}</p>
      <p>{result}</p>
      <p>{transaction}</p>
    </div>
  );
};

const ProposalModal = () => {
  const [pickedDao, setPickedDao] = useState([]);
  const [totalVotes, setTotalVotes] = useState([]);
  const [totalYesVotes, setTotalYesVotes] = useState([]);
  const [totalNoVotes, setTotalNoVotes] = useState([]);
  const { vote, setVoteInfo, daoIdNumber, pickCreateDaoAddress } =
    useContext(DaoContext);
  const { tokenId, proposalId } = useParams();

  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: pickCreateDaoAddress,
    contractABI: daoABI,
    network: "polygon",
  });

  useEffect(() => {
    const fileter = async () => {
      const data = await activities;
      const proposalResult = data.filter(
        (dao) => +dao.data._id === +proposalId
      );

      const voteResult = data.filter(
        (dao) => dao.eventName == "ProposalElected"
      );
      const voteYes = data.filter(
        (dao) =>
          dao.eventName === "ProposalElected" && dao.data._passed === true
      );
      const voteNo = data.filter(
        (dao) =>
          dao.eventName === "ProposalElected" && dao.data._passed === false
      );
      setPickedDao(proposalResult[0].data);
      setTotalVotes(voteResult);
      setTotalYesVotes(voteYes);
      setTotalNoVotes(voteNo);
    };
    fileter();
  }, [activities]);

  const yesVote = () => {
    setVoteInfo({ vote: true, proposalId: proposalId, tokenId: tokenId });
    vote();
  };

  const noVote = () => {
    setVoteInfo({ vote: false, proposalId: proposalId, tokenId: tokenId });
    vote();
  };

  const yesRate = Math.round(
    Number(totalYesVotes.length / totalVotes.length) * 100
  );
  const noRate = Math.round(
    Number(totalNoVotes.length / totalVotes.length) * 100
  );

  return (
    <div className="max-w-[1440px]  m-0 p-10 text-center mx-auto">
      <div className="w-[750px] h-[1300px] bg-main-bg pt-2 pb-8 border-4 mx-auto border-color rounded-2xl flex flex-col ">
        <div className="self-end pr-6 pb-2">
          <Link to={`/daopage/${daoIdNumber}`}>
            <AiOutlineCloseCircle className="text-sub-text text-4xl cursor-pointer transition-all duration300 hover:text-title-text" />
          </Link>
        </div>
        <div className="flex px-6 gap-6 w-full h-full">
          {/* vertical section 1 */}
          <div className="flex flex-col w-3/5 gap-4 h-full">
            <div className="w-full h-[48%] bg-sub-bg border-4 border-color rounded-xl flex flex-col gap-5 p-5 ">
              <div className="w-24 h-8 bg-[#78C28D]  rounded-xl font-medium text-lg pt-[2px]">
                Active
              </div>
              <div className="text-title-text text-left text-3xl">
                {pickedDao && pickedDao._ipfsHash}
              </div>
              <div className="h-[90%]">
                <p className="text-sub-text text-xs text-left overflow-x-scroll">
                  {pickedDao ? pickedDao._ipfsHash : ""}
                </p>
              </div>

              <p className="text-sub-text h-0 text-left text-[9px] mt-2">
                end in 5 days
              </p>
            </div>
            <div className="w-full h-[48%] bg-sub-bg border-4 border-color rounded-xl text-sub-text text-left py-5">
              <div className="w-full pb-2 pl-3 border-b-2 text-md border-color">
                <p>Votes ({totalVotes.length})</p>
              </div>
              <div className="h-[97%] w-full overflow-x-auto">
                {totalVotes ? (
                  totalVotes.map((account, index) => (
                    <VotedAccount
                      key={index}
                      address={account.data._proposer}
                      result={account.data._passed === true ? "YES" : "NO"}
                      transaction={
                        account.eventName === "ProposalElected" ? "Confirm" : ""
                      }
                    />
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
          {/* vertical section 2 */}
          <div className=" h-1/2 w-1/2 flex flex-col gap-4">
            <div className="w-full h-[60%] bg-sub-bg border-4 border-color rounded-xl text-xs text-sub-text flex flex-col gap-7 p-5">
              <h1 className="text-title-text text-left text-lg">
                Cast your vote
              </h1>
              <p className="text-left text-xs">
                Various proposals have benn initiated, discussed and interated
                to bring clarify to both structure and guidance an appropriate
                operating framework
              </p>
              <div className="text-[#BEC0D0]  flex flex-col gap-2">
                <div className="flex justify-between">
                  <p>Start date</p>
                  <p>Oct 14, 2022, 12:00 PM</p>
                </div>
                <div className="flex justify-between">
                  <p>End date</p>
                  <p>Nov 14, 2022, 12:00 PM</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <div
                  className="border-2 border-color bg-[#21243A] py-2 rounded-lg cursor-pointer duration-200 transition-all hover:bg-[#78C28D] hover:text-black hover:border-transparent"
                  onClick={() => yesVote()}
                >
                  Yes, I support the proposal
                </div>
                <div
                  className="border-2 border-color w-full bg-[#21243A] py-2 rounded-lg cursor-pointer duration-200 transition-all hover:bg-[#c27878] hover:text-black hover:border-transparent"
                  onClick={() => noVote()}
                >
                  No, I don't support the proposal
                </div>
              </div>

              {/* {yesVotes ? (
                <div className="border-2 border-color bg-[#23313D] py-2 rounded-lg cursor-pointer flex justify-center gap-2 items-center">
                  <FcCheckmark />
                  <p>You've succesfully vote the proposal</p>
                </div>
              ) : (
                <div className="border-2 border-color bg-red-300 py-2 rounded-lg cursor-pointer flex justify-center gap-2 items-center">
                  {" "}
                  <p className="text-black">Please vote the proposal</p>
                </div>
              )} */}
            </div>
            <div className="w-full h-[40%] bg-sub-bg border-4 border-color rounded-xl mb-7 flex flex-col text-left p-5 gap-6">
              <h1 className="text-title-text text-lg">Current result</h1>
              <div className="flex flex-col gap-3">
                <p className="text-sub-text text-sm">{`Yes, I support: ${totalYesVotes.length}`}</p>
                <div className="flex justify-center items-center gap-2 rounded-lg border-transparent border-0 ">
                  <div className="w-full bg-[#989FBA] rounded-full h-2">
                    <div
                      className={" bg-[#4549D6] h-2 rounded-full"}
                      style={{ width: `${yesRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sub-text text-xs">{yesRate}%</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sub-text text-sm">{`No, I don't support:  ${totalNoVotes.length}`}</p>
                <div className="flex justify-center items-center gap-2 rounded-lg border-transparent border-0 ">
                  <div className="w-full bg-[#989FBA] rounded-full h-2">
                    <div
                      className={"bg-[#d65345] h-2 rounded-full"}
                      style={{ width: `${noRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sub-text text-xs">{noRate}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProposalModal;
