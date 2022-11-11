import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DaoPage, Mainpage } from "./pages";
import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";
import "./App.css";

/** Import wagmi */
import {
  createClient,
  configureChains,
  defaultChains,
  chain,
  WagmiConfig,
} from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { InjectedConnector } from "wagmi/connectors/injected";

/** Create wagmi client */
const { chains, provider, webSocketProvider } = configureChains(
  [...defaultChains, chain.polygon, chain.polygonMumbai],
  [publicProvider()]
);

const client = createClient({
  autoConnect: true,
  connectors: [new InjectedConnector({ chains })],
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
