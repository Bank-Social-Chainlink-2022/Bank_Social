import React, { createContext, useEffect, useState } from "react";

import { dummyData, votedAddress } from "../assets/dummy";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);

  return (
    <DaoContext.Provider
      value={{ tokenNumber, setTokenNumber, pickedDao, setPickedDao }}
    >
      {children}
    </DaoContext.Provider>
  );
};
