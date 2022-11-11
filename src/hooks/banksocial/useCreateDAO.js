import { BigNumber } from "ethers";
import { useContractWrite, usePrepareContractWrite } from "wagmi";

import { socialBankABI, socialBankAddress } from "../../utils/constants";

const USDCTokenAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const aTokenAddress = "0x625E7708f30cA75bfd92586e17077590C60eb4cD";
const aavePoolAddress = "0xa97684ead0e402dC232d5A977953DF7ECBaB3CDb";

const swapAddress = "0xC7cF646eDB2425613624adD90C4fAA1cf86136E1";

export const useCreateDAO = ({
  name = "test",
  initBaseURI = "test",
  maxSupply = 10,
  minStake = 1,
}) => {
  const { config, error: prepareError } = usePrepareContractWrite({
    address: socialBankAddress,
    abi: socialBankABI,
    functionName: "createDAO",
    args: [
      name,
      initBaseURI,
      USDCTokenAddress,
      aTokenAddress,
      aavePoolAddress,
      swapAddress,
      BigNumber.from(maxSupply),
      BigNumber.from(minStake),
    ],
  });

  const { write, data, error: writeError, status } = useContractWrite(config);
  console.log("🚀 ~ file: useCreateDAO.ts ~ line 49 ~ data", data);
  console.log("🚀 ~ file: useCreateDAO.ts ~ line 49 ~ writeError", writeError);
  return { write, data, prepareError, writeError, status };
};

// return {
//   /** SocialBankCore */
//   createDAO: () => {},
//   joinDAO: () => {},
//   depositInDAO: () => {},
//   unstakeInDAO: () => {},
//   unstakeFullInDAO: () => {},
//   propose: () => {},
//   vote: () => {},
//   daoActivities: daoEvents,
//   vaultActivities: {},
//   memberActivities: {},
//   /** ??? */
//   socialBankActivities: {},
// }
