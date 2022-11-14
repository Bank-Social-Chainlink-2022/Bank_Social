import React, { createContext, useEffect, useState } from "react";
import { memberCardTestAddress, memberCardTestAddressABI } from "./utils";
import {
  aaveATokenAddress,
  daoAddress,
  daoVaultAddress,
  memberCardABI,
  memberCardAddress,
  poolAddress,
  socialBankAddress,
  swapAddress,
  usdcAddress,
  useAccount,
  useBankSocialActivity,
  useCreateDAO,
  useDaosById,
  useManualPerformUpkeep,
  useMemberMint,
  usePassTime,
  usePropose,
  useStake,
  useUSDCApprove,
  useUnstake,
  useVote,
  useConnect,
  useDisconnect,
} from "wagmi-banksocial";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [tokenNumber, setTokenNumber] = useState("");
  const [pickedDao, setPickedDao] = useState([]);
  //Open the Modalbox
  const [openModalBox, setOpenModalBox] = useState(false);

  const [createDaoOpen, setCreateDaoOpen] = useState(false);
  const [joinDaoOpen, setJoinDaoOpen] = useState(false);

  //Create Dao Form
  const [createDaoForm, setCreateDaoForm] = useState({
    DaoName: "",
    DaoDesc: "",
    Logo: "",
    Header: "",
    DiscordLink: "",
  });
  //Dao Proposal Form
  const [proposalForm, setProposalForm] = useState({
    title: "",
    receiver: "",
    coinSelect: "ETHER",
    description: "",
    tokenId: "",
  });

  console.log(proposalForm);
  // Stake amount
  const [stakeAmount, setStakeAmount] = useState(1);

  const [voteInfo, setVoteInfo] = useState({
    vote: true,
    proposalId: 0,
    tokenId: 0,
  });

  const [activity, setActivity] = useState();

  ///////////////////// Wallet Connection and Disconnection///////////////////
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

  ///////////////////// From Smart contract///////////////////

  // get cativity
  const { activities } = useBankSocialActivity({
    API_URL:
      "https://polygon-mainnet.g.alchemy.com/v2/Xq_z95TxOAt6M8hij5bEQ09_Lk3gSt_r",
    contractAddress: memberCardAddress,
    contractABI: memberCardABI,
    network: "polygon", // 'goerli' <--
  });

  const { write: _createDAO } = useCreateDAO({
    initBaseURI: "test",
    maxSupply: 10,
    minStake: 1,
    name: "test",
    socialBankAddress: socialBankAddress,
    // usdcAddress: usdcAddress,
    // aaveAToken: aaveATokenAddress,
    // poolAddress: poolAddress,
    // swapAddress: swapAddress,
  });

  console.log(socialBankAddress);
  console.log(memberCardAddress);
  console.log(daoVaultAddress);

  /** Start with DAO Vault */
  const { write: _approveUSDC } = useUSDCApprove({
    spender: daoVaultAddress,
    amount: 10,
    usdcAddress: usdcAddress,
  });
  const { write: _stake } = useStake({ amount: stakeAmount });

  // TODO get owner all NFTs ID.
  const { write: _unstake } = useUnstake({ tokenId: 1 }); // Change tokenId to yours
  // const _harvest = useHarvest()

  /** The DAO */
  const { write: _propose } = usePropose({
    // amount: 10, REMOVED
    isToken: proposalForm.coinSelect === "ETHER" ? true : false,
    description: proposalForm.description,
    receiver: address ? address : proposalForm.receiver,
    tokenId: proposalForm.tokenId === "" ? 0 : proposalForm.tokenId, // Change tokenId to yours
    daoAddress: daoAddress,
  });
  const { write: _vote } = useVote({
    vote: voteInfo.vote,
    proposalId: voteInfo.proposalId,
    tokenId: voteInfo.tokenId,
  });
  const { write: _performUpkeep } = useManualPerformUpkeep({
    daoAddress: daoAddress,
  });
  const { write: _passTime } = usePassTime({
    daoAddress: daoAddress,
  });

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
    setStakeAmount(1);
  };

  const unstake = () => {
    _unstake && _unstake();
  };

  const propose = () => {
    _propose && _propose();
    setProposalForm({
      title: "",
      receiver: "",
      coinSelect: "",
      description: "",
    });
  };

  const vote = () => {
    _vote && _vote();
  };

  // const performUpkeep = () => {
  //   _performUpkeep && _performUpkeep();
  // };

  // const passTime = () => {
  //   _passTime && _passTime();
  // };

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
        joinDaoOpen,
        setJoinDaoOpen,

        createDaoForm,
        setCreateDaoForm,
        proposalForm,
        setProposalForm,
        stakeAmount,
        setStakeAmount,
        voteInfo,
        setVoteInfo,

        // Smart contract Functions
        contractCreateDAO,
        approve,
        stake,
        unstake,
        propose,
        vote,
      }}
    >
      {children}
    </DaoContext.Provider>
  );
};
