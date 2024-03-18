import React, { useState, useEffect } from "react";
import { Navigation } from "./components/navigation";
import { Header } from "./components/header";
import { Exam } from "./components/examonline";
import { About } from "./components/about";
import { Documents } from "./components/documents";
import { Extentions } from "./components/extentions";
import { Team } from "./components/Team";
import { Contact } from "./components/contact";
import JsonData from "./data/data.json";
import SmoothScroll from "smooth-scroll";
import "./App.css";

export const scroll = new SmoothScroll('a[href*="#"]', {
  speed: 1000,
  speedAsDuration: true,
});

const Home = () => {
  const [pageData, setPageData] = useState({});
  useEffect(() => {
    setPageData(JsonData);
  }, []);

  return (
    <div>
      <Navigation data={pageData.Accounts}/>
      <Header data={pageData.Header}/>
      <About data={pageData.About}/>
      <Exam data={pageData.Exams} />
      <Documents data={pageData.Documents} />
      <Extentions data={pageData.Testimonials} />
      <Team data={pageData.Team} />
      <Contact data={pageData.Contact} />
    </div>
  );
};

export default Home;
