import React, { useState, useEffect } from "react";

import { listOfDao } from "../../assets/dummy";

import { useBankSocialActivity } from "wagmi-banksocial";
import {
  socialBankCoreAddress,
  socialBankABI,
} from "../../constants/constants";

const DaoList = () => {
  const [daoList, setDaoList] = useState([]);
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

  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: socialBankCoreAddress,
    contractABI: socialBankABI,
    network: "polygon",
  });

  useEffect(() => {
    const getDaos = async () => {
      const data = await activities;
      setDaoList(data);
    };
    getDaos();
  }, [activities]);

  console.log(daoList);

  console.log(activities);
  return (
    <div className="text-black flex flex-col mt-10">
      <div className="text-white font-Roboto font-semibold text-xl">
        Search For DAO's
      </div>

      <input
        type="search"
        placeholder="search by name"
        className="ring-0 border rounded-lg placeholder-gray-800 border-gray-300 text-lg px-4 py-2 mt-3"
        onChange={handleFilter}
        value={search}
      />

      <ul className="overflow-scroll h-[370px] sm:h-[450px] ">
        {daoList && daoList.length > 0 ? (
          <div className="mt-2 w-108 h-60 bg-white overflow-hidden overflow-y-auto rounded-md mx-auto">
            {daoList.map((value, key) => {
              return (
                <li>
                  <a
                    href={value.nftURI}
                    className="text-black h-10 flex align-middle w-full no-underline hover:bg-slate-200 mt-1"
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
  );
};

export default DaoList;
