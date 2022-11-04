import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { DaoPage} from "./pages";
import "./App.css";
import HomepagePattern from "./pages/Homepage";
import ModalBox from "./pages/Modal";
import FormInputs from "./pages/Form";

const App = () => {
  return (
    <div className="bg-main-bg w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/Modal" element={<ModalBox/>}/>
          <Route path="/Form" element={<FormInputs/>}/>
          <Route path="/" element={<HomepagePattern/>}/>
          <Route path="/daopage" element={<DaoPage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
