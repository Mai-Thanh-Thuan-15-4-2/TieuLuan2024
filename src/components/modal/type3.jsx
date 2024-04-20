import React, { useState } from 'react';
import { Grid, IconButton, Typography, Modal } from '@mui/material';
import { AddCircleOutline } from '@mui/icons-material';
import { Visibility, ThumbUpAlt, ThumbUpOffAlt } from '@mui/icons-material';
import stylecss from '../../styles-page/exam.module.css';
import Close from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

const Type3 = (categories) => {
    const [answers, setAnswers] = useState([
        { label: 'A', value: '', isCorrect: false },
        { label: 'B', value: '', isCorrect: false }
    ]);
    const [textareaValues, setTextareaValues] = useState(['']);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);

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
    const [correctAnswers, setCorrectAnswers] = useState([]);


    const handleToggleCorrectAnswer = (index) => {
        setAnswers((prevAnswers) => {
            const updatedAnswers = [...prevAnswers];
            updatedAnswers[index].isCorrect = !updatedAnswers[index].isCorrect;
            if (updatedAnswers[index].isCorrect) {
                setCorrectAnswers([...correctAnswers, index]);
            } else {
                setCorrectAnswers(correctAnswers.filter((idx) => idx !== index));
            }
            return updatedAnswers;
        });
    };
    const handleAddAnswer = () => {
        const newLabel = String.fromCharCode(65 + answers.length);
        setAnswers(prevAnswers => [...prevAnswers, { label: newLabel, value: '', isCorrect: false }]);
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
    const handleTextareaChange = (index, value) => {
        setTextareaValues(prevValues => {
            const updatedValues = [...prevValues];
            updatedValues[index] = value;
            return updatedValues;
        });
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        if (checked) {
            setSelectedTopics([...selectedTopics, name]);
        } else {
            setSelectedTopics(selectedTopics.filter(topic => topic !== name));
        }
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
                        </ul>
                    </div>
                </Grid>
                <Grid item sm={5} md={5}>
                    <label className={stylecss.label_form}>Câu hỏi trắc nghiệm:</label>
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
                {answers.map((answer, index) => (
                    <Grid item sm={5} md={5} key={index}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <label className={stylecss.label_form}>{`Đáp án ${answer.label}:`}</label>
                                <Tooltip title='Đáp án đúng'>
                                    <IconButton
                                        style={{ marginLeft: '5px', marginTop: '-7px' }}
                                        onClick={() => handleToggleCorrectAnswer(index)}
                                    >
                                        {answer.isCorrect ? (
                                            <ThumbUpAlt style={{ color: 'green', fontSize: '20px' }} />
                                        ) : (
                                            <ThumbUpOffAlt style={{ fontSize: '20px' }} />
                                        )}
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <input
                                type="text"
                                value={answer.value}
                                onChange={(e) => handleAnswerChange(index, e.target.value)}
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
                        </ul>
                    </p>
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
                    {answers.map((answer, index) => (
                        <p style={{ marginLeft: '20px' }} key={index}>
                            <strong>{answer.label}: </strong>
                            {answer.value}
                            {answer.isCorrect && (
                                <span style={{ color: 'green', fontWeight: 'bold', marginLeft: '5px' }}>(Đáp án đúng)</span>
                            )}
                        </p>
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
export default Type3;
