import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { listOfDao } from "../../assets/dummy";

import { useBankSocialActivity } from "wagmi-banksocial";
import { socialBankAddress, socialBankABI } from "../../constants/constants";
import { DaoContext } from "../../context/DaoContext";

const DaoList = () => {
  const [initialDaoList, setInitialDoaList] = useState([]);
  const [daoList, setDaoList] = useState([]);
  const [search, setSearch] = useState("");

  const { setCreatedDaoList, setPickCreateDaoAddress } = useContext(DaoContext);

  const handleFilter = (event) => {
    const searchWord = event.target.value;

    if (searchWord !== "") {
      const newFilter = initialDaoList.filter((value) => {
        return value.data.bankName
          .toLowerCase()
          .includes(searchWord.toLowerCase());
      });
      setDaoList(newFilter);
    } else {
      setDaoList(initialDaoList);
    }
    setSearch(searchWord);
  };
  console.log(search);

  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: socialBankAddress,
    contractABI: socialBankABI,
    network: "polygon",
  });
  // console.log(+initialDaoList[0].data.daoId);
  // console.log(+initialDaoList[1].data.daoId);

  useEffect(() => {
    const getDaos = async () => {
      const data = await activities;
      setInitialDoaList(data);
      setDaoList(data);
      setCreatedDaoList(data);
    };
    getDaos();
  }, [activities]);

  console.log(initialDaoList);

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

      <ul className="overflow-scroll h-[370px] sm:h-[250px] ">
        {daoList && daoList.length > 0 ? (
          <div className="mt-2 w-108 h-60 bg-white overflow-hidden overflow-y-auto rounded-md mx-auto">
            {daoList.map((value, key) => {
              return (
                <li
                  key={key}
                  onClick={() => setPickCreateDaoAddress(value.data.DAOAddress)}
                >
                  <Link
                    to={`/daopage/${value.data.daoId}`}
                    className="text-black h-10 flex align-middle w-full
                    no-underline hover:bg-slate-200 pt-2"
                    rel="noreferrer"
                  >
                    <p className="ml-3">{value.data.bankName}</p>
                  </Link>
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
