import React from "react";
import { ModalBox } from "../components";
import proposal from "../assets/proposal.png";
import vote from "../assets/vote.png";
import staking from "../assets/staking.png";

const Homepage = () => {
  const cards = [
    {
      img: vote,
      title: "Vote",
      desc: "Vote on yield-only proposals/initiatives to fund what interests you.",
    },
    {
      img: staking,
      title: "Staking",
      desc: "Stake in USDC and “cash out” in other tokens",
    },
    {
      img: proposal,
      title: "Proposal",
      desc: "vote and communicate on the same interface",
    },
  ];
  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-indigo-900 h-screen w-full">
      <div className="flex justify-center mx-auto w-screen">
        <h1 className="text-white font-Roboto text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-semibold w-2/3 tracking-wide leading-normal text-center whitespace-normal mt-32 ">
          <span className=" text-white bg-clip-text sm:text-transparent sm:bg-gradient-to-r from-sky-500 via-violet-600 to-violet-200">
            The no loss DAO platform made for member impact
          </span>
        </h1>
      </div>
      <div className="w-screen mx-auto justify-center flex">
        <h1 className="text-gray-400 mt-6 text-xl sm:text-2xl md:text-2xl lg:text-2xl xl:text-2xl font-semibold tracking-wide leading-normal text-center whitespace-normal w-2/3">
          Galaxie powers the no loss solution for your DAO members to fund
          anything with yield.
        </h1>
      </div>
      <div className="mt-40">
        <div className="flex justify-center w-screen mb-20">
          <div className="flex-col">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl text-white font-Roboto font-semibold text-center">
              An all-in-one interface for DAO membership, voting and chatting
              with fellow DAO members
            </h1>
            {/* <p className="text-md sm:text-lg md:text-xl lg:text-xl text-slate-400 font-semibold text-center mt-7">
              Abra kadabra
            </p> */}
          </div>
        </div>
        <div className="grid gap-x-6 gap-y-5 lg:grid-cols-3 md:grid-cols-3 w-4/5 h-[430px] mx-auto">
          {cards.map((items, key) => {
            return (
              <div
                className="w-full h-full rounded-lg shadow-md bg-card-color"
                key={key}
              >
                <img
                  className="object-cover w-full h-[60%]"
                  alt={`${items.title} image`}
                  src={items.img}
                />
                <div className="p-4">
                  <h4 className="text-3xl font font-semibold text-white font-Roboto leading-normal tracking-normal">
                    {items.title}
                  </h4>
                  <p className=" mt-3 text-gray-400 tracking-wide leading-normal font-semibold text-md">
                    {items.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <br />
      <br />
      <br />

      <ModalBox />
    </div>
  );
};

export default Homepage;
