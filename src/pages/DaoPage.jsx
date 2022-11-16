import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useBankSocialActivity } from "wagmi-banksocial";
import { ProposalCard } from "../components";
import { daoABI, daoAddress } from "../constants/constants";
import { DaoContext } from "../context/DaoContext";

const DaoPage = () => {
  const [proposals, setProposals] = useState([]);
  const [pickCreateDao, setPickCreateDao] = useState();
  const [totalVotes, setTotalVotes] = useState([]);
  const [totalYesVotes, setTotalYesVotes] = useState([]);
  const [totalNoVotes, setTotalNoVotes] = useState([]);

  const {
    stake,
    approve,
    unstake,
    propose,
    proposalForm,
    setProposalForm,
    stakeAmount,
    setStakeAmount,
    usdcApprove,
    setUsdcApprove,
    unStakeId,
    setUnStakeId,
    createdDaoList,
    setDaoIdNumber,
  } = useContext(DaoContext);
  const { daoId } = useParams();
  setDaoIdNumber(daoId);

  const submitProposal = () => {
    propose();
  };

  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: daoAddress,
    contractABI: daoABI,
    network: "polygon",
  });

  useEffect(() => {
    const fileter = async () => {
      const data = await activities;
      const proposalResult = data.filter(
        (dao) => dao.eventName === "ProposalCreated"
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

      setProposals(proposalResult);
      setTotalVotes(voteResult);
      setTotalYesVotes(voteYes);
      setTotalNoVotes(voteNo);
    };

    fileter();
  }, [activities]);

  useEffect(() => {
    const fileter = async () => {
      const data = await createdDaoList;
      const result = data.filter((dao) => +dao.data.daoId == daoId);
      setPickCreateDao(result[0]);
    };
    fileter();
  }, [createdDaoList]);

  const yesRate = Math.round(
    Number(totalYesVotes.length / totalVotes.length) * 100
  );
  const noRate = Math.round(
    Number(totalNoVotes.length / totalVotes.length) * 100
  );

  return (
    <>
      <div className="container h-screen">
        <div className="flex flex-col gap-20 bg-main-bg px-28 relative">
          <h1 className="text-title-text  mt-[100px] text-4xl">
            DAO - {pickCreateDao ? pickCreateDao.data.bankName : ""}
          </h1>
          {/* Sction 1 */}
          <div className="flex flex-wrap mt-[100px] justify-between ">
            {/* card1 */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg ">USDC</p>
                <p className=" text-title-text text-3xl">Get Approve</p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-xl ">Amount:</p>
                <input
                  className="outline-0 placeholder-[#e9e9f3df]"
                  type="text"
                  placeholder="$Amount"
                  value={usdcApprove}
                  onChange={(e) => setUsdcApprove(e.target.value)}
                  style={{
                    paddingLeft: "12px",
                    background: "#0C0F26",
                    color: "#E9E9F3",
                    height: "55px",
                    borderRadius: "15px",
                  }}
                />
              </div>
              <button
                className="text-title-text w-[90%] h-14 text-3xl  mx-auto bg-blue-btn rounded-3xl mt-1 cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold"
                onClick={() => approve()}
              >
                APPROVE
              </button>
            </div>
            {/* card 2 */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg ">Minimum Staking</p>
                <p className=" text-title-text text-3xl">
                  {pickCreateDao ? +pickCreateDao.data.minStake : ""}
                </p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-xl ">Amount:</p>
                <input
                  className="outline-0 placeholder-[#e9e9f3df]"
                  type="number"
                  placeholder="$Amount"
                  value={stakeAmount}
                  onChange={(e) => setStakeAmount(e.target.value)}
                  style={{
                    paddingLeft: "12px",
                    background: "#0C0F26",
                    color: "#E9E9F3",
                    height: "55px",
                    borderRadius: "15px",
                  }}
                />
              </div>
              <button
                className="text-title-text w-[90%] h-14 text-3xl  mx-auto bg-blue-btn rounded-3xl mt-1 cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold"
                onClick={() => stake()}
              >
                STAKING
              </button>
            </div>
            {/* <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg">Total Minted NFT</p>
                <p className=" text-title-text text-3xl">8962</p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-lg">Address:</p>
                <p className="text-sub-text text-lg">0xru...8fr7</p>
              </div>
              <div className="w-full h-14 py-3">
                <p className="text-title-text font-bold text-2xl text-left pl-6">
                  OWNED
                </p>
              </div>
            </div> */}
            {/* card 3 */}
            {/* <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg">Total Staked Amount</p>
                <p className=" text-title-text text-3xl">$12345.00</p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-lg">Total Claimed Proposal</p>
              </div>
              <div className="w-full h-14 py-3">
                <p className="text-title-text font-bold text-2xl text-left pl-6">
                  17
                </p>
              </div>
            </div> */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg ">Max Supply</p>
                <p className=" text-title-text text-3xl">
                  {pickCreateDao ? +pickCreateDao.data.maxSupply : ""}
                </p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-xl ">Token Id:</p>
                <input
                  className="outline-0 placeholder-[#e9e9f3df]"
                  type="number"
                  placeholder="Token Id"
                  value={unStakeId}
                  onChange={(e) => setUnStakeId(e.target.value)}
                  style={{
                    paddingLeft: "12px",
                    background: "#0C0F26",
                    color: "#E9E9F3",
                    height: "55px",
                    borderRadius: "15px",
                  }}
                />
              </div>
              <button
                className="text-title-text w-[90%] h-14 text-3xl  mx-auto bg-blue-btn rounded-3xl mt-1 cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold"
                onClick={() => unstake()}
              >
                UNSTAKING
              </button>
            </div>
          </div>
          {/* Section 2 */}
          <div className="w-full h-[840px] bg-sub-bg border-color border-4 rounded-2xl px-16 py-9 text-left flex flex-col gap-8">
            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">Proposal Title</p>
              <input
                className="outline-0 placeholder-[#e9e9f3df] text-lg"
                type="text"
                placeholder="Enter your title"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "50px",
                  width: "100%",
                  borderRadius: "15px",
                }}
                value={proposalForm.title}
                onChange={(e) =>
                  setProposalForm({ ...proposalForm, title: e.target.value })
                }
              />
            </div>
            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">Receiver Address</p>
              <input
                className="outline-0 placeholder-[#e9e9f3df] text-lg"
                type="text"
                placeholder="Enter Receiver Address"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "50px",
                  width: "100%",
                  borderRadius: "15px",
                }}
                value={proposalForm.receiver}
                onChange={(e) =>
                  setProposalForm({ ...proposalForm, receiver: e.target.value })
                }
              />
            </div>

            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">NFT TokenId</p>
              <input
                className="outline-0 placeholder-[#e9e9f3df] text-lg"
                type="text"
                placeholder="Enter Your NFT tokenID"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "50px",
                  width: "100%",
                  borderRadius: "15px",
                }}
                value={proposalForm.tokenId}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    tokenId: e.target.value,
                  })
                }
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
              />
            </div>

            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">Select Coin</p>
              <select
                className="outline-0 placeholder-[#e9e9f3df] text-lg"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "50px",
                  width: "100%",
                  borderRadius: "15px",
                }}
                value={proposalForm.coinSelect}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    coinSelect: e.target.value,
                  })
                }
              >
                <option value={"ETHER"}>ETHER</option>
                <option value={"USDC"}>USDC</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">Proposal Description</p>
              <textarea
                className="outline-0 text-lg placeholder-[#e9e9f3df]"
                type="text"
                placeholder="Enter your proposal"
                style={{
                  padding: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "170px",
                  width: "100%",
                  borderRadius: "15px",
                }}
                value={proposalForm.description}
                onChange={(e) =>
                  setProposalForm({
                    ...proposalForm,
                    description: e.target.value,
                  })
                }
              />
            </div>
            <div className="text-right">
              <button
                className="text-title-text w-[30%] h-14 text-3xl mx-auto bg-blue-btn rounded-3xl mt-2  cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold"
                onClick={() => submitProposal()}
              >
                SUBMIT
              </button>
            </div>
          </div>
          {/* Section 3 */}

          <div className="w-full grid grid-cols-2 gap-7 ">
            {proposals.map((proposal, index) => (
              <ProposalCard
                key={index}
                proposalId={proposal.data._id}
                tokenId={+proposal.data._tokenId}
                title={proposal.data._ipfsHash}
                description={proposal.data._ipfsHash}
                yesRate={yesRate}
                noRate={noRate}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DaoPage;
