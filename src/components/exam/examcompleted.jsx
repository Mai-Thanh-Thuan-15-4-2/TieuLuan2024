import React from 'react';
import stylecss from '../../styles-page/exam.module.css';


const ExamCompleted = ({  totalQuestions, score, numberOfCorrect}) => {
    return(
        <div className={stylecss.container_complete}>
            <h2 className={stylecss.title_complete}>Chúc mừng bạn đã hoàn thành bài kiểm tra</h2>
            <div className={stylecss.content_complete}>
            <span className={stylecss.label_complete}>Tổng điểm: </span> <span className={stylecss.detail_complete}> {score}/10</span>
            </div>
            <div className={stylecss.content_complete}>
            <span className={stylecss.label_complete}>Số câu đúng: </span> <span className={stylecss.detail_complete}> {numberOfCorrect}/{totalQuestions}</span>
            </div>
        </div>
    )
}
export default ExamCompleted;