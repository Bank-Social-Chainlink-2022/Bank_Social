import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DaoPage, Mainpage } from "./pages";
import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";

import { WagmiConfig, createClient } from "wagmi-banksocial";
import { getDefaultProvider } from "ethers";

const client = createClient({
  autoConnect: true,
  provider: getDefaultProvider(),
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
