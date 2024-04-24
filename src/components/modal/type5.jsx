import React, { useState, useEffect } from 'react';
import { Grid, IconButton, Typography, Modal } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { Visibility, ThumbUpAlt } from '@mui/icons-material';
import stylecss from '../../styles-page/exam.module.css';
import Close from '@mui/icons-material/Close';
import Delete from '@mui/icons-material/Delete';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import Tooltip from '@mui/material/Tooltip';

const Type5 = (categories) => {
    const [textareaValues, setTextareaValues] = useState({});
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [questions, setQuestions] = useState([
        { label: 1, value: '', answers: [{ label: 'A', value: '' }, { label: 'B', value: '' }] }
    ]);
    const [showCustomTopicInput, setShowCustomTopicInput] = useState(false);
    const [customTopicValue, setCustomTopicValue] = useState('');

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
    useEffect(() => {
        const editor = document.querySelector('.ck-editor__editable');

        if (editor) {
            const resizeObserver = new ResizeObserver(() => {
                requestAnimationFrame(() => {
                });
            });

            resizeObserver.observe(editor);

            return () => {
                resizeObserver.unobserve(editor);
            };
        }
    }, []);
    const handleQuestionChange = (qIndex, value) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[qIndex].value = value;
            return updatedQuestions;
        });
    };

    const handleAddAnswer = (qIndex) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            const newLabel = String.fromCharCode(65 + updatedQuestions[qIndex].answers.length);
            updatedQuestions[qIndex].answers.push({ label: newLabel, value: '' });
            return updatedQuestions;
        });
    };

    const handleAnswerChange = (qIndex, aIndex, value) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[qIndex].answers[aIndex].value = value;
            return updatedQuestions;
        });
    };

    const handleAddQuestion = () => {
        const newQuestion = { label: questions.length + 1, value: '', answers: [{ label: 'A', value: '' }, { label: 'B', value: '' }] };
        setQuestions(prevQuestions => [...prevQuestions, newQuestion]);
    };
    const handleRemoveQuestion = (qIndex) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions.splice(qIndex, 1);
            return updatedQuestions;
        });
    };

    const handleRemoveAnswer = (qIndex, aIndex) => {
        setQuestions(prevQuestions => {
            const updatedQuestions = [...prevQuestions];
            updatedQuestions[qIndex].answers.splice(aIndex, 1);
            return updatedQuestions;
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
    return (
        <div className={stylecss.form_type1}>
            <Grid container spacing={2} justifyContent='center'>
                <Grid item xs={12} sm={5} md={5}>
                    <div className={stylecss.form_container}>
                        <label className={stylecss.label_form}>Chủ đề:</label>
                        <ul style={styles.topicList}>
                            {categories.categories && categories.categories.map((category, index) => (
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
                             <li key="newTopic" style={styles.topicListItem}>
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
                            )}
                        </ul>
                    </div>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <label style={{ marginTop: '6px' }} className={stylecss.label_form}>Đoạn văn: </label>
                    <CKEditor
                        editor={ClassicEditor}
                        data={textareaValues.hasOwnProperty(0) ? textareaValues[0] : ''}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setTextareaValues({ ...textareaValues, 0: data });
                        }}
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
                {questions.map((question, qIndex) => (
                    <Grid container spacing={2} key={qIndex} justifyContent='center'>
                        <Grid item xs={10}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                    {qIndex === questions.length - 1 && (
                                        <IconButton onClick={() => handleRemoveQuestion(qIndex)} style={{ marginTop: '-7px' }}>
                                            <Delete style={{ color: 'red', fontSize: '20px' }} />
                                        </IconButton>
                                    )}
                                    <label className={stylecss.label_form}>{`Câu hỏi ${question.label}:`}</label>
                                </div>
                                <input
                                    type="text"
                                    value={question.value}
                                    onChange={e => handleQuestionChange(qIndex, e.target.value)}
                                    className={stylecss.input_type1}
                                />
                            </div>
                            <Grid justifyContent='space-between' container item xs={12}>
                                {question.answers.map((answer, aIndex) => (
                                    <Grid style={{ marginTop: '5px' }} item sm={5} md={5} key={aIndex}>
                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                                {aIndex === question.answers.length - 1 && (
                                                    <IconButton onClick={() => handleRemoveAnswer(qIndex, aIndex)} style={{ marginTop: '-5px' }}>
                                                        <Delete style={{ color: 'red', fontSize: '20px' }} />
                                                    </IconButton>
                                                )}
                                                <label className={stylecss.label_form}>{`Đáp án ${answer.label}:`}</label>
                                                {answer.label === 'A' && (
                                                    <Tooltip title='Đáp án đúng'>
                                                        <IconButton style={{ marginLeft: '5px', marginTop: '-7px', cursor: 'default' }}>
                                                            <ThumbUpAlt style={{ color: 'green', fontSize: '20px' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </div>
                                            <input
                                                type="text"
                                                value={answer.value}
                                                onChange={e => handleAnswerChange(qIndex, aIndex, e.target.value)}
                                                className={stylecss.input_type1}
                                            />
                                        </div>
                                    </Grid>
                                ))}
                            </Grid>
                            <Grid item xs={12} sm={5} md={5} style={{ textAlign: 'center' }}>
                                <IconButton onClick={() => handleAddAnswer(qIndex)} aria-label="Thêm đáp án">
                                    <AddCircleOutline style={{ fontSize: '20px', color: 'blue' }} />
                                    <Typography style={{ fontSize: '13px', color: 'blue' }} variant="caption">  Thêm đáp án</Typography>
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Grid>
                ))}
                <Grid item xs={12} sm={5} md={5} style={{ textAlign: 'center' }}>
                    <IconButton onClick={handleAddQuestion} aria-label="Thêm câu hỏi">
                        <AddCircleOutline style={{ fontSize: '20px', color: 'green', fontWeight: 'bold' }} />
                        <Typography style={{ fontSize: '13px', color: 'green', fontWeight: 'bold' }} variant="caption">  Thêm câu hỏi</Typography>
                    </IconButton>
                </Grid>
                <div className={stylecss.add_subject}>
                    <button style={{ float: 'right' }} className={stylecss.btn_add}>Lưu lại</button>
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
                    <p id="preview-modal-description">
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
                    </p>
                    <div className='preview-exam'>
                        <strong>Đoạn văn: </strong>
                        <br/>
                        <span style={{ display: 'inline-block', marginLeft: '20px' }} dangerouslySetInnerHTML={{ __html: textareaValues[0] }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imageSrc && (
                            <div>
                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                            </div>
                        )}
                    </div>
                    {questions.map((question, qIndex) => (
                        <div key={qIndex}>
                            <p><strong>Câu hỏi {question.label}: </strong>{question.value}</p>
                            {question.answers.map((answer, aIndex) => (
                                <p style={{ marginLeft: '20px' }} key={aIndex}>
                                    <strong>{answer.label}: </strong>
                                    {answer.value}
                                    {answer.label === 'A' && (
                                        <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '5px' }}>(Đáp án đúng)</span>
                                    )}
                                </p>
                            ))}
                        </div>
                    ))}
                    <button style={{ float: 'right', paddingLeft: '20px', paddingRight: '20px' }} className={stylecss.btn_add} onClick={handlePreviewModalClose}>Đóng</button>
                </div>
            </Modal>
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
export default Type5;
