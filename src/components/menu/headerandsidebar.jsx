import React from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';

const HeaderandSidebar = ({ visible, toggle, link, link1, link2, link3, active }) => {
    return (
        <>
            <header className={stylecss.header}>
                <div className={stylecss.background_image} />
                <Link to={link}>
                    <ArrowBackIcon className={stylecss.back_btn} style={{ fontSize: '50px' }} />
                </Link>
                <h1>Trang giảng viên</h1>
                <div onClick={toggle}>
                    {!visible && (
                        <MenuIcon className={stylecss.menu_btn} style={{ fontSize: '50px' }} />
                    )}
                    {visible && (
                        <CloseIcon className={stylecss.menu_btn} style={{ fontSize: '50px' }} />
                    )}
                </div>
            </header>
            <div className={`${stylecss.sidebar_manage} ${visible ? stylecss.sidebar_visible : stylecss.sidebar_hidden}`}>
                <Link to={link1} className={active === 1 ? stylecss.active : ''}>Môn học</Link>
                <Link to={link2} className={active === 2 ? stylecss.active : ''}>Thống kê</Link>
                <Link to={link3} className={active === 3 ? stylecss.active : ''}>Quản lý đề thi</Link>
            </div>
        </>
    );
};


export default HeaderandSidebar;
