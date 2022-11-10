<<<<<<< Updated upstream
import React, { createContext, useEffect, useState } from "react";

import { dummyData, votedAddress } from "../assets/dummy";
=======
import React, { createContext, useState } from "react";
>>>>>>> Stashed changes

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
<<<<<<< Updated upstream

  return (
    <DaoContext.Provider
      value={{ tokenNumber, setTokenNumber, pickedDao, setPickedDao }}
=======
  const [activity, setActivity] = useState();

  // get cativity
  // const { activities } = useBankSocialActivity({
  //   API_URL: process.env.API_URL,
  //   contractAddress: memberCardAddress,
  //   contractABI: memberCardABI,
  // });
  // console.log(activities, memberCardAddress);

  return (
    <DaoContext.Provider
      value={{
        tokenNumber,
        setTokenNumber,
        pickedDao,
        setPickedDao,
        // useConnect,
        // InjectedConnector,
      }}
>>>>>>> Stashed changes
    >
      {children}
    </DaoContext.Provider>
  );
};
