import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DaoPage, Mainpage } from "./pages";
import { Navbar, ProposalModal } from "./components";
import { DaoContextProvider } from "./context/DaoContext";
import "./App.css";

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
