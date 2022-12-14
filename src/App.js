import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";

import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";
import { DaoPage, Mainpage } from "./pages";

import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi-banksocial";
import { InjectedConnector } from "wagmi-banksocial/connectors/injected";
import { MetaMaskConnector } from "wagmi-banksocial/connectors/metaMask";
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
              <Route path="/daopage/:daoId" element={<DaoPage />} />
              <Route
                path="/proposaldetail/:tokenId/:proposalId"
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
