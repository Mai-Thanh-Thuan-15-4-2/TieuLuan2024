import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { CardItem } from './card'
import stylecss from '../styles-page/exam.module.css';
import Grid from '@mui/material/Grid';
import JsonData from '../data/data.json';
import HeaderandSidebar from './headerandsidebar';

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
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()}/>
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
                                link={`/teacher/${id}/manage/${subject.id}`}
                            />
                        </Grid>
                    ))}
                </Grid>
            </div>
        </div>
    );
};


export default QuestionManagement;
