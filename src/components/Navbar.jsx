import React from "react";
import ModalBox from "../pages/Modal";

const Navbar = () => {
  return (
    <div className="h-full py-4 flex justify-between items-center px-6 text-white w-full">
      <div className="mx-3">
        <h1 className="font-Bangers text-3xl sm:text-5xl">Project</h1>
      </div>
      <div className="mx-1">
        <button className="bg-gradient-to-r from-violet-300 via-purple-800 to-blue-400 text-white rounded-3xl px-5 py-1.5 sm:px-8 sm:py-2 md:px-9 md:py-2.5 lg:px-10 lg:py-3 hover:scale-110 transition ease-in-out delay-150 duration-150 font-semibold hover:ring-1 hover:ring-white" onClick={ModalBox}>Get Started</button>
      </div>
    </div>
  );
};

export default Navbar;
