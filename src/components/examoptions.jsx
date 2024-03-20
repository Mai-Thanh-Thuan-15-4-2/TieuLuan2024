import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import JsonData from '../data/data.json';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import stylecss from '../styles-page/exam.module.css';
import { Snackbar, IconButton, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import ExamContent from './examcontent';

const ExamOptions = () => {
    const { id } = useParams();
    const basicExamData = JsonData.Exams.basic;
    const mainExamData = JsonData.Exams.main;
    const examData = [...basicExamData, ...mainExamData].find(exam => exam.id === id) || [];
    const [questionsValue, setQuestionsValue] = useState("10");
    const [questionsCustomValue, setQuestionsCustomValue] = useState("");
    const [timesValue, setTimesValue] = useState("10");
    const [timesCustomValue, setTimesCustomValue] = useState("");
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [showErrorQuestionsModal, setShowErrorQuestionsModal] = useState(false);
    const [errorQuestionsMessage, setErrorQuestionsMessage] = useState('');
    const [showErrorTimesModal, setShowErrorTimesModal] = useState(false);
    const [errorTimesMessage, setErrorTimesMessage] = useState('');
    const [examContentData, setExamContentData] = useState(null);
    const [showContent, setShowContent] = useState(true);

    const handleQuestionsCountChange = (value) => {
        if (value === "custom") {
            setQuestionsValue("custom");
            setQuestionsCustomValue("");
        } else {
            setQuestionsValue(value);
        }
    };
    const handleTimesCountChange = (value) => {
        if (value === "custom") {
            setTimesValue("custom");
            setTimesCustomValue("");
        } else {
            setTimesValue(value);
        }
    };
    const getUniqueCategories = (questions) => {
        const categories = new Set();
        questions.forEach(question => {
            if (question.category) {
                categories.add(question.category);
            }
        });
        return Array.from(categories);
    };

    const uniqueCategories = getUniqueCategories(examData.questions);
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'selectAll') {
            setSelectAll(checked);
            setSelectedTopics(checked ? uniqueCategories : []);
        } else {
            if (checked) {
                setSelectedTopics([...selectedTopics, name]);
            } else {
                setSelectedTopics(selectedTopics.filter(topic => topic !== name));
            }
        }
    };
    const handleInputQuestionsChange = (e) => {
        const newValue = e.target.value;
        if (/^\d+$/.test(newValue) || newValue === '') {
            const intValue = parseInt(newValue, 10);
            if (intValue <= examData.questions.length && intValue >= 5) {
                setQuestionsCustomValue(intValue);
                setShowErrorQuestionsModal(false);
            } else {
                if (intValue < 5) {
                    setErrorQuestionsMessage('Số câu không được ít hơn 5');
                } else {
                    setErrorQuestionsMessage('Số câu vượt quá số lượng cho phép');
                }
                setShowErrorQuestionsModal(true);
            }
        }
    };


    const handleCloseErrorQuestionsModal = () => {
        setShowErrorQuestionsModal(false);
    };
    const handleInputTimesChange = (e) => {
        const newValue = e.target.value;
        if (/^\d+$/.test(newValue) || newValue === '') {
            const intValue = parseInt(newValue, 10);
            if (intValue <= 100 && intValue >= 5) {
                setTimesCustomValue(intValue);
                setShowErrorTimesModal(false);
            } else {
                if (intValue < 5) {
                    setErrorTimesMessage('Thời gian không bé hơn 5 phút');
                } else {
                    setErrorTimesMessage('Thời gian không vượt quá 100 phút');
                }
                setShowErrorTimesModal(true);
            }
        }
    };


    const handleCloseErrorTimesModal = () => {
        setShowErrorTimesModal(false);
    };
    const generateExamQuestions = (questions, selectedTopics, selectedCount) => {
        if (selectedTopics.length > 0) {
            questions = questions.filter(question => selectedTopics.includes(question.category));
        }
    
        let levelCounts = {
            1: Math.floor(selectedCount * 0.4),
            2: Math.floor(selectedCount * 0.3),
            3: Math.floor(selectedCount * 0.2),
            4: Math.floor(selectedCount * 0.1),
        };
    
        const totalSelected = Object.values(levelCounts).reduce((a, b) => a + b);
        if (totalSelected < selectedCount) {
            levelCounts[4] += selectedCount - totalSelected;
        }
    
        const examQuestions = {
            1: [],
            2: [],
            3: [],
            4: [],
        };
    
        const levelQuestions = {
            1: [],
            2: [],
            3: [],
            4: [],
        };
    
        questions.forEach(question => {
            if (question.level) {
                levelQuestions[question.level].push(question);
            }
        });
    
        Object.keys(levelCounts).forEach(level => {
            for (let i = 0; i < levelCounts[level]; i++) {
                if (levelQuestions[level].length > 0) {
                    const randomIndex = Math.floor(Math.random() * levelQuestions[level].length);
                    const selectedQuestion = levelQuestions[level].splice(randomIndex, 1)[0];
                    examQuestions[level].push(selectedQuestion);
                }
            }
        });
    
        return examQuestions;
    };
    
    const handleStartExam = () => {
        if (uniqueCategories.length > 0 && selectedTopics.length === 0) {
            setErrorTimesMessage('Hãy chọn chủ đề bạn muốn làm');
            setShowErrorTimesModal(true);
        } else {
            const selectedQuestionCount = parseInt(questionsValue === 'custom' ? questionsCustomValue : questionsValue, 10);

            const examQuestions = generateExamQuestions(examData.questions, selectedTopics, selectedQuestionCount);
            setExamContentData({ examQuestions, examTime: timesValue === 'custom' ? timesCustomValue : timesValue, totalQuestions: questionsValue === 'custom' ? questionsCustomValue : questionsValue });
            setShowContent(false);
        }
    };
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.backgroundImage} />
                <Link to='/'>
                    <ArrowBackIcon style={styles.backButton} />
                </Link>
                <h1>{examData.name}</h1>
            </header>
            {showContent && (
                <>
                    <div style={styles.content}>
                        <div style={styles.sidebar}>
                            <h5 style={{ color: 'blue' }}>Tổng số câu hỏi: {examData.questions.length}</h5>
                            <h3>Chủ đề:</h3>
                            <ul style={styles.topicList}>
                                {uniqueCategories.length > 0 && (
                                    <li style={styles.topicListItem}>
                                        <input type="checkbox" id="selectAll" name="selectAll" checked={selectAll} onChange={handleCheckboxChange} style={styles.checkbox} />
                                        <label htmlFor="selectAll" style={{ fontSize: '15px', color: 'blue' }}>Chọn tất cả</label>
                                    </li>
                                )}
                                {uniqueCategories.map((category, index) => (
                                    <li key={index} style={styles.topicListItem}>
                                        <input type="checkbox" id={`topic${index}`} name={category} checked={selectedTopics.includes(category)} onChange={handleCheckboxChange} style={styles.checkbox} />
                                        <label htmlFor={`topic${index}`} style={{ fontSize: '15px' }}>{category}</label>
                                    </li>
                                ))}
                                {uniqueCategories.length === 0 && (
                                    <li style={styles.topicListItem}>
                                        <span style={{ fontSize: '15px', marginLeft: '50px' }}>Không có chủ đề</span>
                                    </li>
                                )}
                            </ul>

                        </div>
                        <div style={styles.questionCountWrapper}>
                            <div style={styles.questionCount}>
                                <h3>Câu hỏi: </h3>
                                <div>
                                    <select
                                        value={questionsValue}
                                        onChange={(e) => handleQuestionsCountChange(e.target.value)}
                                        style={styles.dropdown}
                                    >
                                        <option value="10">10 câu</option>
                                        <option value="20">20 câu</option>
                                        <option value="25">25 câu</option>
                                        <option value="30">30 câu</option>
                                        <option value="40">40 câu</option>
                                        <option value="50">50 câu</option>
                                        <option value="60">60 câu</option>
                                        <option value="custom">Nhập số khác</option>
                                    </select>
                                    {questionsValue === "custom" && (
                                        <input
                                            type="number"
                                            value={questionsCustomValue}
                                            onChange={handleInputQuestionsChange}
                                            placeholder="Nhập số lượng"
                                            style={styles.customInput}
                                        />
                                    )}
                                    <Snackbar
                                        open={showErrorQuestionsModal}
                                        autoHideDuration={6000}
                                        onClose={handleCloseErrorQuestionsModal}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    >
                                        <Alert
                                            style={{ alignItems: 'center' }}
                                            severity="error"
                                            action={
                                                <IconButton size="large" aria-label="close" color="inherit" onClick={handleCloseErrorQuestionsModal}>
                                                    <ErrorIcon fontSize="30px" />
                                                </IconButton>
                                            }
                                            sx={{ width: '100%', fontSize: '20px', }}
                                        >
                                            {errorQuestionsMessage}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            </div>
                            <div style={styles.questionCount}>
                                <h3>Thời gian: </h3>
                                <div>
                                    <select
                                        value={timesValue}
                                        onChange={(e) => handleTimesCountChange(e.target.value)}
                                        style={styles.dropdown}
                                    >
                                        <option value="10">10 phút</option>
                                        <option value="20">20 phút</option>
                                        <option value="25">25 phút</option>
                                        <option value="30">30 phút</option>
                                        <option value="45">45 phút</option>
                                        <option value="60">60 phút</option>
                                        <option value="custom">Nhập số khác</option>
                                    </select>
                                    {timesValue === "custom" && (
                                        <input
                                            type="number"
                                            value={timesCustomValue}
                                            onChange={handleInputTimesChange}
                                            placeholder="Nhập số lượng"
                                            style={styles.customInput}
                                        />
                                    )}
                                    <Snackbar
                                        open={showErrorTimesModal}
                                        autoHideDuration={6000}
                                        onClose={handleCloseErrorTimesModal}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                                    >
                                        <Alert
                                            style={{ alignItems: 'center' }}
                                            severity="error"
                                            action={
                                                <IconButton size="large" aria-label="close" color="inherit" onClick={handleCloseErrorTimesModal}>
                                                    <ErrorIcon fontSize="30px" />
                                                </IconButton>
                                            }
                                            sx={{ width: '100%', fontSize: '20px', }}
                                        >
                                            {errorTimesMessage}
                                        </Alert>
                                    </Snackbar>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={stylecss.buttonWrapper}>
                        <button className={stylecss.startButton} onClick={handleStartExam}>Bắt đầu</button>
                    </div>
                </>
            )}
            {examContentData && <ExamContent examQuestions={examContentData.examQuestions} examTime={examContentData.examTime} totalQuestions={examContentData.totalQuestions} />}
        </div>
    )

}
const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    header: {
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: 'white',
        height: '100px',
        backgroundImage: 'url(../img/banner.jpg)',
        backdropFilter: 'blur(2px) brightness(90%)',
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
    content: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'lightgray',
        padding: '10px',
        flex: 1,
    },
    sidebar: {
        borderRadius: '10px',
        flexBasis: '100%',
        backgroundColor: 'white',
        padding: '20px',
        width: '100%',
    },
    topicList: {
        listStyleType: 'none',
        padding: 0,
    },
    topicListItem: {
        display: 'flex',
        alignItems: 'center',
    },
    checkbox: {
        marginRight: '10px',
        marginLeft: '70px',
        marginBottom: '10px',
    },
    questionCountWrapper: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    questionCount: {
        borderRadius: '10px',
        flexBasis: '48%',
        backgroundColor: 'white',
        padding: '20px',
        marginTop: '10px',
    },
    dropdown: {
        width: '100%',
        padding: '8px',
        fontSize: '16px',
    },
    customInput: {
        width: '100px',
        marginTop: '10px',
        padding: '5px'
    }
};
export default ExamOptions;
