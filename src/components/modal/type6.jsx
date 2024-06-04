import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography, Modal, Snackbar, Alert } from '@mui/material';
import { Visibility, HelpOutline, Description } from '@mui/icons-material';
import stylecss from '../../styles-page/exam.module.css';
import Close from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import callAPI from '../../services/callAPI';
import ErrorIcon from '@mui/icons-material/Error';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

const Type6 = (categories) => {
    const { id, id_sub } = useParams();
    const [textareaValues, setTextareaValues] = useState(['']);
    const [answerValues, setAnswerValues] = useState(['']);
    const [editorValues, setEditorValues] = useState(['']);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
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
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
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
    const handleClickOutside = (event) => {
        if (event.target.classList.contains('modal')) {
            setShowModal(false);
            setShowLoading(true);
            setTextareaValues(['']);
            setSelectedTopics([]);
            setImageSrc(null);
            setEditorValues(['']);
            setAnswerValues(['']);
        }
    };
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
        if (!textareaValues[0].trim()) {
            setErrorMessage('Hãy nhập nội dung câu hỏi');
            setShowErrorModal(true);
            return;
        }
        if (!answerValues[0].trim()) {
            setErrorMessage('Hãy nhập nội dung câu trả lời');
            setShowErrorModal(true);
            return;
        }
        const maxQuestionId = getMaxQuestionId(mainSubjects);
        const newQuestion = {
            id: maxQuestionId,
            level: 5,
            viewers: 0,
            author: id,
            created_at: new Date().toLocaleDateString(),
            type: 6,
            status: 0,
            category: selectedTopics,
            text: textareaValues[0],
            description: editorValues[0],
            img: imageSrc,
            answer: answerValues[0],
        };
        console.log('New question:', newQuestion);
        setShowModal(true);
        try {
            const api = new callAPI();
            await api.addQuestionAccount(id, maxQuestionId, id_sub);
            const response = await api.addQuestion(id_sub, newQuestion);
            console.log('Question added successfully:', response);
            const updatedMainExamsData = await api.fetchMainExams();
            setMainSubjects(updatedMainExamsData);
            setShowLoading(false);
        } catch (error) {
            console.error('Error adding question:', error);
        }
    }
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
    const handleTextareaChange = (index, value) => {
        setTextareaValues(prevValues => {
            const updatedValues = [...prevValues];
            updatedValues[index] = value;
            return updatedValues;
        });
    };
    const handleAnswerChange = (index, value) => {
        setAnswerValues(prevValues => {
            const updatedValues = [...prevValues];
            updatedValues[index] = value;
            return updatedValues;
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
    console.log(editorValues)
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
                    <Tooltip title={<p className='title-tooltip'>Nhập đầy đủ câu hỏi của bạn vào đây</p>}>
                        <IconButton style={{ marginLeft: '5px', marginTop: '-7px', cursor: 'default' }}>
                            <HelpOutline style={{ color: 'gray', fontSize: '20px' }} />
                        </IconButton>
                    </Tooltip>
                    <textarea
                        className={stylecss.textarea_type1}
                        rows={4}
                        value={textareaValues[0]}
                        onChange={e => handleTextareaChange(0, e.target.value)}
                    />
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: 'none' }}
                            id="fileInput"
                        />
                        <label htmlFor="fileInput" style={{ cursor: 'pointer' }}>
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
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <label style={{ marginTop: '6px' }} className={stylecss.label_form}>Mô tả: </label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={editorValues.hasOwnProperty(0) ? editorValues[0] : ''}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setEditorValues({ ...editorValues, 0: data });
                        }}
                        style={{ height: '200px' }}
                    />
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
                <Grid item xs={10}>
                    <label className={stylecss.label_form}>Đáp án:</label>
                    <textarea
                        className={stylecss.textarea_type1}
                        rows={4}
                        value={answerValues[0]}
                        onChange={e => handleAnswerChange(0, e.target.value)}
                    />
                </Grid>
                <div className={stylecss.add_subject}>
                    <button style={{
                        float: 'right',
                        backgroundColor: !showLoading ? 'lightblue' : '',
                        color: !showLoading ? 'white' : '',
                        marginTop: '10px',
                    }} className={stylecss.btn_add} onClick={handleSaveQuestion} disabled={!showLoading}>
                        Lưu lại
                    </button>
                    <button className={`${stylecss.btn_add} ${stylecss.right}`} onClick={handlePreviewModalOpen} style={{ display: 'flex', alignItems: 'center', backgroundColor: '#879999', marginTop: '10px' }}>
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
                        {textareaValues[0]}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imageSrc && (
                            <div>
                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                            </div>
                        )}
                    </div>
                    <div className='preview-exam'>
                        <strong>Đoạn văn: </strong><br />
                        <span style={{ display: 'inline-block', marginLeft: '20px' }} dangerouslySetInnerHTML={{ __html: editorValues[0] }} />
                    </div>
                    <div style={{ marginTop: '10px' }}>
                        <strong>Đáp án: </strong><br />
                        <span style={{ display: 'inline-block', marginLeft: '20px' }}>{answerValues[0]}</span>
                    </div>
                    <button style={{ float: 'right', paddingLeft: '20px', paddingRight: '20px', marginTop: '10px' }} className={stylecss.btn_add} onClick={handlePreviewModalClose}>Đóng</button>
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
export default Type6;
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