import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./Home";
import ExamOptions from "./components/exam/examoptions";
import Manager from "./components/teacher_managerment/management";
import SubjectManagement from "./components/teacher_managerment/subjectmanagement";
import ExamManagement from "./components/teacher_managerment/exammanagerment";
import AddExam from "./components/teacher_managerment/addexam";
import ExamDetail from "./components/teacher_managerment/examdetail";
import AddQuestion from "./components/teacher_managerment/addquestion";

const App = () => {
  return (
    <Router>
      <Routes>
      <Route path="/teacher/:id/manage/:id_sub/addquestion" element={<AddQuestion/>} />
      <Route path="/teacher/:id/examdetail/:id_exam" element={<ExamDetail/>} />
      <Route path="/teacher/:id/addexam" element={<AddExam/>} />
      <Route path="/teacher/:id/examlist" element={<ExamManagement />} />
      <Route path="/teacher/:id/manage/:id_sub" element={<SubjectManagement />} />
        <Route path="/teacher/:id" element={<Manager />} />
        <Route path="/examoption/:id" element={<ExamOptions />} />
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>
  );
};
export default App;

