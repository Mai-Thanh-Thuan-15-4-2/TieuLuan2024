import React, { useState } from 'react';
import { Grid, IconButton, Modal } from '@mui/material';
import { Visibility, HelpOutline } from '@mui/icons-material';
import stylecss from '../../styles-page/exam.module.css';
import Close from '@mui/icons-material/Close';
import Tooltip from '@mui/material/Tooltip';

const Type3 = (categories) => {
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [imageSrc, setImageSrc] = useState(null);
    const [previewModalOpen, setPreviewModalOpen] = useState(false);
    const [textareaValue, setTextareaValue] = useState('');
    const [selectedWords, setSelectedWords] = useState({});
    const [wordPositions, setWordPositions] = useState({});
    const [selectedWordsObject, setSelectedWordsObject] = useState({});
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
        let previewWords = [...words];
        let answerList = [];
        for (let i = 0; i < words.length; i++) {
            if (selectedWordsObject[words[i]] && selectedWordsObject[words[i]][i]) {
                previewWords[i] = '.....'.repeat(words[i].length);
                answerList.push({ word: words[i], index: i });
            }
        }
        answerList.sort((a, b) => a.index - b.index);
        let previewQuestion = previewWords.join(' ');
        previewQuestion = previewQuestion.replace(/(\.\.\.\.\s)+/g, '....');
        return { previewQuestion, answerList };
    };
    const preview = getPreviewQuestion();
    console.log(preview.answerList);
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
                    </div>
                </Grid>
                <Grid item xs={10}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <label style={{ whiteSpace: 'nowrap' }} className={stylecss.label_form}>Đáp án:</label>
                            <Tooltip title={<p className='title-tooltip'>Chọn 1 hoặc nhiều từ để làm đáp án</p>}>
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
                        {preview.previewQuestion}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        {imageSrc && (
                            <div>
                                <img src={imageSrc} alt="Preview" style={{ maxWidth: '200px', maxHeight: '200px', marginTop: '10px' }} />
                            </div>
                        )}
                    </div>
                    <>
                        <strong>Đáp án:</strong>
                        <ul>
                            {preview.answerList.map((entry, index) => (
                                <li style={{ marginLeft: '20px' }} key={index}>{index + 1}: {entry.word}</li>
                            ))}
                        </ul>
                    </>
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
