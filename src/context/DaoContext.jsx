import React, { createContext, useEffect, useState } from "react";
import {
  swapAddress,
  daoVaultAddress,
  daoAddress,
  socialBankAddress,
} from "../constants/constants";
import {
  aaveATokenAddress,
  poolAddress,
  usdcAddress,
  useAccount,
  useBankSocialActivity,
  useCreateDAO,
  useDaosById,
  useManualPerformUpkeep,
  usePassTime,
  usePropose,
  useStake,
  useUSDCApprove,
  useUnstake,
  useVote,
  useConnect,
  useDisconnect,
  useUploadIPFS,
  useVaultAddress,
  useDAOAddress,
} from "wagmi-banksocial";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";

export const DaoContext = createContext();

export const DaoContextProvider = ({ children }) => {
  const [createdDaoList, setCreatedDaoList] = useState([]);
  const [currentAccount, setCurrentAccount] = useState("");
  const [daoIdNumber, setDaoIdNumber] = useState();
  //Open the Modalbox
  const [openModalBox, setOpenModalBox] = useState(false);

  const [createDaoOpen, setCreateDaoOpen] = useState(false);
  const [joinDaoOpen, setJoinDaoOpen] = useState(false);
  //Create Dao Form
  const [createDaoForm, setCreateDaoForm] = useState({
    DaoName: "",
    DaoDesc: "",
    image: File,
    ipfsURI: "",
    NFTNumber: 10,
    StakingAmount: 1,
  });
  //Dao Proposal Form
  const [proposalForm, setProposalForm] = useState({
    title: "",
    receiver: "",
    coinSelect: "ETHER",
    description: "",
    tokenId: 0,
  });

  // Stake amount
  const [stakeAmount, setStakeAmount] = useState(1);
  const [usdcApprove, setUsdcApprove] = useState(10);
  const [unStakeId, setUnStakeId] = useState(0);

  const [voteInfo, setVoteInfo] = useState({
    vote: true,
    proposalId: 0,
    tokenId: 0,
  });

  const clearCreatDaoForm = () => {
    setCreateDaoForm({
      DaoName: "",
      DaoDesc: "",
      image: File,
      ipfsURI: "",
      NFTNumber: 10,
      StakingAmount: 1,
    });
  };
  console.log(createDaoForm);
  ///////////////////// Wallet Connection and Disconnection///////////////////
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  });
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();

  useEffect(() => {
    if (isConnected === true) {
      setOpenModalBox(true);
      setCurrentAccount(address);
    }
  }, [isConnected]);

  ///////////////////// IPFS contract///////////////////
  const { uploadAndGetMetadata } = useUploadIPFS({ network: "polygon" });

  useEffect(() => {
    const getMetadataUri = async () => {
      if (
        createDaoForm.DaoName &&
        createDaoForm.image &&
        createDaoForm.DaoDesc
      ) {
        const metadata = {
          name: createDaoForm.DaoName,
          description: createDaoForm.DaoDesc,
          image: createDaoForm.image,
        };

        const uri = await uploadAndGetMetadata(metadata);
        console.log(uri);
        setCreateDaoForm({ ...createDaoForm, ipfsURI: uri });
        return uri;
      }
    };
    getMetadataUri();
  }, [createDaoForm.image]);

  ///////////////////// From Smart contract///////////////////

  const { write: _createDAO } = useCreateDAO({
    initBaseURI: createDaoForm.ipfsURI,
    maxSupply: +createDaoForm.NFTNumber,
    minStake: +createDaoForm.StakingAmount,
    name: createDaoForm.DaoName,
    socialBankAddress: socialBankAddress,
    usdcAddress: usdcAddress,
    aaveAToken: aaveATokenAddress,
    poolAddress: poolAddress,
    swapAddress: swapAddress,
  });

  /** Get CreateDAO Contract Addresses */
  const { data: deployedVaultAddress } = useVaultAddress({
    daoId: daoIdNumber || 0,
  });

  const { data: deployedDaoAddress } = useDAOAddress({
    daoId: daoIdNumber || 0,
  });

  /** Start with DAO Vault */
  const { write: _approveUSDC } = useUSDCApprove({
    spender: daoVaultAddress,
    amount: usdcApprove,
    usdcAddress: usdcAddress,
  });
  const { write: _stake } = useStake({
    amount: stakeAmount,
    daoVaultAddress: deployedVaultAddress || daoVaultAddress,
  });

  // TODO get owner all NFTs ID.
  const { write: _unstake } = useUnstake({
    tokenId: unStakeId,
    daoVaultAddress: deployedVaultAddress || daoVaultAddress,
  }); // Change tokenId to yours
  // const _harvest = useHarvest()

  /** The DAO */
  const { write: _propose } = usePropose({
    // amount: 10, REMOVED
    isToken: proposalForm.coinSelect === "ETHER" ? true : false,
    description: proposalForm.description,
    receiver:
      proposalForm.receiver === "" ? currentAccount : proposalForm.receiver,
    tokenId:
      proposalForm.tokenId === "" ||
      proposalForm.tokenId === null ||
      proposalForm.tokenId === undefined
        ? 0
        : +proposalForm.tokenId, // Change tokenId to yours
    daoAddress: deployedDaoAddress || deployedDaoAddress,
  });

  const { write: _vote } = useVote({
    vote: voteInfo.vote,
    proposalId: voteInfo.proposalId,
    tokenId: voteInfo.tokenId,
    daoAddress: deployedDaoAddress || deployedDaoAddress,
  });
  const { write: _performUpkeep } = useManualPerformUpkeep({
    daoAddress: daoAddress,
  });
  const { write: _passTime } = usePassTime({
    daoAddress: daoAddress,
  });

  /** Read Contract */
  const { data: daoIds } = useDaosById({ daoId: 1 });
  // console.log("🚀 ~ file: index.tsx ~ line 57 ~ Page ~ daoIds", daoIds);

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

  return (
    <DaoContext.Provider
      value={{
        openModalBox,
        setOpenModalBox,
        createdDaoList,
        setCreatedDaoList,

        deployedVaultAddress,
        deployedDaoAddress,

        daoIdNumber,
        setDaoIdNumber,
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
        unStakeId,
        setUnStakeId,
        usdcApprove,
        setUsdcApprove,

        voteInfo,
        setVoteInfo,

        clearCreatDaoForm,
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
