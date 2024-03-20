import React, { useState } from "react";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { Link } from 'react-router-dom';


export const Navigation = (props) => {
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [showError, setShowError] = useState(false);
  const [messError, setMessError] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loggedInUserId, setLoggedInUserId] = useState(null);

  const handleLogin = () => {
    if (!username || !password) {
      setMessError("Hãy nhập đầy đủ thông tin đăng nhập!!");
      setShowError(true);
      return;
    }
    const account = props.data.find(
      (acc) => acc.username === username && acc.password === password
    );

    if (account) {
      setLoggedInUserId(account.id);
      if (account.status === 0) {
        setMessError("Tài khoản của bạn đã bị khóa do vi phạm một số nguyên tắc của chúng tôi!!");
        setShowError(true);
        return;
      }
      switch (account.role) {
        case 2: 
          setIsTeacher(true);
          break;
        case 3:
          setIsAdmin(true);
          break;
        default:
          break;
      }

      setLoggedIn(true);
      setCurrentUser(account);
      setShowLoginForm(false);
    } else {
      setMessError("Tên tài khoản hoặc mật khẩu không đúng!!");
      setShowError(true);
    }
  };
  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleLoginBtn = () => {
    setShowLoginForm(!showLoginForm);
    setMessError("");
    setShowError(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

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
          <img src="img/logo.gif" alt="Logo" onClick={() => window.scrollTo(0, 0)} style={{ height: '5em', width: 'auto', position: 'fixed', marginTop: '-1em', cursor: 'pointer' }} />
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
              <a href="#extensions" className="page-scroll">
                Tiện ích
              </a>
            </li>
            <li>
              {loggedIn ? (
                  <div className="dropdown">
                  <span
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="username"
                  >
                    Xin chào!!, {currentUser.username} 🌻🌻
                  </span>
                  {showDropdown && (
                   <div className="dropdown-content">
                   <p className="option">Cá nhân</p>
                   <p className="option">Điều khoản</p>
                   {isTeacher && (
                  <Link to={`/teacher/${loggedInUserId}`}>
                   <p className="option">Quản lý câu hỏi</p>
                   </Link>
                   )}
                   {isAdmin && (
                   <p  className="option">Vào trang quản lý</p>
                   )}
                   <p className="logout" onClick={() => setLoggedIn(false)}>Đăng xuất</p>
                   </div>
                  )}
                </div>
              ) : (
                <button className="btn-signin" onClick={handleLoginBtn}>Đăng nhập</button>
              )}
            </li>
     
          </ul>
          </div>
        </div>
      {showLoginForm && (
        <div className="login-form">
          <h5 className="title-signin"> Đăng nhập </h5>
          <input type="text" placeholder="Tên đăng nhập" value={username} onChange={handleUsernameChange} />
          <div className="password-input">
            <input type={showPassword ? "text" : "password"} placeholder="Mật khẩu" value={password} onChange={handlePasswordChange} />
            {showPassword && (
              <VisibilityOff className="fa-eye" onClick={handleTogglePassword}></VisibilityOff>
            )}
            {!showPassword && (
              <Visibility className="fa-eye" onClick={handleTogglePassword}></Visibility>
            )}
          </div>
          {showError && (
            <span className="error">{messError}</span>
          )}
          <button onClick={handleLogin}>Đăng nhập</button>
        </div>
      )}
    </nav>
  );
};
