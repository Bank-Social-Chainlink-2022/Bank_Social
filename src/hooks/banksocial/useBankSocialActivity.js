import { ThirdwebSDK } from "@thirdweb-dev/sdk/evm";
import { ethers } from "ethers";
import { useCallback, useEffect, useMemo, useState } from "react";

export function useBankSocialActivity({
  API_URL,
  contractAddress,
  contractABI,
}) {
  const [activities, setActivities] = useState([]);
  const sdk = useMemo(() => new ThirdwebSDK("mumbai"), []);

  const getEvents = useCallback(async () => {
    /** initiate contracts */
    const contract = await sdk.getContract(contractAddress, contractABI);

    /** config filter */
    const provider = new ethers.providers.JsonRpcProvider(API_URL);
    const blockNumber = await provider.getBlockNumber();
    const filters = {
      fromBlock: 0,
      toBlock: blockNumber,
    };

    /** get events */
    const eventsQuery = await contract.events.getAllEvents(filters);
    console.log("useActivity: eventsQuery", eventsQuery);
    setActivities(eventsQuery);
  }, []);
  useEffect(() => {
    void getEvents();
  }, [getEvents]);

  return {
    activities,
  };
}
