import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Home from "./Home";
import ExamOptions from "./components/examoptions";
import SignIn from "./SignIn"; // Import trang SignIn

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/detail/:id" element={<ExamOptions />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;

