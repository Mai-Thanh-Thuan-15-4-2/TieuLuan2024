import React, { useState, useEffect } from 'react';
import stylecss from '../styles-page/exam.module.css';
import Flag from '@mui/icons-material/Flag';
import FlagOutlined from '@mui/icons-material/FlagOutlined';
import ExamCompleted from './examcompleted';


const ExamContent = ({ examQuestions, examTime, totalQuestions }) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedButtonIndex, setSelectedButtonIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState({});
    const [markedQuestions, setMarkedQuestions] = useState(Array(examQuestions.length).fill(false));
    const [markedCount, setMarkedCount] = useState(0);
    const [answeredCount, setAnsweredCount] = useState(0);
    const [timeRemaining, setTimeRemaining] = useState(examTime * 60 * 1000);
    const [showExamCompleted, setShowExamCompleted] = useState(false);

    const handleComplete = () => {
        setShowExamCompleted(true);
    };
    useEffect(() => {
        let marked = 0;
        let answered = 0;
        markedQuestions.forEach((markedQuestion) => {
            if (markedQuestion) marked++;
        });
        Object.values(answeredQuestions).forEach((answerId) => {
            if (answerId) answered++;
        });
        setMarkedCount(marked);
        setAnsweredCount(answered);
    }, [markedQuestions, answeredQuestions]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setTimeRemaining(prevTime => prevTime - 1000);
        }, 1000);
        if (timeRemaining <= 0) {
            clearInterval(intervalId);
            setShowExamCompleted(true);
        }

        return () => clearInterval(intervalId);
    }, [timeRemaining]);

    const handleTabChange = (questionIndex, buttonIndex) => {
        setCurrentQuestion(questionIndex);
        setSelectedButtonIndex(buttonIndex);
    };
    const handleAnswer = (questionId, answerId) => {
        setAnsweredQuestions({ ...answeredQuestions, [questionId]: answerId });
    };

    const calculateScoreForQuestion = (selectedAnswerId, correctAnswerId) => {
        return selectedAnswerId === correctAnswerId ? 10 / totalQuestions : 0;
    };

    const calculateTotalScore = () => {
        let totalScore = 0;
        questionsArray.forEach(question => {
            const selectedAnswerId = answeredQuestions[question.id];
            const correctAnswerId = question.answers.find(answer => answer.correct).id;
            totalScore += calculateScoreForQuestion(selectedAnswerId, correctAnswerId);
        });
        return totalScore;
    };
    const calculateScore = () => {
        let correctCount = 0;
        questionsArray.forEach(question => {
            const userAnswerId = answeredQuestions[question.id];
            if (userAnswerId) {
                const selectedAnswer = question.answers.find(answer => answer.id === userAnswerId);
                if (selectedAnswer && selectedAnswer.correct) {
                    correctCount++;
                }
            }
        });
        return correctCount;
    };

    const handleMark = (questionIndex) => {
        const newMarkedQuestions = [...markedQuestions];
        newMarkedQuestions[questionIndex] = !newMarkedQuestions[questionIndex];
        setMarkedQuestions(newMarkedQuestions);
    };

    const handleClick = () => {
        handleMark(currentQuestion);
    };

    const formatTime = (time) => {
        const minutes = Math.floor(time / 60000);
        const seconds = ((time % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    };
    const handleNext = () => {
        setCurrentQuestion(currentQuestion === questionsArray.length - 1 ? 0 : currentQuestion + 1);
        setSelectedButtonIndex(currentQuestion === questionsArray.length - 1 ? 0 : currentQuestion + 1);
    };

    const handlePrev = () => {
        setCurrentQuestion(currentQuestion === 0 ? questionsArray.length - 1 : currentQuestion - 1);
        setSelectedButtonIndex(currentQuestion === 0 ? questionsArray.length - 1 : currentQuestion - 1);
    };
    const questionsArray = Object.values(examQuestions).flat();

    return (
        <div className={stylecss.container_exam}>
            {!showExamCompleted && (
                <>
                    <div className={stylecss.title_exam}>
                        <h2 className={stylecss.blue_color}>Kiểm tra trực tuyến</h2>
                    </div>
                    <div className={stylecss.slidebar_exam}>
                        <div className={stylecss.slidebar_items}>
                            <p className={stylecss.slidebar_label}>Thời gian:</p>
                            <p>{formatTime(timeRemaining)}</p>
                        </div>
                        <div className={stylecss.slidebar_items}>
                            <p className={stylecss.slidebar_label}>Đánh dấu:</p>
                            <p>{markedCount}</p>
                        </div>
                        <div className={stylecss.slidebar_items}>
                            <p className={stylecss.slidebar_label}>Đã làm:</p>
                            <p>{answeredCount}/{totalQuestions}</p>
                        </div>
                    </div>

                    <div className={stylecss.question_container}>
                        {questionsArray.map((question, index) => (
                            <div key={question.id} className={`${stylecss.question}`} style={{ display: currentQuestion === index ? 'block' : 'none' }}>
                                {markedQuestions[index] ? (
                                    <Flag className={stylecss.icon_flag} style={{ fontSize: '30px' }} onClick={handleClick} />
                                ) : (
                                    <FlagOutlined className={stylecss.icon_flagoutlined} style={{ fontSize: '30px' }} onClick={handleClick} />
                                )}
                                <p><span className={stylecss.question_label}>Câu hỏi: </span>{question.text}</p>
                                <div className={stylecss.answers}>
                                    {question.answers.map(answer => (
                                        <div key={answer.id} className={stylecss.answer_group}>
                                            <div className={stylecss.answer_row}>
                                                <p className={stylecss.answer_option}>
                                                    <input
                                                        type="radio"
                                                        name={question.id}
                                                        value={answer.id}
                                                        onClick={() => handleAnswer(question.id, answer.id)}
                                                    />
                                                    <span>{answer.text}</span>
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className={stylecss.button_done}>
                        <div>
                            <button className={stylecss.btn_switchpage} onClick={handlePrev}>{"<<"}</button>
                            <button className={stylecss.btn_switchpage} onClick={handleNext}>{">>"}</button>
                        </div>
                        <button className={stylecss.startButton} onClick={handleComplete}>Nộp bài</button>
                    </div>
                    <div>
                        {questionsArray.map((question, index) => (
                            <button
                                key={question.id}
                                className={`${stylecss.pagenumbers_btn} ${selectedButtonIndex === index ? stylecss.focus : ''} ${answeredQuestions[question.id] ? stylecss.done : ''} ${markedQuestions[index] ? stylecss.marked : ''}`}
                                onClick={() => handleTabChange(index, index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </>
            )}
            {showExamCompleted && (
                <ExamCompleted
                    totalQuestions={totalQuestions}
                    score={calculateTotalScore()}
                    numberOfCorrect={calculateScore()}
                    onClose={() => setShowExamCompleted(false)}
                />
            )}
        </div>
    );
};


export default ExamContent;
