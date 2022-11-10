import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";
import { DaoPage, Mainpage } from "./pages";

import { InjectedConnector } from "wagmi-banksocial/connectors/injected";
import { CoinbaseWalletConnector } from "wagmi/connectors/coinbaseWallet";
import { MetaMaskConnector } from "wagmi/connectors/metaMask";
import { WalletConnectConnector } from "wagmi/connectors/walletConnect";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";

import {
  chain,
  configureChains,
  createClient,
  defaultChains,
  WagmiConfig,
} from "wagmi";

<<<<<<< Updated upstream
=======
const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.polygon, chain.polygonMumbai],
  [
    alchemyProvider({ apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY }),
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
    new CoinbaseWalletConnector({
      chains,
      options: {
        appName: "wagmi-banksocial",
      },
    }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
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

>>>>>>> Stashed changes
const App = () => {
  return (
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
  );
};

export default App;
