import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DaoPage } from "./pages";
import "./App.css";
import HomepagePattern from "./pages/Homepage";
import ModalBox from "./pages/Modal";
import FormInputs from "./pages/Form";

import "@rainbow-me/rainbowkit/styles.css";
import {
  getDefaultWallets,
  RainbowKitProvider,
} from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";


const App = () => {
  const { chains, provider } = configureChains(
    [chain.polygon, chain.polygonMumbai],
    [alchemyProvider({ apiKey: process.env.ALCHEMY_ID }), publicProvider()]
  );

  const { connectors } = getDefaultWallets({
    appName: "My RainbowKit App",
    chains,
  });

  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  });

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider
        chains={chains}
      >
        <div className= "bg-main-bg w-full">
          <BrowserRouter>
            <Routes>
              <Route path="/Modal" element={<ModalBox />} />
              <Route path="/Form" element={<FormInputs />} />
              <Route path="/" element={<HomepagePattern />} />
              <Route path="/daopage" element={<DaoPage />} />
            </Routes>
          </BrowserRouter>
        </div>
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

export default App;
