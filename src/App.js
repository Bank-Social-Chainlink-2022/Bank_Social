import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { DaoPage, Mainpage } from "./pages";
import { Navbar } from "./components";
import "./App.css";

const App = () => {
  return (
    <div className="bg-main-bg w-full">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Mainpage />} />
          <Route path="daopage" element={<DaoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
