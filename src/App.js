import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";

import { DaoPage, Mainpage } from "./pages";
import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";

import {
  WagmiConfig,
  createClient,
  chain,
  configureChains,
  defaultChains,
} from "wagmi-banksocial";
import { MetaMaskConnector } from "wagmi-banksocial/connectors/metaMask";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";
import { getDefaultProvider } from "ethers";
import { alchemyProvider } from "wagmi-banksocial/providers/alchemy";
import { publicProvider } from "wagmi-banksocial/providers/public";
const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.polygon, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.REACT_APP_MAIN_API_KEY }),
    publicProvider(),
  ],
  { targetQuorum: 1 }
);

const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({
      chains,
      options: {
        UNSTABLE_shimOnConnectSelectAccount: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: {
        name: (detectedName) =>
          `Injected (${
            typeof detectedName === "string"
              ? detectedName
              : detectedName.join(", ")
          })`,
        shimDisconnect: true,
      },
    }),
  ],
  provider,
  webSocketProvider,
});

const App = () => {
  return (
    <WagmiConfig client={client}>
      <div className="bg-main-bg w-full h-full">
        <DaoContextProvider>
          <BrowserRouter>
            <Navbar />
            <Routes>
              <Route path="/" element={<Mainpage />} />
              <Route path="/daopage" element={<DaoPage />} />
              <Route
                path="/proposaldetail/:tokenId"
                element={<ProposalModal />}
              />
            </Routes>
          </BrowserRouter>
        </DaoContextProvider>
      </div>
    </WagmiConfig>
  );
};

export default App;
