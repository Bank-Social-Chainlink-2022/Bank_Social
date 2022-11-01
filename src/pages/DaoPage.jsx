import React from "react";

const DaoPage = () => {
  return (
    <div className="container h-screen ">
      <div className="flex flex-col bg-main-bg px-28">
        {/* Sction 1 */}
        <div className="flex flex-wrap mt-[200px] justify-between">
          {/* card1 */}
          <div className="w-[365px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
            <div className="text-left flex flex-col gap-5 pl-6">
              <p className="text-sub-text text-lg">Staked</p>
              <p className=" text-title-text text-3xl">$1234.00</p>
            </div>
            <div className="border-color border-2 w-[100%] mx-auto" />
            <div className="flex gap-4 pl-6 h-10 items-center ">
              <p className="text-sub-text text-lg">Amount:</p>
              <input
                className="outline-0"
                type="number"
                placeholder="$Amount"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                  height: "40px",
                  borderRadius: "15px",
                }}
              />
            </div>
            <button className="text-title-text w-[90%] h-14 text-2xl font-bold mx-auto bg-blue-btn rounded-3xl mt-1">
              STAKING
            </button>
          </div>
          {/* card 2 */}
          <div className="w-[365px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
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
              <p className="text-title-text font-bold text-2xl">OWNED</p>
            </div>
          </div>
          {/* card 3 */}
          <div className="w-[365px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
            <div className="text-left flex flex-col gap-5 pl-6">
              <p className="text-sub-text text-lg">Total Staked Amount</p>
              <p className=" text-title-text text-3xl">$12345.00</p>
            </div>
            <div className="border-color border-2 w-[100%] mx-auto" />
            <div className="flex gap-4 pl-6 h-10 items-center ">
              <p className="text-sub-text text-lg">Total Claimed Proposal</p>
            </div>
            <div className="w-full h-14 py-3">
              <p className="text-title-text font-bold text-2xl">17</p>
            </div>
          </div>
        </div>
        {/* Section 2 */}
        <div>Proposal Request Section</div>
        {/* Section 3 */}

        <div>requested proposal card</div>
      </div>
    </div>
  );
};

export default DaoPage;
