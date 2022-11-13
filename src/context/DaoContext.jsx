import React, { createContext, useEffect, useState } from "react";
import {
  memberCardABI,
  memberCardAddress,
  useBankSocialActivity,
  useCreateDAO,
  useAccount,
  useConnect,
  useDisconnect,
  daoVaultAddress,
  useDaosById,
  // useHarvest, Removed from contract
  useMemberMint,
  usePropose,
  useStake,
  useUSDCApprove,
  useUnstake,
  useVote,
} from "wagmi-banksocial";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";
import { dummyData, votedAddress } from "../assets/dummy";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
  //Open the Modalbox
  const [openModalBox, setOpenModalBox] = useState(false);
  const [createDaoOpen, setCreateDaoOpen] = useState(false);

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

  useEffect(() => {
    if (isConnected === true) {
      setOpenModalBox(true);
    }
  }, [isConnected]);

  ////From Smart contract
  const [activity, setActivity] = useState();

  // get cativity
  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: memberCardAddress,
    contractABI: memberCardABI,
  });

  const { write: _createDAO } = useCreateDAO({
    initBaseURI: "test",
    maxSupply: 10,
    minStake: 1,
    name: "test",
  });

  console.log(activities);
  console.log(memberCardAddress);
  console.log(daoVaultAddress);

  /** Start with DAO Vault */
  const { write: _approveUSDC } = useUSDCApprove({
    spender: daoVaultAddress,
    amount: 10,
  });
  const { write: _stake } = useStake({ amount: 1 });
  // TODO get owner all NFTs ID.
  const { write: _unstake } = useUnstake({ tokenId: 1 }); // Change tokenId to yours
  // const _harvest = useHarvest()

  /** The DAO */
  const { write: _propose } = usePropose({
    amount: 10,
    isToken: false,
    description: "test",
    receiver: address ? address : "0x123",
    tokenId: 1, // Change tokenId to yours
  });
  // TODO get all proposals ID.
  const { write: _vote } = useVote({ vote: true, proposalId: 0, tokenId: 1 });
  const _mint = useMemberMint();

  /** Read Contract */
  const { data: daoIds } = useDaosById({ daoId: 1 });
  console.log("🚀 ~ file: index.tsx ~ line 57 ~ Page ~ daoIds", daoIds);

  const contractCreateDAO = () => {
    _createDAO && _createDAO();
  };

  const approve = () => {
    _approveUSDC && _approveUSDC();
  };

  const stake = () => {
    _stake && _stake();
  };

  const unstake = () => {
    _unstake && _unstake();
  };

  // const harvest = () => {
  //   if (_harvest) {
  //     const { write } = _harvest
  //     write && write()
  //   }
  // }

  const propose = () => {
    _propose && _propose();
  };

  const vote = () => {
    _vote && _vote();
  };

  const mint = () => {
    if (_mint) {
      const { write } = _mint;
      write && write();
    }
  };

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
        createDaoOpen,
        setCreateDaoOpen,
        formData,
        setFormData,
        contractCreateDAO,
      }}
    >
      {children}
    </DaoContext.Provider>
  );
};
