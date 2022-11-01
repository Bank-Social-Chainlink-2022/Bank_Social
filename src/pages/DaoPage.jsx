import React from "react";

const DaoPage = () => {
  return (
    <div className="container h-screen ">
      <div className="flex flex-col bg-main-bg px-28">
        <div className="flex flex-wrap mt-[200px] ">
          {/* Sction 1 */}
          <div className="w-[345px] h-[380px] border-color border-4 bg-sub-bg rounded-xl flex flex-col py-6 px-2 gap-10 ">
            <div className="text-left flex flex-col gap-5 pl-6">
              <p className="text-sub-text text-lg">Staked</p>
              <p className=" text-title-text text-3xl">$1234.00</p>
            </div>
            <div className="border-color border-2 w-[100%] mx-auto" />
            <div className="flex gap-4 pl-6 ">
              <p className="text-sub-text text-lg">Amount:</p>
              <input
                className="outline-0"
                type="number"
                placeholder="$Amount"
                style={{
                  paddingLeft: "12px",
                  background: "#0C0F26",
                  color: "#E9E9F3",
                }}
              />
            </div>
            <button className="text-title-text w-full h-7 bg-blue-btn ">
              Staking
            </button>
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
