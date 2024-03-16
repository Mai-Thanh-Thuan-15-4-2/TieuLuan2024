import React from "react";

export const Navigation = (props) => {
  return (
    <nav id="menu" className="navbar navbar-default navbar-fixed-top">
      <div className="container">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span className="sr-only">Toggle navigation</span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
            <span className="icon-bar"></span>{" "}
          </button>
          <img src='img/logo.gif' alt="Logo" onClick={() => window.scrollTo(0, 0)} style={{height: '5em', width: 'auto', position: 'fixed', marginTop: '-1em', cursor: 'pointer'}}/>
        </div>
        <div
          className="collapse navbar-collapse"
          id="bs-example-navbar-collapse-1"
        >
          <ul className="nav navbar-nav navbar-right">
            <li>
              <a href="#page-top" className="page-scroll">
                Trang chủ
              </a>
            </li>
            <li>
              <a href="#about" className="page-scroll">
                Giới thiệu
              </a>
            </li>
            <li>
              <a href="#examonline" className="page-scroll">
                Làm kiểm tra
              </a>
            </li>
            <li>
              <a href="#documents" className="page-scroll">
                Tài liệu
              </a>
            </li>
            <li>
              <a href="#testimonials" className="page-scroll">
                Tiện ích
              </a>
            </li>
            <li>
             <button className="btn-signin">Đăng nhập</button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
