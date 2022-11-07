import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";

import { AiOutlineCloseCircle } from "react-icons/ai";
import { FcCheckmark } from "react-icons/fc";
import { FaTimes } from "react-icons/fa";
import { votedAddress, dummyData } from "../assets/dummy";
import { shortenAddress } from "../utils/shortenAddress";
import { DaoContext } from "../context/DaoContext";

const filterYes = (address) => {
  let voteYes = [];
  address.forEach((addr) => {
    if (addr.voteResult === "YES") {
      voteYes.push(addr);
    }
  });
  return voteYes;
};

const filterNo = (address) => {
  let voteNo = [];
  address.forEach((addr) => {
    if (addr.voteResult === "NO") {
      voteNo.push(addr);
    }
  });
  return voteNo;
};
const yesPercent = Math.round(
  (filterYes(votedAddress).length / votedAddress.length) * 100
);

const noPercent = Math.round(
  (filterNo(votedAddress).length / votedAddress.length) * 100
);

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
  const { tokenNumber, setTokenNumber, pickedDao, setPickedDao } =
    useContext(DaoContext);

  const { tokenId } = useParams();

  // useEffect(() => {
  //   setTokenNumber(+tokenId);
  // }, [tokenId]);

  useEffect(() => {
    const filterData = dummyData.filter((dao) => dao.tokenId === +tokenId);
    setPickedDao(filterData[0]);
  }, [tokenId]);

  // console.log(dummyData);
  console.log(pickedDao);
  console.log(typeof tokenId);

  const yesVote = true;
  // console.log(pickedDao.title);
  return (
    <div className="max-w-[1440px]  m-0 p-10 text-center mx-auto">
      <div className="w-[750px] h-[1300px] bg-main-bg pt-2 pb-4 border-4 mx-auto border-color rounded-2xl flex flex-col ">
        <div className="self-end pr-6 pb-2">
          <Link to={"/daopage"}>
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
                {pickedDao && pickedDao.title}
              </div>
              <div className="h-[90%]">
                <p className="text-sub-text text-xs text-left overflow-x-scroll">
                  {pickedDao && pickedDao.description}
                </p>
              </div>

              <p className="text-sub-text h-0 text-left text-[9px] mt-2">
                end in 5 days
              </p>
            </div>
            <div className="w-full h-[48%] bg-sub-bg border-4 border-color rounded-xl text-sub-text text-left py-5">
              <div className="w-full pb-2 pl-3 border-b-2 text-md border-color">
                <p>Votes ({votedAddress.length})</p>
              </div>
              <div className="h-[97%] w-full overflow-x-auto">
                {votedAddress ? (
                  votedAddress.map((account, index) => (
                    <VotedAccount
                      key={index}
                      address={account.address}
                      result={account.voteResult}
                      transaction={account.transaction}
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
            <div className="w-full h-[60%] bg-sub-bg border-4 border-color rounded-xl text-xs text-sub-text flex flex-col gap-4 p-5">
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
                <div className="border-2 border-color bg-[#21243A] py-2 rounded-lg cursor-pointer duration-200 transition-all hover:bg-[#78C28D] hover:text-black hover:border-transparent">
                  Yes, I support the proposal
                </div>
                <div className="border-2 border-color w-full bg-[#21243A] py-2 rounded-lg cursor-pointer duration-200 transition-all hover:bg-[#c27878] hover:text-black hover:border-transparent">
                  No, I don't support the proposal
                </div>
              </div>

              {yesVote ? (
                <div className="border-2 border-color bg-[#23313D] py-2 rounded-lg cursor-pointer flex justify-center gap-2 items-center">
                  <FcCheckmark />
                  <p>You've succesfully vote the proposal</p>
                </div>
              ) : (
                <div className="border-2 border-color bg-[#23313D] py-2 rounded-lg cursor-pointer flex justify-center gap-2 items-center">
                  {" "}
                  <FaTimes className="text-red-400" />
                  <p>Please vote the proposal</p>
                </div>
              )}
            </div>
            <div className="w-full h-[40%] bg-sub-bg border-4 border-color rounded-xl mb-7 flex flex-col text-left p-5 gap-6">
              <h1 className="text-title-text text-lg">Current result</h1>
              <div className="flex flex-col gap-3">
                <p className="text-sub-text text-sm">{`Yes, I support: ${
                  filterYes(votedAddress).length
                }`}</p>
                <div className="flex justify-center items-center gap-2 rounded-lg border-transparent border-0 ">
                  <div className="w-full bg-[#989FBA] rounded-full h-2">
                    <div
                      className={" bg-[#4549D6] h-2 rounded-full"}
                      style={{ width: `${pickedDao.yesRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sub-text text-xs">{pickedDao.yesRate}%</p>
                </div>
              </div>
              <div className="flex flex-col gap-3">
                <p className="text-sub-text text-sm">{`No, I don't support:  ${
                  filterNo(votedAddress).length
                }`}</p>
                <div className="flex justify-center items-center gap-2 rounded-lg border-transparent border-0 ">
                  <div className="w-full bg-[#989FBA] rounded-full h-2">
                    <div
                      className={"bg-[#d65345] h-2 rounded-full"}
                      style={{ width: `${pickedDao.noRate}%` }}
                    ></div>
                  </div>
                  <p className="text-sub-text text-xs">{pickedDao.noRate}%</p>
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
