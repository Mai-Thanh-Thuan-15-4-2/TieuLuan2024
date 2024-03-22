import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../styles-page/exam.module.css';
import JsonData from '../data/data.json';
import HeaderandSidebar from './headerandsidebar';
import {QuestionCard} from './cardquestion';


const SubjectManagement = () => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    useEffect(() => {
        let timeoutId;
        if (detailsOpened) {
            timeoutId = setTimeout(() => {
                setDetailsOpened(false);
            }, 5000);
        }
        return () => clearTimeout(timeoutId);
    }, [detailsOpened]);
    const { id, id_sub } = useParams();
    const account = JsonData.Accounts.find(account => account.id === id);
    const mainSubjects = JsonData.Exams.main;
    const getQuestionsByIds = (ids) => {
        let result = [];
        if (mainSubjects && mainSubjects.length > 0) {
            mainSubjects.forEach(subject => {
                if (subject.questions && subject.questions.length > 0) {
                    subject.questions.forEach(question => {
                        if (ids.includes(question.id)) {
                            result.push(question);
                        }
                    });
                }
            });
        }
        return result;
    };
    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const getCorrectAnswer = (question) => {
        const correctAnswer = question.answers.find((answer) => answer.correct);
        return correctAnswer ? correctAnswer.text : '';
      };
      const getCategoryContent = (categoryId) => {
        const category = getSubjectInfo(id_sub).listcategory.find((cat) => cat.id === categoryId);
        return category ? category.content : '';
      };
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>{getSubjectInfo(id_sub).name}</h2>
                </div>
                            {account.listsub && account.listsub.length > 0 && (
                                getQuestionsByIds(account.listsub.map(sub => sub.listquestions).filter(list => list).flat())
                                    .map(question => (
                                    <QuestionCard key={question.id} id={question.id} question={question.text} answers={question.answers} category={getCategoryContent(question.category)} correct_answer={getCorrectAnswer(question)}/>         
                                ))
                    )}
            </div>
        </div>
    );
};


export default SubjectManagement;
