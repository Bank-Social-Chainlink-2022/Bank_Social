import React, { createContext, useEffect, useState } from "react";
import {
  memberCardABI,
  memberCardAddress,
  useBankSocialActivity,
  useConnect,
} from "wagmi-banksocial";

import { InjectedConnector } from "wagmi-banksocial/connectors/injected";

import { dummyData, votedAddress } from "../assets/dummy";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
  const [activity, setActivity] = useState();

  // get cativity
  const { activities } = useBankSocialActivity({
    API_URL: process.env.API_URL,
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
