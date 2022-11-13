import React, { useContext } from "react";
import { DaoContext } from "../context/DaoContext";

import { shortenAddress } from "../utils/shortenAddress";

const Navbar = () => {
  const { address, connect, disconnect, setOpenModalBox, setCreateDao } =
    useContext(DaoContext);
  const connectWallet = () => {
    connect();
  };

  const disConnectWallet = () => {
    disconnect();
    setCreateDao(false);
  };

  return (
    <div className="h-full py-4 flex justify-between items-center px-6 text-white w-full">
      <div className="mx-3">
        <h1 className="font-Bangers text-3xl sm:text-5xl">Project</h1>
      </div>
      <div className="mx-1">
        {!address && (
          <button
            className="bg-gradient-to-r from-violet-300 via-purple-800 to-blue-400 text-white rounded-3xl px-5 py-1.5 sm:px-8 sm:py-2 md:px-9 md:py-2.5 lg:px-10 lg:py-3 hover:scale-110 transition ease-in-out delay-150 duration-150 font-semibold hover:ring-1 hover:ring-white"
            onClick={() => connectWallet()}
          >
            Wallet connect
          </button>
        )}

        {address && (
          <button
            className="bg-gradient-to-r from-violet-300 via-purple-800 to-blue-400 text-white rounded-3xl px-5 py-1.5 sm:px-8 sm:py-2 md:px-9 md:py-2.5 lg:px-10 lg:py-3 hover:scale-110 transition ease-in-out delay-150 duration-150 font-semibold hover:ring-1 hover:ring-white"
            onClick={() => disConnectWallet()}
          >
            {shortenAddress(address)}
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
