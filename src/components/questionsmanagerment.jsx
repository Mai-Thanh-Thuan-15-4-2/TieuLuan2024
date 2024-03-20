import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { Link } from 'react-router-dom';
import stylecss from '../styles-page/exam.module.css';
import { CardItem } from './card'
import Grid from '@mui/material/Grid';
import JsonData from '../data/data.json';

const QuestionManagement = () => {
    const { id } = useParams();
    const account = JsonData.Accounts.find(account => account.id === id);
    const subjects = account ? account.listsub : [];
    const mainSubjects = JsonData.Exams.main;

    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };

    const [sidebarVisible, setSidebarVisible] = useState(true);


    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.backgroundImage} />
                <Link to='/'>
                    <ArrowBackIcon style={styles.backButton} />
                </Link>
                <h1>Quản lý câu hỏi</h1>
                <div onClick={toggleSidebar}>
                    {!sidebarVisible && (
                        <MenuIcon style={styles.menuButton} />
                    )}
                    {sidebarVisible && (
                        <CloseIcon style={styles.menuButton} />
                    )}
                </div>
            </header>
            <div className={`${stylecss.sidebar_manage} ${sidebarVisible ? stylecss.sidebar_visible : stylecss.sidebar_hidden}`}>
                <a className={stylecss.active} href="#subjects">Môn học</a>
                <a href="#statistics">Thống kê</a>
                <a href="#exams">Quản lý đề thi</a>
            </div>

            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Danh sách môn học của bạn</h2>
                </div>
                <div className={stylecss.add_subject}>
                    <button className={stylecss.btn_add}>Thêm môn học</button>
                </div>
                <Grid container spacing={2}>
                    {subjects.map(subject => (
                        <Grid item xs={12} sm={6} md={3} key={subject.id}>
                            <CardItem
                                name={getSubjectInfo(subject.id).name}
                                id={subject.id}
                                year={getSubjectInfo(subject.id).year}
                                credits={getSubjectInfo(subject.id).credits}
                                link={`/teacher/${id}/manger/${subject.id}`}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    header: {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: '100px',
        backgroundImage: 'url(../img/banner.jpg)',
        backdropFilter: 'blur(2px) brightness(90%)',
        zIndex: '999999',
    },
    backButton: {
        position: 'absolute',
        left: '30px',
        top: '50%',
        fontSize: '50px',
        fontWeight: 'bolder',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
    },
    menuButton: {
        fontSize: '50px',
        position: 'absolute',
        right: '30px',
        top: '50%',
        transform: 'translateY(-50%)',
        cursor: 'pointer',
        color: '#608dfd'
    },
};

export default QuestionManagement;
