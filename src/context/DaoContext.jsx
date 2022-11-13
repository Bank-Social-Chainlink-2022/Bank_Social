import React, { createContext, useEffect, useState } from "react";
import {
  memberCardABI,
  memberCardAddress,
  useBankSocialActivity,
  useCreateDAO,
  useAccount,
  useConnect,
  useDisconnect,
} from "wagmi-banksocial";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";
import { dummyData, votedAddress } from "../assets/dummy";
import CreateDao from "../components/daoCreate/CreateDao";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
  //Open the Modalbox
  const [openModalBox, setOpenModalBox] = useState(false);
  const [createDao, setCreateDao] = useState(false);

  const [formData, setFormData] = useState({
    DaoName: "",
    DaoDesc: "",
    Logo: "",
    Header: "",
    DiscordLink: "",
  });

  // Wallet Connection
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });

  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  console.log(isConnected);
  useEffect(() => {
    if (isConnected === true) {
      setOpenModalBox(true);
    }
  }, [isConnected]);
  ////From Smart contract
  const [activity, setActivity] = useState();

  // get cativity
  // const { activities } = useBankSocialActivity({
  //   API_URL:
  //     "https://polygon-mumbai.g.alchemy.com/v2/QAxW1bL2mUmp-dVDM3GQs6JhoEqvBuF3",
  //   contractAddress: memberCardAddress,
  //   contractABI: memberCardABI,
  // });

  // // Create Dao
  // const { write, data } = useCreateDAO({
  //   initBaseURI: "test",
  //   maxSupply: 10,
  //   minStake: 1,
  //   name: "test",
  // });
  // console.log(activities);
  // console.log(data);

  return (
    <DaoContext.Provider
      value={{
        tokenNumber,
        setTokenNumber,
        openModalBox,
        setOpenModalBox,
        pickedDao,
        setPickedDao,
        address,
        connect,
        disconnect,
        createDao,
        setCreateDao,
        formData,
        setFormData,
      }}
    >
      {children}
    </DaoContext.Provider>
  );
};
