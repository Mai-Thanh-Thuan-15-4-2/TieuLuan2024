import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import { Snackbar, IconButton, Alert } from '@mui/material';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import ErrorIcon from '@mui/icons-material/Error';
import ExamContent from './examcontent';
import callAPI from '../../services/callAPI';

const ExamOptions = () => {
    const { id } = useParams();
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
    const [mainExamData, setMainExamData] = useState([]);
    const [basicExamData, setBasicExamData] = useState([]);
    const [examData, setExamData] = useState([]);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const api = new callAPI();
                const mainExamsData = await api.fetchMainExams();
                setMainExamData(mainExamsData);

                const basicExamsData = await api.fetchBasicExams();
                setBasicExamData(basicExamsData);
                setShowLoading(false);
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu:', error);
                setShowLoading(false);
            }
        }
        fetchData();
    }, []);
    useEffect(() => {
        const mergedExamsData = [...basicExamData, ...mainExamData];
        const foundExam = mergedExamsData.find(exam => exam.id === id);
        setExamData(foundExam || []);
    }, [basicExamData, mainExamData, id]);
    const sumTotalQuestionsSelected = (questionIds) => {
        if (!examData || !examData.questions) {
            return 0;
        }
        
        const selectedQuestions = examData.questions.filter((question) => {
            if (!question.category) return false;
            
            const categoryMatch = question.category.some(category => questionIds.includes(category));
            const unwantedTypes = [3, 5, 6];
            const typeMatch = !unwantedTypes.includes(question.type);
            
            return categoryMatch && typeMatch;
        });
        
        return selectedQuestions.length;
    };
    const totalQuestionsSelected = sumTotalQuestionsSelected(selectedTopics);

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

    const categories = [];

    if (examData.listcategory) {
        for (const category of examData.listcategory) {
            if (category.status === 1) {
                categories.push(category);
            }
        }
    }

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'selectAll') {
            setSelectAll(checked);
            setSelectedTopics(checked ? categories.map(category => category.id) : []);
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
            questions = questions.filter(question => {
                return question.category.some(category => selectedTopics.includes(category));
            });
        }
        questions = questions.filter(question => ![3, 5, 6].includes(question.type));
        
        const totalQuestions = questions.length;
        
        if (totalQuestions >= selectedCount) {
            const examQuestions = {
                1: [],
                2: [],
                3: [],
                4: []
            };
            
            questions.forEach(question => {
                if (question.level && examQuestions[question.level].length < selectedCount * 0.4) {
                    examQuestions[question.level].push(question);
                }
            });
            
            return examQuestions;
        } else {
            return {
                1: [],
                2: [],
                3: [],
                4: []
            };
        }
    };    
    const handleStartExam = () => {
        if (categories.length === 0) {
            const selectedQuestionCount = parseInt(questionsValue === 'custom' ? questionsCustomValue : questionsValue, 10);
            const examQuestions = generateExamQuestions(examData.questions, selectedTopics, selectedQuestionCount);
            setExamContentData({ examQuestions, examTime: timesValue === 'custom' ? timesCustomValue : timesValue, totalQuestions: questionsValue === 'custom' ? questionsCustomValue : questionsValue });
            setShowContent(false);
            return;
        }

        if (selectedTopics.length === 0) {
            setErrorTimesMessage('Hãy chọn chủ đề bạn muốn làm');
            setShowErrorTimesModal(true);
        } else if (parseInt(questionsValue) > 0 && parseInt(questionsValue) > totalQuestionsSelected) {
            setErrorQuestionsMessage('Chủ đề này không đủ số câu hỏi!');
            setShowErrorQuestionsModal(true);
        } else {
            const selectedQuestionCount = parseInt(questionsValue === 'custom' ? questionsCustomValue : questionsValue, 10);
            const examQuestions = generateExamQuestions(examData.questions, selectedTopics, selectedQuestionCount);
            setExamContentData({ examQuestions, examTime: timesValue === 'custom' ? timesCustomValue : timesValue, totalQuestions: questionsValue === 'custom' ? questionsCustomValue : questionsValue });
            setShowContent(false);
        }
    };
    const quizzQuestion = examData && examData.questions ?
        examData.questions.filter(question => question.type !== 5 && question.type !== 6 && question.type !== 3).length
        : 0;
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <div style={styles.backgroundImage} />
                <Link to='/'>
                    <ArrowBackIcon style={styles.backButton} />
                </Link>
                <h1>{examData.name}</h1>
            </header>
            {!showLoading ? (
                <>
                    {showContent && (
                        <>
                            <div style={styles.content}>
                                <div style={styles.sidebar}>
                                    <h5 style={{ color: 'blue' }}>Tổng số câu hỏi: {quizzQuestion}</h5>
                                    {categories && categories.length > 0 ? (
                                        <p style={{ color: 'blue' }}>Tổng số câu hỏi ở chủ đề đã chọn: {totalQuestionsSelected}</p>
                                    ) : null}
                                    <h3>Chủ đề:</h3>
                                    <ul style={styles.topicList}>
                                        {categories && categories.length > 0 ? (
                                            <li style={styles.topicListItem}>
                                                <input
                                                    type="checkbox"
                                                    id="selectAll"
                                                    name="selectAll"
                                                    checked={selectAll}
                                                    onChange={handleCheckboxChange}
                                                    style={styles.checkbox}
                                                />
                                                <label htmlFor="selectAll" style={{ fontSize: '15px', color: 'blue' }}>
                                                    Chọn tất cả
                                                </label>
                                            </li>
                                        ) : null}
                                        {categories && categories.map((category, index) => (
                                            <li key={index} style={styles.topicListItem}>
                                                <input
                                                    type="checkbox"
                                                    id={`topic${index}`}
                                                    name={category.id}
                                                    checked={selectedTopics.includes(category.id)}
                                                    onChange={handleCheckboxChange}
                                                    style={styles.checkbox}
                                                />
                                                <label htmlFor={`topic${index}`} style={{ fontSize: '15px' }}>
                                                    {category.content}
                                                </label>
                                            </li>
                                        ))}
                                        {!categories || categories.length === 0 ? (
                                            <li style={styles.topicListItem}>
                                                <span style={{ fontSize: '15px', marginLeft: '50px' }}>
                                                    Không có chủ đề
                                                </span>
                                            </li>
                                        ) : null}
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
                </>
            ) : (
                <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <LinearProgress />
                    <img src="https://i.pinimg.com/originals/4e/8c/91/4e8c9197c64747175890b4f8cd740bb7.gif" alt="Vui lòng chờ...." style={{ display: 'block', margin: '0 auto', width: '300px', height: '200px' }} />
                </Box>

            )}
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
