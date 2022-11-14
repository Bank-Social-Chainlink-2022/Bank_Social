import React, { useState, useContext } from "react";
import { useEffect } from "react";
import { IoCloseSharp } from "react-icons/io";
import { listOfDao } from "../../assets/dummy";

import { DaoContext } from "../../context/DaoContext";
import CreateOrJoin from "./CreateOrJoin";

const DaoList = () => {
  const [daoList, setDaoList] = useState(listOfDao);
  const [search, setSearch] = useState("");

  const handleFilter = (event) => {
    const searchWord = event.target.value;
    if (searchWord !== "") {
      const newFilter = listOfDao.filter((value) => {
        return value.title.toLowerCase().includes(searchWord.toLowerCase());
      });
      setDaoList(newFilter);
    } else {
      setDaoList(daoList);
    }
    setSearch(searchWord);
  };

  console.log(search);
  return (
    <div className="w-full h-full">
      <div className="text-black flex bg-indigo-900 h-screen flex-col align-middle justify-center">
        <div className="text-white font-Roboto font-semibold text-xl">
          Search For DAO's
        </div>

        <input
          type="search"
          placeholder="search by name"
          className="ring-0 border rounded-lg placeholder-gray-800 border-gray-300 text-lg px-4 py-2"
          onChange={handleFilter}
          value={search}
        />

        <div className="w-full h-[0.25px] bg-gray-400 mt-3"></div>
        <ul className="overflow-scroll h-[370px] sm:h-[450px] ">
          {daoList && daoList.length > 0 ? (
            <div className="mt-2 w-96 h-60 bg-white overflow-hidden overflow-y-auto rounded-sm">
              {daoList.map((value, key) => {
                return (
                  <li>
                    <a
                      href={value.nftURI}
                      className="text-black h-10 flex align-middle w-full no-underline hover:bg-slate-200"
                      target="_blank"
                      rel="noreferrer"
                    >
                      <p className="ml-3">{value.title}</p>
                    </a>
                  </li>
                );
              })}
            </div>
          ) : (
            <p>No Results</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default DaoList;
