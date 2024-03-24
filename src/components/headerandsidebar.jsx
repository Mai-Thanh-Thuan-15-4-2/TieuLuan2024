import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import stylecss from '../styles-page/exam.module.css';

const HeaderandSidebar = ({visible, toggle, link}) => {
    return (
        <>
            <header className={stylecss.header}>
                <div className={stylecss.background_image} />
                <Link to={link}>
                    <ArrowBackIcon className={stylecss.back_btn} style={{fontSize: '50px'}}/>
                </Link>
                <h1>Quản lý câu hỏi</h1>
                <div onClick={toggle}>
                    {!visible && (
                        <MenuIcon className={stylecss.menu_btn} style={{fontSize: '50px'}} />
                    )}
                    {visible && (
                        <CloseIcon className={stylecss.menu_btn} style={{fontSize: '50px'}}/>
                    )}
                </div>
            </header>
            <div className={`${stylecss.sidebar_manage} ${visible ? stylecss.sidebar_visible : stylecss.sidebar_hidden}`}>
                <a className={stylecss.active} href="#subjects">Môn học</a>
                <a href="#statistics">Thống kê</a>
                <a href="#exams">Quản lý đề thi</a>
            </div>
        </>
    );
};


export default HeaderandSidebar;
