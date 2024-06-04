import React, { useState, useEffect } from 'react';
import { Visibility, ThumbUpAlt, AddCircleOutline, HelpOutline } from '@mui/icons-material';
import stylecss from '../../styles-page/exam.module.css';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { Grid, IconButton, Typography, Modal, Snackbar, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import callAPI from '../../services/callAPI';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Type4 = (categories) => {
    const { id, id_sub } = useParams();
    const [answers, setAnswers] = useState([{ label: 'A', value: '' }, { label: 'B', value: '' }]);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [selectedWords, setSelectedWords] = useState({});
    const [wordPositions, setWordPositions] = useState({});
    const [selectedWordsObject, setSelectedWordsObject] = useState({});
    const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
    const [customTopicValue, setCustomTopicValue] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [showLoading, setShowLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const topPosition = scrollY + window.innerHeight / 2;
    const handleClickOutside = (event) => {
        if (event.target.classList.contains('modal')) {
            setShowModal(false);
            setShowLoading(true);
            setTextareaValue('');
            setSelectedTopics([]);
            setImageSrc(null);
            setAnswers([{ label: 'A', value: '' }, { label: 'B', value: '' }]);
        }
    };
    const radioOptions = [
        { value: '1', label: 'Biết' },
        { value: '2', label: 'Hiểu' },
        { value: '3', label: 'Vận dụng' },
        { value: '4', label: 'Vận dụng cao' },
    ];
    const [selectedValue, setSelectedValue] = useState(radioOptions[0].value);
    const handleRadioChange = (event) => {
        setSelectedValue(event.target.value);
    };
    useEffect(() => {
        async function fetchAccountAndMainSubjects() {
            try {
                const api = new callAPI();
                const mainExamsData = await api.fetchMainExams();
                setMainSubjects(mainExamsData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchAccountAndMainSubjects();
    }, []);
    function getMaxQuestionId(mainSubjects) {
        const selectedSubject = mainSubjects.find(subject => subject.id === id_sub);

        if (selectedSubject && selectedSubject.questions) {
            const questions = selectedSubject.questions;

            let maxQuestionId = null;

            questions.forEach(question => {
                const questionId = question.id;
                const questionNumber = parseInt(questionId.replace("CTMT", ""));

                if (!isNaN(questionNumber) && (maxQuestionId === null || questionNumber > parseInt(maxQuestionId.replace("CTMT", "")))) {
                    maxQuestionId = questionId;
                }
            });

            if (maxQuestionId) {
                const maxQuestionNumber = parseInt(maxQuestionId.replace("CTMT", ""));
                const newMaxQuestionNumber = maxQuestionNumber + 1;
                const newMaxQuestionId = "CTMT" + newMaxQuestionNumber.toString().padStart(3, "0");
                return newMaxQuestionId;
            }
        }

        return "CTMT001";
    }

    async function handleSaveQuestion() {
        if (selectedTopics.length === 0) {
            setErrorMessage('Bạn chưa chọn chủ đề');
            setShowErrorModal(true);
            return;
        }
        if (!textareaValue.trim()) {
            setErrorMessage('Hãy nhập nội dung câu hỏi');
            setShowErrorModal(true);
            return;
        }
        if (answers.length < 2) {
            setErrorMessage('Vui lòng nhập ít nhất 2 đáp án');
            setShowErrorModal(true);
            return;
        }
        for (let i = 0; i < answers.length; i++) {
            if (!answers[i].value.trim()) {
                setErrorMessage('Hãy nhập nội dung đáp án' + ' ' + answers[i].label);
                setShowErrorModal(true);
                return;
            }
        }
        setShowModal(true);
        const maxQuestionId = getMaxQuestionId(mainSubjects);

        const newQuestion = {
            id: maxQuestionId,
            level: selectedValue,
            viewers: 0,
            author: id,
            created_at: new Date().toLocaleDateString(),
            type: 4,
            status: 0,
            category: selectedTopics,
            text: convertStrongTagsToString(preview.previewQuestion),
            img: imageSrc,
            answers: answers.map((answer, index) => ({
                id: 'a' + (index + 1),
                text: answer.value,
                correct: answer.label === 'A',
            })),
        };
        try {
            const api = new callAPI();
            const response = await api.addQuestion(id_sub, newQuestion);
            console.log('Question added successfully:', response);
            const updatedMainExamsData = await api.fetchMainExams();
            setMainSubjects(updatedMainExamsData);
            setShowLoading(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };
    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (name === 'newTopic') {
            if (checked) {
                setShowCustomTopicInput(true);
                setSelectedTopics([...selectedTopics, name]);
            } else {
                setShowCustomTopicInput(false);
                setSelectedTopics(selectedTopics.filter(topic => topic !== name));
                setCustomTopicValue('');
            }
        } else {
            if (checked) {
                setSelectedTopics([...selectedTopics, name]);
            } else {
                setSelectedTopics(selectedTopics.filter(topic => topic !== name));
            }
        }
    };
    const handleCustomTopicInputChange = (event) => {
        setCustomTopicValue(event.target.value);
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                setImageSrc(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleAddAnswer = () => {
        const newLabel = String.fromCharCode(65 + answers.length);
        setAnswers(prevAnswers => [...prevAnswers, { label: newLabel, value: '' }]);
    };
    const handleRemoveAnswer = (index) => {
        const newAnswers = [...answers];
        newAnswers.splice(index, 1);
        setAnswers(newAnswers);
    };
    const handleAnswerChange = (index, value) => {
        setAnswers(prevAnswers => {
            if (index >= 0 && index < prevAnswers.length) {
                const updatedAnswers = [...prevAnswers];
                updatedAnswers[index].value = value;
                return updatedAnswers;
            } else {
                return prevAnswers;
            }
        });
    };
    const handleTextareaChange = (e) => {
        const value = e.target.value;
        setTextareaValue(value);
        const words = value.split(/\s+/).filter(word => word.trim() !== '');
        setWordPositions(words.reduce((acc, word, index) => {
            if (!acc[word]) {
                acc[word] = {};
            }
            acc[word][index] = true;
            return acc;
        }, {}));
        setSelectedWords({});
        setSelectedWordsObject({});
    };
    const handleWordClick = (index, word) => {
        setSelectedWords(prevSelectedWords => {
            const newSelectedWords = { ...prevSelectedWords };
            if (newSelectedWords[index] !== undefined) {
                delete newSelectedWords[index];
                setSelectedWordsObject(prevObject => {
                    const newSelectedWordsObject = { ...prevObject };
                    if (newSelectedWordsObject[word] && newSelectedWordsObject[word][index] !== undefined) {
                        delete newSelectedWordsObject[word][index];
                        if (Object.keys(newSelectedWordsObject[word]).length === 0) {
                            delete newSelectedWordsObject[word];
                        }
                    } else {
                        if (!newSelectedWordsObject[word]) {
                            newSelectedWordsObject[word] = {};
                        }
                        newSelectedWordsObject[word][index] = true;
                    }
                    return newSelectedWordsObject;
                });
            } else {
                newSelectedWords[index] = index;
                setSelectedWordsObject(prevObject => {
                    const newSelectedWordsObject = { ...prevObject };
                    if (!newSelectedWordsObject[word]) {
                        newSelectedWordsObject[word] = {};
                    }
                    newSelectedWordsObject[word][index] = true;
                    return newSelectedWordsObject;
                });
            }
            return newSelectedWords;
        });
    };

    const handlePreviewModalOpen = () => {
        setPreviewModalOpen(true);
    };

    const handlePreviewModalClose = () => {
        setPreviewModalOpen(false);
    };
    const getContentByIds = (ids) => {
        const contentById = {};
        categories.categories.forEach(category => {
            contentById[category.id] = category.content;
        });
        const contentArray = ids.map(id => contentById[id]);
        return contentArray;
    };
    const getPreviewQuestion = () => {
        const words = textareaValue.split(/\s+/).filter(word => word.trim() !== '');
        let previewWords = [];
        let answerList = [];
        for (let i = 0; i < words.length; i++) {
            if (selectedWordsObject[words[i]] && selectedWordsObject[words[i]][i]) {
                previewWords.push(`<strong>${words[i]}</strong>`);
                answerList.push({ word: words[i], index: i });
            } else {
                previewWords.push(words[i]);
            }
        }
        answerList.sort((a, b) => a.index - b.index);
        let previewQuestion = previewWords.join(' ');
        return { previewQuestion, answerList };
    };
    const preview = getPreviewQuestion();
    function convertStrongTagsToString(inputString) {
        const regex = /<strong>(.*?)<\/strong>/gi;
        const convertedString = inputString.replace(regex, "'$1'");
        return convertedString;
    }
    return (
        <div className={stylecss.form_type1}>
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12} sm={5} md={5}>
                    <div className={stylecss.form_container}>
                        <label className={stylecss.label_form}>Chủ đề:</label>
                        <ul style={styles.topicList}>
                            {categories && categories.length > 0 ? (
                                categories.map((category, index) => (
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
                                ))
                            ) : (
                                <p style={{ color: 'lightcoral' }}>Chưa có chủ đề, hãy thêm chủ đề trước!!!</p>
                            )}
                            {/* <li key="newTopic" style={styles.topicListItem}>
                                <input
                                    type="checkbox"
                                    id="newTopic"
                                    name="newTopic"
                                    checked={selectedTopics.includes('newTopic')}
                                    onChange={handleCheckboxChange}
                                    style={styles.checkbox}
                                />
                                <label htmlFor="newTopic" style={{ fontSize: '15px', color: 'blue' }}>
                                    Chủ đề khác...
                                </label>
                            </li>
                            {showCustomTopicInput && (
                                <li key="customTopicInput" style={styles.topicListItem}>
                                    <input
                                        type="text"
                                        id="customTopicInput"
                                        name="customTopicInput"
                                        value={customTopicValue}
                                        onChange={handleCustomTopicInputChange}
                                        className='input-add-cate'
                                        placeholder='Nhập tên chủ đề'
                                    />
                                </li>
                            )} */}
                        </ul>
                    </div>
                </Grid>
                <Grid item sm={5} md={5}>
                    <label className={stylecss.label_form}>Câu hỏi:</label>
                    <Tooltip title={<p className='title-tooltip'>Điền nội dung câu hỏi của bạn vào đây</p>}>
                        <IconButton style={{ marginLeft: '5px', marginTop: '-7px', cursor: 'default' }}>
                            <HelpOutline style={{ color: 'gray', fontSize: '20px' }} />
                        </IconButton>
                    </Tooltip>
                    <textarea
                        className={stylecss.textarea_type1}
                        rows={4}
                        value={textareaValue}
                        onChange={handleTextareaChange}
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" style={{ cursor: 'pointer', marginLeft: '10px' }}>
                            <img src="/img/addquestion/addimg.png" alt="Upload Icon" style={{ width: '50px', height: '50px' }} />
                        </label>
                        {imageSrc &&
                            <>
                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                                <IconButton onClick={() => setImageSrc(null)} style={{ position: 'absolute' }}>
                                    <Close style={{ color: 'gray', fontSize: '20px' }} />
                                </IconButton>
                            </>
                        }
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12} md={12}>
                                <label className={stylecss.label_form}>Mức độ: </label><br /><br />
                                <div className="radio-group">
                                    {radioOptions.map((option) => (
                                        <React.Fragment key={option.value}>
                                            <input
                                                type="radio"
                                                id={`radio${option.value}`}
                                                name="radios"
                                                value={option.value}
                                                checked={selectedValue === option.value}
                                                onChange={handleRadioChange}
                                            />
                                            <label htmlFor={`radio${option.value}`}>{option.label}</label>
                                        </React.Fragment>
                                    ))}
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ whiteSpace: 'nowrap' }} className={stylecss.label_form}>Từ khóa:</label>
                            <Tooltip title={<p className='title-tooltip'>Chọn các từ khóa cần thiết để làm nổi bật</p>}>
                                <IconButton style={{ marginLeft: '5px', marginTop: '-7px', cursor: 'default' }}>
                                    <HelpOutline style={{ color: 'gray', fontSize: '20px' }} />
                                </IconButton>
                            </Tooltip>
                            <div>
                                <span style={{ marginLeft: '10px' }}></span>
                                {textareaValue.split(/\s+/).filter(word => word.trim() !== '').map((word, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleWordClick(index, word)}
                                        style={{ marginRight: '5px', marginBottom: '5px', backgroundColor: selectedWords[index] !== undefined ? 'green' : 'lightgray', color: 'white', border: 'none', borderRadius: '5px', padding: '5px' }}
                                    >
                                        {word}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </Grid>
                <Snackbar
                    open={showErrorModal}
                    autoHideDuration={6000}
                    onClose={handleCloseErrorModal}
                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    style={{ position: 'absolute', top: `${topPosition}px`, left: '50%', transform: 'translateX(-50%)', zIndex: 9999 }}
                >
                    <Alert
                        style={{ alignItems: 'center' }}
                        severity="error"
                        action={
                            <IconButton size="large" aria-label="close" color="inherit" onClick={handleCloseErrorModal}>
                                <ErrorIcon fontSize="30px" />
                            </IconButton>
                        }
                        sx={{ width: '100%', fontSize: '20px', }}
                    >
                        {errorMessage}
                    </Alert>
                </Snackbar>

                {answers.map((answer, index) => (
                    <Grid item sm={5} md={5} key={index}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                {index === answers.length - 1 && (
                                    <Tooltip title={<p className='title-tooltip'>Xóa đáp án</p>}>
                                        <IconButton onClick={() => handleRemoveAnswer(index)} style={{ marginTop: '-5px' }}>
                                            <Delete style={{ color: 'red', fontSize: '20px' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                <label className={stylecss.label_form}>{`Đáp án ${answer.label}:`}</label>
                                {answer.label === 'A' && (
                                    <Tooltip title={<p className='title-tooltip'>Đáp án đúng</p>}>
                                        <IconButton style={{ marginLeft: '5px', marginTop: '-7px', cursor: 'default' }}>
                                            <ThumbUpAlt style={{ color: 'green', fontSize: '20px' }} />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </div>
                            <input
                                type="text"
                                value={answer.value}
                                onChange={e => handleAnswerChange(index, e.target.value)}
                                className={stylecss.input_type1}
                            />
                        </div>
                    </Grid>
                ))}
                <Grid item xs={12} sm={5} md={5} style={{ textAlign: 'center' }}>
                    <IconButton onClick={handleAddAnswer} aria-label="Thêm đáp án">
                        <AddCircleOutline style={{ fontSize: '20px', color: 'blue' }} />
                        <Typography style={{ fontSize: '13px', color: 'blue' }} variant="caption"> &nbsp;Thêm đáp án</Typography>
                    </IconButton>
                </Grid>
                <div className={stylecss.add_subject}>
                    <button style={{
                        float: 'right',
                        backgroundColor: !showLoading ? 'lightblue' : '',
                        color: !showLoading ? 'white' : '',
                    }} className={stylecss.btn_add} onClick={handleSaveQuestion} disabled={!showLoading}>
                        Lưu lại
                    </button>
                    <button className={`${stylecss.btn_add} ${stylecss.right}`} onClick={handlePreviewModalOpen} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#879999' }}>
                        <Visibility style={{ marginRight: '5px' }} />
                        Xem trước
                    </button>
                </div>
            </Grid>
            <Modal
                open={previewModalOpen}
                onClose={handlePreviewModalClose}
                aria-labelledby="preview-modal-title"
                aria-describedby="preview-modal-description"
            >
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '10px', maxWidth: '600px', margin: 'auto', marginTop: '120px', maxHeight: '75%', overflow: 'auto' }}>
                    <h2 id="preview-modal-title" className={stylecss.modalHeader_addquestion}>Xem trước</h2>
                    <div id="preview-modal-description">
                        <strong>Chủ đề:</strong>
                        <ul>
                            {getContentByIds(selectedTopics).map((topic, index) => (
                                <li style={{ marginLeft: '20px' }} key={index}>{topic}</li>
                            ))}
                            {showCustomTopicInput && (
                                <li style={{ marginLeft: '20px' }}>
                                    {customTopicValue.trim() ? customTopicValue : "Chủ đề khác..."}
                                </li>
                            )}
                        </ul>
                    </div>
                    <p>
                        <strong>Câu hỏi: </strong>
                        <span dangerouslySetInnerHTML={{ __html: preview.previewQuestion }} />
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imageSrc && (
                            <div>
                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                            </div>
                        )}
                    </div>
                    {answers.map((answer, index) => (
                        <p style={{ marginLeft: '20px' }} key={index}>
                            <strong>{answer.label}: </strong>
                            {answer.value}
                            {answer.label === 'A' && (
                                <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '5px' }}>(Đáp án đúng)</span>
                            )}
                        </p>
                    ))}
                    <button style={{ float: 'right', paddingLeft: '20px', paddingRight: '20px' }} className={stylecss.btn_add} onClick={handlePreviewModalClose}>Đóng</button>
                </div>
            </Modal>
            {showModal && (
                <Overlay className="modal" onClick={handleClickOutside}>
                    <SuccessContainer>
                        {showLoading ? (
                            <>
                                <Spinner />
                                <Text>Vui lòng chờ...</Text>
                            </>
                        ) : (
                            showLoading === false && (
                                <>
                                    <SuccessIcon>✓</SuccessIcon>
                                    <SuccessText>Thành công!</SuccessText>
                                </>
                            )
                        )}
                    </SuccessContainer>
                </Overlay>
            )}
        </div>
    );
};
const styles = {
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
}
export default Type4;
const Overlay = styled.div`
position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
`;

const LoadingContainer = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Spinner = styled.div`
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  animation: spin 2s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const Text = styled.p`
  margin-top: 1rem;
  font-size: 1.2rem;
  font-weight: bold;
`;

const SuccessModal = styled(Overlay)`
  background-color: rgba(0, 0, 0, 0.7);
`;

const SuccessContainer = styled(LoadingContainer)`
  background-color: white;
  padding: 3rem;
`;

const SuccessIcon = styled.div`
  font-size: 3rem;
  color: green;
  margin-bottom: 1rem;
`;

const SuccessText = styled.p`
  font-size: 1.5rem;
  font-weight: bold;
`;