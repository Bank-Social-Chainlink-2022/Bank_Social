import React, { createContext, useEffect, useState } from "react";
import { dummyData, votedAddress } from "../assets/dummy";
import { useConnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

import { useBankSocialActivity, useCreateDAO, daoAddress } from "../hooks";
import { memberCardABI, memberCardAddress } from "../utils/constants";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
  const [activity, setActivity] = useState();

  // get activity
  // https://polygon-rpc.com
  // https://matic-mumbai.chainstacklabs.com
  const { activities } = useBankSocialActivity({
    API_URL: "https://matic-mumbai.chainstacklabs.com",
    contractAddress: memberCardAddress,
    contractABI: memberCardABI,
  });
  console.log(activities, memberCardAddress);

  return (
    <DaoContext.Provider
      value={{
        tokenNumber,
        setTokenNumber,
        pickedDao,
        setPickedDao,
        useConnect,
        InjectedConnector,
      }}
    >
      {children}
    </DaoContext.Provider>
  );
};
