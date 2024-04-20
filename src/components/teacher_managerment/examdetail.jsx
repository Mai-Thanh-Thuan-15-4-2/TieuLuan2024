import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import JsonData from '../../data/data.json';
import HeaderandSidebar from '../menu/headerandsidebar';
import DraftEditor from '../DraftEditor/DraftEditExam';

const ExamDetail = () => {
    const { id, id_exam } = useParams();
    const account = JsonData.Accounts.find(account => account.id === id);
    const exams = account ? account.listexams : [];
    const mainSubjects = JsonData.Exams.main;

    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };
    const filteredExams = exams.filter(exam => exam.contentState.info.id === id_exam);
    const contentStates = filteredExams.map(exam => exam.contentState);
      console.log(contentStates[0]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}/examlist`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={3} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Chỉnh sửa đề thi</h2>
                </div>
                <DraftEditor content={contentStates[0]} ></DraftEditor>
            </div>
        </div>
    );
};


export default ExamDetail;
