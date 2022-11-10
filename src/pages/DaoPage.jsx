import React, { useState } from "react";
import { ProposalCard, ProposalModal } from "../components";
import { dummyData } from "../assets/dummy";

const DaoPage = () => {
  const [detail, setDetail] = useState(true);

  return (
    <>
      <div className="container h-screen">
        <div className="flex flex-col gap-20 bg-main-bg px-28 relative">
          <h1 className="text-title-text  mt-[100px] text-4xl">
            Dao-A: Office Evironment
          </h1>
          {/* Sction 1 */}
          <div className="flex flex-wrap mt-[100px] justify-between ">
            {/* card1 */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
              <div className="text-left flex flex-col gap-5 pl-6">
                <p className="text-sub-text text-lg ">Staked</p>
                <p className=" text-title-text text-3xl">$1234.00</p>
              </div>
              <div className="border-color border-2 w-[100%] mx-auto" />
              <div className="flex gap-4 pl-6 h-10 items-center ">
                <p className="text-sub-text text-xl ">Amount:</p>
                <input
                  className="outline-0 placeholder-[#e9e9f3df]"
                  type="number"
                  placeholder="$Amount"
                  style={{
                    paddingLeft: "12px",
                    background: "#0C0F26",
                    color: "#E9E9F3",
                    height: "55px",
                    borderRadius: "15px",
                  }}
                />
              </div>
              <button className="text-title-text w-[90%] h-14 text-3xl  mx-auto bg-blue-btn rounded-3xl mt-1 cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold">
                STAKING
              </button>
            </div>
            {/* card 2 */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
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
            </div>
            {/* card 3 */}
            <div className="w-[360px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
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
            </div>
          </div>
          {/* Section 2 */}
          <div className="w-full h-[620px] bg-sub-bg border-color border-4 rounded-2xl px-16 py-9 text-left flex flex-col gap-8">
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
              >
                <option value={true}>ETHER</option>
                <option value={false}>USDC</option>
              </select>
            </div>
            <div className="w-full flex flex-col gap-3">
              <p className="text-sub-text text-md ml-3">Proposal Title</p>
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
              />
            </div>
            <div className="text-right">
              <button className="text-title-text w-[30%] h-14 text-3xl mx-auto bg-blue-btn rounded-3xl mt-2  cursor-pointer transition-all duration400 hover:bg-[#2d55f6] hover:font-semibold">
                SUBMIT
              </button>
            </div>
          </div>
          {/* Section 3 */}

          <div className="w-full grid grid-cols-2 gap-7 ">
            {dummyData.map((proposal, index) => (
              <ProposalCard
                key={index}
                tokenId={proposal.tokenId}
                title={proposal.title}
                description={proposal.description}
                yesRate={proposal.yesRate}
                noRate={proposal.noRate}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DaoPage;
