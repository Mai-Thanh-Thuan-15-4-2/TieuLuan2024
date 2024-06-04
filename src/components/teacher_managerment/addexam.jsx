import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import HeaderandSidebar from '../menu/headerandsidebar';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { Typography, TextField, FormControlLabel, Checkbox } from '@mui/material';
import Select from 'react-select';
import { Snackbar, IconButton, Alert } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import Button from '@mui/material/Button';
import Modal from '@mui/material/Modal';
import DraftEditor from '../DraftEditor/DraftEditor';
import EnhancedTable from '../table/EnhancedTable';
import callAPI from '../../services/callAPI';
import CircularProgress from '@mui/material/CircularProgress';


const AddExam = () => {
    const { id } = useParams();
    const [value, setValue] = useState(0);
    const [account, setAccount] = useState(null);
    const [showLoading, setShowLoading] = useState(true);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [selected, setSelected] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState("");
    const [useSelectCount, setUseSelectCount] = useState(false);
    const [listQuestionsAcc, setListQuestionsAcc] = React.useState([]);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [open, setOpen] = React.useState(false);
    const handleClose = () => setOpen(false);
    const [showEditExam, setShowEditExam] = useState(false);
    const [listQuestionsExam, setListQuestionsExam] = useState([]);
    const [createDate, setCreateDate] = useState(new Date());
    const [difficultyCounts, setDifficultyCounts] = useState({
        easy: 0,
        medium: 0,
        hard: 0,
        advanced: 0,
        essay: 0
    });
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [essayValue, setEssayValue] = useState(0);
    const [waiting, setWaiting] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
          setWaiting(false);
        }, 2000);
        return () => clearTimeout(timer);
      }, []);
    useEffect(() => {
        async function fetchAccountAndMainSubjects() {
            try {
                const api = new callAPI();
                const accountData = await api.getAccountById(id);
                setAccount(accountData);
                const mainExamsData = await api.fetchMainExams();
                setMainSubjects(mainExamsData);
                setShowLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowLoading(false);
            }
        };
        fetchAccountAndMainSubjects();
    }, []);
    const refreshData = async () => {
        try {
            const api = new callAPI();
            const accountData = await api.getAccountById(id);
            setAccount(accountData);
            const mainExamsData = await api.fetchMainExams();
            setMainSubjects(mainExamsData);
            setShowLoading(false);
        } catch (error) {
            console.error('Error fetching data:', error);
            setShowLoading(false);
        }
    };

    useEffect(() => {
        refreshData();
    }, []);
    const [subjects, setSubjects] = useState([]);
    useEffect(() => {
        if (account) {
            setSubjects(account.listsub || []);
        }
    }, [account]);
    useEffect(() => {
        if (account && account.listsub) {
            const questionIds = account.listsub
                .map(sub => sub.listquestions)
                .filter(list => list)
                .flat();
            const result = getQuestionsByIds(questionIds);
            setListQuestionsAcc(result);
        }
    }, [account, selectedSubject]);
    useEffect(() => {
        setEssayValue(difficultyCounts.essay);
    }, [difficultyCounts.essay]);
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };
    const getMaxExamId = () => {
        let maxId = 0;
        if (account && account.listexams) {
            account.listexams.forEach(exam => {
                if (exam.contentState) {
                    if (exam.contentState.info) {
                        const examId = parseInt(exam.contentState.info.id.replace('EXAM_' + id + '_', ''));
                        if (!isNaN(examId) && examId > maxId) {
                            maxId = examId;
                        }
                    }
                }
            });
        }
        return maxId + 1;
    };
    
    const nextExamId = 'EXAM_' + id + '_' + getMaxExamId();

    const uniqueTypes = [...new Set(listQuestionsAcc.map(question => question.type))];
    const [selectedTypes, setSelectedTypes] = useState([1, 2, 3, 4, 5, 6]);
    const handleCheckboxTypeChange = (type) => {
        if (selectedTypes.includes(type)) {
            setSelectedTypes(selectedTypes.filter(t => t !== type));
        } else {
            setSelectedTypes([...selectedTypes, type]);
        }
    };
    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, id);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }
        setSelected(newSelected);
    };
    function getCategoriesByIds(ids) {
        const selectedCategories = [];
        ids.forEach(id => {
            const selectedMainSubject = mainSubjects.find(subject => subject.id === selectedSubject);
            if (selectedMainSubject) {
                const categories = selectedMainSubject.listcategory;
                const selectedCategory = categories.find(category => category.id === id);
                if (selectedCategory) {
                    selectedCategories.push(selectedCategory);
                }
            }
        });
        return selectedCategories;
    }
    const handleDropDownChange = (selectedItems) => {
        if (selectedItems.length > totalQuestionsEssay) {
            selectedItems = selectedItems.slice(0, totalQuestionsEssay);
        }
        setSelectedOptions(selectedItems);
        if (useSelectCount) {
            setDifficultyCounts(prevCounts => ({
                ...prevCounts,
                essay: selectedItems.length
            }));
        }
    };
    const sumTotalQuestionsSelected = (subjectIds) => {
        const selectedQuestions = listQuestionsAcc.filter((question) =>
            question.category.some(category => subjectIds.includes(category))
        );
        return selectedQuestions.length;
    };
    function mapLevelToDescription(level) {
        switch (level) {
            case 1:
                return 'Hiểu';
            case 2:
                return 'Biết';
            case 3:
                return 'Vận dụng';
            case 4:
                return 'Vận dụng cao';
            case 5:
                return 'Vận dụng cao';
            default:
                return '';
        }
    }
    const mapTypeToDescription = (type) => {
        switch (type) {
            case 1:
                return 'Chọn 1';
            case 2:
                return 'Chọn nhiều';
            case 3:
                return 'Ô trống';
            case 4:
                return 'Từ khóa';
            case 5:
                return 'Đoạn văn';
            case 6:
                return 'Tự luận';
            default:
                return '';
        }
    };
    const rows = listQuestionsAcc.map(question => {
        const categories = getCategoriesByIds(question.category);
        const categoryContent = categories.map(category => category.content).join(', ');
        return {
            id: question.id,
            question: question.text,
            category: categoryContent || "Unknown",
            type: mapTypeToDescription(question.type),
            createat: question.created_at,
            level: mapLevelToDescription(question.level),
            owner: 'User' + question.author,
            name: question.name
        };
    });
    const headCells = [
        { id: 'question', numeric: false, disablePadding: true, label: 'Câu hỏi' },
        { id: 'category', numeric: true, disablePadding: false, label: 'Chủ đề' },
        { id: 'type', numeric: true, disablePadding: false, label: 'Loại' },
        { id: 'createat', numeric: true, disablePadding: false, label: 'Ngày thêm' },
        { id: 'level', numeric: true, disablePadding: false, label: 'Mức độ' },
        { id: 'owner', numeric: true, disablePadding: false, label: 'Người tạo' },
    ];

    const handleUseChange = (event) => {
        setUseSelectCount(event.target.checked);
        setSelectedOptions([]);
        if (!event.target.checked) {
            let selectedEssayValue = 0;
            selectedOptions.forEach(option => {
                if (option.value === 'essay') {
                    selectedEssayValue = option.value;
                }
            });
            setEssayValue(selectedEssayValue);
        } else {
            setEssayValue(0);
        }
    };
    const calculateTotal = () => {
        let total = 0;
        Object.keys(difficultyCounts).forEach(difficulty => {
            total += difficultyCounts[difficulty];
        });
        return total;
    };
    useEffect(() => {
        setDifficultyCounts(prevCounts => ({
            ...prevCounts,
            essay: useSelectCount ? selectedOptions.length : 0
        }));
    }, [selectedOptions, useSelectCount]);
    const handleInputChange = (event, difficulty) => {
        const { value } = event.target;
        const inputValue = parseInt(value);

        if (difficulty === 'easy' && inputValue > totalQuestionsQuizzLv1) {
            return;
        }
        if (difficulty === 'medium' && inputValue > totalQuestionsQuizzLv2) {
            return;
        }
        if (difficulty === 'hard' && inputValue > totalQuestionsQuizzLv3) {
            return;
        }
        if (difficulty === 'advanced' && inputValue > totalQuestionsQuizzLv4) {
            return;
        }
        if (difficulty === 'essay' && inputValue > totalQuestionsEssay) {
            return;
        }

        setDifficultyCounts(prevCounts => ({
            ...prevCounts,
            [difficulty]: inputValue
        }));
    };

    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };
    const getQuestionsByIds = (ids) => {
        let result = [];
        const subject = mainSubjects.find(exam => exam.id === selectedSubject);
        if (subject && subject.questions && subject.questions.length > 0) {
            subject.questions.forEach(question => {
                if (ids.includes(question.id) && question.status === 1) {
                    result.push(question);
                }
            });
        }
        return result;
    };
    const getListEssay = () => {
        if (!Array.isArray(listQuestionsAcc)) {
            return [];
        }

        const essayQuestions = listQuestionsAcc.filter(question => question.type === 6);
        return essayQuestions;
    }
    const listEssay = getListEssay();
    const options = listEssay.map((question, index) => ({
        value: question.id,
        label: `Câu ${index + 1}: ${question.text}`
    }));
    const sumTotalQuestionsEssay = (category, selectedTypes) => {
        const filteredQuestions = listQuestionsAcc.filter(question =>
            question.category.some(cat => category.includes(cat)) && selectedTypes.includes(question.type)
        );

        const selectedQuestions = filteredQuestions.filter(question =>
            question.type === 6
        );

        return selectedQuestions.length;
    };

    const sumTotalQuestionsQuizzLevel1 = (category, selectedTypes) => {
        const filteredQuestions = listQuestionsAcc.filter(question =>
            question.category.some(cat => category.includes(cat)) && selectedTypes.includes(question.type)
        );

        const selectedQuestions = filteredQuestions.filter(question =>
            question.level === 1
        );

        return selectedQuestions.length;
    };

    const sumTotalQuestionsQuizzLevel2 = (category, selectedTypes) => {
        const filteredQuestions = listQuestionsAcc.filter(question =>
            question.category.some(cat => category.includes(cat)) && selectedTypes.includes(question.type)
        );

        const selectedQuestions = filteredQuestions.filter(question =>
            question.level === 2
        );

        return selectedQuestions.length;
    };
    const sumTotalQuestionsQuizzLevel3 = (category, selectedTypes) => {
        const filteredQuestions = listQuestionsAcc.filter(question =>
            question.category.some(cat => category.includes(cat)) && selectedTypes.includes(question.type)
        );

        const selectedQuestions = filteredQuestions.filter(question =>
            question.level === 3
        );

        return selectedQuestions.length;
    };
    const sumTotalQuestionsQuizzLevel4 = (category, selectedTypes) => {
        const filteredQuestions = listQuestionsAcc.filter(question =>
            question.category.some(cat => category.includes(cat)) && selectedTypes.includes(question.type)
        );

        const selectedQuestions = filteredQuestions.filter(question =>
            question.level === 4
        );

        return selectedQuestions.length;
    };
    const totalQuestionsSelected = sumTotalQuestionsSelected(selectedTopics, selectedTypes);
    const totalQuestionsQuizzLv1 = sumTotalQuestionsQuizzLevel1(selectedTopics, selectedTypes);
    const totalQuestionsQuizzLv2 = sumTotalQuestionsQuizzLevel2(selectedTopics, selectedTypes);
    const totalQuestionsQuizzLv3 = sumTotalQuestionsQuizzLevel3(selectedTopics, selectedTypes);
    const totalQuestionsQuizzLv4 = sumTotalQuestionsQuizzLevel4(selectedTopics, selectedTypes);
    const totalQuestionsEssay = sumTotalQuestionsEssay(selectedTopics, selectedTypes);
    const handleSubjectChange = (event) => {
        setSelectedSubject(event.target.value);
    };
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const categories = getSubjectInfo(selectedSubject)?.listcategory || [];
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
    const [textFieldDisabled, setTextFieldDisabled] = useState(false);
    useEffect(() => {
        const disableTextFields = totalQuestionsSelected === 0;
        setTextFieldDisabled(disableTextFields);
    }, [totalQuestionsSelected]);
    const random = (arr, n) => {
        const shuffled = arr.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, n);
    };

    const handleCreateExam = () => {
        const examNameInput = document.querySelector('input[type="text"].' + stylecss.inputField);
        const examName = examNameInput.value.trim();
        if (selectedSubject === '') {
            setShowErrorModal(true);
            setErrorMessage('Vui lòng chọn chủ đề và chọn số câu hỏi.');
            return;
        }
        if (examName === '') {
            setShowErrorModal(true);
            setErrorMessage('Vui lòng đặt tên cho đề thi.');
            return;
        }
        if (calculateTotal() === 0) {
            setShowErrorModal(true);
            setErrorMessage('Chọn ít nhất 1 câu hỏi cho đề thi.');
            return;
        }
        if (difficultyCounts.easy > totalQuestionsQuizzLv1) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi mức độ biết không đủ để tạo đề thi.');
            return;
        }
        if (difficultyCounts.medium > totalQuestionsQuizzLv2) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi mức độ hiểu không đủ để tạo đề thi.');
            return;
        }
        if (difficultyCounts.hard > totalQuestionsQuizzLv3) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi mức độ vận dụng không đủ để tạo đề thi.');
            return;
        }
        if (difficultyCounts.advanced > totalQuestionsQuizzLv4) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi mức độ vận dụng cao không đủ để tạo đề thi.');
            return;
        }
        if (difficultyCounts.essay > totalQuestionsEssay) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi tự luận không đủ để tạo đề thi.');
            return;
        }
        const selectedQuestions = [];
        if (selectedQuestions.length > totalQuestionsEssay) {
            setShowErrorModal(true);
            setErrorMessage('Số câu hỏi tự luận không đủ để tạo đề thi.');
            return;
        }
        const { easy, medium, hard, advanced, essay } = difficultyCounts;
        const filteredQuestions = listQuestionsAcc.filter(question =>
            selectedTypes.includes(question.type)
        );
        const randomEasyQuestions = random(filteredQuestions.filter(question => question.level === 1), easy);
        const randomMediumQuestions = random(filteredQuestions.filter(question => question.level === 2), medium);
        const randomHardQuestions = random(filteredQuestions.filter(question => question.level === 3), hard);
        const randomAdvancedQuestions = random(filteredQuestions.filter(question => question.level === 4), advanced);

        selectedQuestions.push(...randomEasyQuestions, ...randomMediumQuestions, ...randomHardQuestions, ...randomAdvancedQuestions);
        if (essay > 0) {
            if (useSelectCount) {
                selectedQuestions.push(...selectedOptions.map(option => listQuestionsAcc.find(question => question.id === option.value)));
            } else {
                const essayQuestions = listQuestionsAcc.filter(question => question.type === 6);
                const selectedEssayQuestions = random(essayQuestions, essay);
                selectedQuestions.push(...selectedEssayQuestions);
            }
        }
        setOpen(true);
        setCreateDate(new Date());
        setListQuestionsExam(selectedQuestions);
    };
    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };
    const handleEditExam = () => {
        setOpen(false);
        setShowEditExam(true);
    };
    const [examName, setExamName] = useState('');
    const handleExamNameChange = (event) => {
        setExamName(event.target.value);
    };
    const maxEssayValue = parseInt(totalQuestionsEssay);
    const handleCreateExamHandicraft = () => {
        if (examName === '') {
            setShowErrorModal(true);
            setErrorMessage('Vui lòng đặt tên cho đề thi.');
            return;
        }
        setListQuestionsExam(getQuestionsByIds(selected));
        setOpen(true);
        setCreateDate(new Date());
    };
    const handleStartButtonClick = () => {
        handleCreateExamHandicraft();
    };
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}/examlist`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={3} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                {!showEditExam ? (
                    <Box sx={{ width: '100%', marginTop: '-10px' }}>
                        <Tabs value={value} onChange={handleChange} centered>
                            <Tab style={{ fontSize: '20px', textTransform: 'none' }} label="Tạo tự động" />
                            <Tab style={{ fontSize: '20px', textTransform: 'none' }} label="Tạo thủ công" />
                        </Tabs>
                        {value === 0 && (
                            <Box sx={{ p: 2 }}>
                                <Grid container spacing={2} alignItems="center">
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={12} marginTop='20px'>
                                            <Grid container spacing={2} alignItems='center'>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <div className={stylecss.form_container}>
                                                        <label className={stylecss.label_form}>Tên bài kiểm tra:</label>
                                                        <input type="text" className={stylecss.inputField} placeholder='Vd: Đề thi 1' required value={examName} onChange={handleExamNameChange} />
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <div className={stylecss.form_container}>
                                                        <label className={stylecss.label_form}>Chọn môn học:</label>
                                                        <select className={stylecss.dropdownSub} value={selectedSubject} onChange={handleSubjectChange}>
                                                            <option value="" disabled>--Chọn môn học--</option>
                                                            {showLoading && <option value="" disabled>Đang tải...</option>}
                                                            {subjects.map(subject => {
                                                                const subjectInfo = getSubjectInfo(subject?.id);
                                                                return (
                                                                    subjectInfo && (
                                                                        <option key={subjectInfo.id} value={subjectInfo.id}>
                                                                            {subjectInfo.name}
                                                                        </option>
                                                                    )
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                            <Grid container spacing={2}>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <div className={stylecss.form_container}>
                                                        <label className={stylecss.label_form}>Chủ đề:</label>
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
                                                        {categories && categories.length > 0 ? (
                                                            <p style={{ color: 'blue' }}>Tổng số câu hỏi ở chủ đề đã chọn: <span style={{ color: 'green', fontWeight: '500' }}>{totalQuestionsSelected}</span></p>
                                                        ) : null}
                                                    </div>
                                                    <div className={stylecss.form_container}>
                                                        <label className={stylecss.label_form}>Loại câu hỏi:</label>
                                                        <Grid container spacing={3}>
                                                            {uniqueTypes.map(type => (
                                                                <Grid item xs={12} sm={6} md={6} key={type}>
                                                                    <li style={styles.topicListItem}>
                                                                        <input
                                                                            type="checkbox"
                                                                            id={`checkbox${type}`}
                                                                            style={styles.checkbox}
                                                                            checked={selectedTypes.includes(type)}
                                                                            onChange={() => handleCheckboxTypeChange(type)}
                                                                        />
                                                                        <label htmlFor={`checkbox${type}`} style={{ fontSize: '15px', color: 'green' }}>
                                                                            {mapTypeToDescription(type)}
                                                                        </label>
                                                                    </li>
                                                                </Grid>
                                                            ))}
                                                            {!uniqueTypes || uniqueTypes.length === 0 ? (
                                                                <li style={styles.topicListItem}>
                                                                    <span style={{ marginTop: '30px', fontSize: '15px', marginLeft: '70px' }}>
                                                                        Không có loại câu hỏi
                                                                    </span>
                                                                </li>
                                                            ) : null}
                                                        </Grid>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={12} sm={6} md={6}>
                                                    <div>
                                                        <label className={stylecss.label_form} style={{ marginLeft: '30px', marginTop: '10px' }}>Chọn số câu:</label>
                                                    </div>
                                                    <div>
                                                        <div style={{ marginTop: '40px', marginLeft: '50px' }}>
                                                            <Typography variant="h5" style={{ color: 'blue' }}>Trắc nghiệm: <span style={{ textTransform: 'lowercase', color: 'gray' }}> số câu hỏi ở từng mức độ</span> (<span style={{ color: "green", fontWeight: 'bold' }}>{totalQuestionsQuizzLv1} </span>, <span style={{ color: "green", fontWeight: 'bold' }}>{totalQuestionsQuizzLv2}</span>, <span style={{ color: "green", fontWeight: 'bold' }}>{totalQuestionsQuizzLv3}</span>, <span style={{ color: "green", fontWeight: 'bold' }}>{totalQuestionsQuizzLv4}</span>)</Typography>
                                                            <TextField
                                                                inputProps={{ min: "0", max: totalQuestionsQuizzLv1 }}
                                                                type="number"
                                                                label={<Typography variant="subtitle1" style={{ fontSize: '15px' }}>Biết</Typography>}
                                                                value={difficultyCounts.easy}
                                                                onChange={(e) => handleInputChange(e, 'easy')}
                                                                style={{ marginLeft: '10px', width: '45%', marginTop: '10px' }}
                                                                disabled={textFieldDisabled}
                                                            />

                                                            <TextField
                                                                inputProps={{ min: "0", max: totalQuestionsQuizzLv2 }}
                                                                type="number"
                                                                label={<Typography variant="subtitle1" style={{ fontSize: '15px' }}>Hiểu</Typography>}
                                                                value={difficultyCounts.medium}
                                                                onChange={(e) => handleInputChange(e, 'medium')}
                                                                style={{ marginLeft: '10px', width: '45%', marginTop: '10px' }}
                                                                disabled={textFieldDisabled}
                                                            />

                                                            <TextField
                                                                inputProps={{ min: "0", max: totalQuestionsQuizzLv3 }}
                                                                type="number"
                                                                label={<Typography variant="subtitle1" style={{ fontSize: '15px' }}>Vận dụng</Typography>}
                                                                value={difficultyCounts.hard}
                                                                onChange={(e) => handleInputChange(e, 'hard')}
                                                                style={{ marginLeft: '10px', width: '45%', marginTop: '10px' }}
                                                                disabled={textFieldDisabled}
                                                            />

                                                            <TextField
                                                                inputProps={{ min: "0", max: totalQuestionsQuizzLv4 }}
                                                                type="number"
                                                                label={<Typography variant="subtitle1" style={{ fontSize: '15px' }}>Vận dụng cao</Typography>}
                                                                value={difficultyCounts.advanced}
                                                                onChange={(e) => handleInputChange(e, 'advanced')}
                                                                style={{ marginLeft: '10px', width: '45%', marginTop: '10px' }}
                                                                disabled={textFieldDisabled}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{ marginTop: '20px', marginLeft: '50px' }}>
                                                        <Typography variant="h5" style={{ color: 'blue' }}>Tự luận: <span style={{ color: "green", fontWeight: 'bold' }}>{totalQuestionsEssay}</span></Typography>
                                                        <Typography variant="h6" style={{ marginBottom: '10px', marginTop: '10px', marginLeft: '10px' }}>Ngẫu nhiên: </Typography>
                                                        <TextField
                                                            inputProps={{ min: "0", max: maxEssayValue }}
                                                            type="number"
                                                            label={<Typography variant="subtitle1" style={{ fontSize: '15px' }}>Tự luận</Typography>}
                                                            value={essayValue}
                                                            onChange={(e) => handleInputChange(e, 'essay')}
                                                            style={{ marginLeft: '10px', width: '45%', marginTop: '10px' }}
                                                            disabled={useSelectCount || textFieldDisabled}
                                                        />
                                                        <Typography variant="h6" style={{ marginBottom: '10px', marginTop: '10px', marginLeft: '10px' }}>Chọn câu hỏi từ danh sách: </Typography>
                                                        <Select
                                                            className={stylecss.custom_select}
                                                            isMulti
                                                            options={options}
                                                            value={selectedOptions}
                                                            onChange={handleDropDownChange}
                                                            placeholder="Chọn câu hỏi..."
                                                            isDisabled={!useSelectCount}
                                                            max={totalQuestionsEssay}
                                                        />
                                                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                            <div style={{ margin: '10px' }}>
                                                                <FormControlLabel
                                                                    style={{ fontSize: '15px' }}
                                                                    control={<Checkbox checked={useSelectCount} onChange={handleUseChange} />}
                                                                    label="Sử dụng số lượng câu hỏi từ danh sách"
                                                                    disabled={totalQuestionsSelected === 0}
                                                                />
                                                            </div>
                                                            <div>
                                                                <Typography variant="h6" style={{ margin: '10px' }}>Tổng số câu hỏi: <span style={{ color: "blue", fontWeight: 'bold' }}>{calculateTotal()}</span></Typography>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </Grid>
                                                <Snackbar
                                                    open={showErrorModal}
                                                    autoHideDuration={6000}
                                                    onClose={handleCloseErrorModal}
                                                    anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                                    style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
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
                                                <Modal
                                                    open={open}
                                                    onClose={handleClose}
                                                    aria-labelledby="modal-modal-title"
                                                    aria-describedby="modal-modal-description"
                                                >
                                                    <Box sx={style}>
                                                        <Typography className={stylecss.headerModal} style={{ fontSize: '20px', fontWeight: 'bold' }} id="modal-modal-title" variant="h6" component="h2">
                                                            Tạo câu hỏi thành công
                                                        </Typography>
                                                        <Typography className={stylecss.modalContent} id="modal-modal-description" sx={{ mt: 2 }} style={{ fontSize: '15px' }}>Nhấn ok để xem hoặc chỉnh sửa đề thi của bạn</Typography>
                                                        <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                            <Button onClick={handleClose} color="secondary" variant="contained" style={{ marginRight: '30px', backgroundColor: 'gray', fontSize: '13px' }}>
                                                                Quay lại
                                                            </Button>
                                                            <Button color="primary" onClick={handleEditExam} variant="contained" style={{ fontSize: '13px' }}>
                                                                OK
                                                            </Button>
                                                        </Box>
                                                    </Box>
                                                </Modal>
                                                <div style={{ width: '110%' }}>
                                                    <button className={stylecss.startButton} style={{ float: 'right' }} onClick={handleCreateExam}>Bắt đầu tạo</button>
                                                </div>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                        )}
                        {value === 1 && (
                            <Grid container spacing={2} alignItems='center'>
                                <Grid item xs={12} marginTop='20px'>
                                    <Grid container spacing={2} alignItems='center'>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <div className={stylecss.form_container}>
                                                <label className={stylecss.label_form}>Tên bài kiểm tra:</label>
                                                <input type="text" className={stylecss.inputField} placeholder='Vd: Đề thi 1' required value={examName} onChange={handleExamNameChange} />
                                            </div>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={6}>
                                            <div className={stylecss.form_container}>
                                                <label className={stylecss.label_form}>Chọn môn học:</label>
                                                <select className={stylecss.dropdownSub} value={selectedSubject} onChange={handleSubjectChange}>
                                                    <option value="" disabled>--Chọn môn học--</option>
                                                    {subjects.map(subject => (
                                                        <option key={getSubjectInfo(subject.id).id} value={getSubjectInfo(subject.id).id}>{getSubjectInfo(subject.id).name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </Grid>
                                    </Grid>
                                    <div style={{ marginTop: '20px' }}></div>
                                    <EnhancedTable initialRows={rows} headCells={headCells} handleClick={handleClick} handleSelectAllClick={handleSelectAllClick} selected={selected} handleCreateExam={handleStartButtonClick}></EnhancedTable>
                                    <Snackbar
                                        open={showErrorModal}
                                        autoHideDuration={6000}
                                        onClose={handleCloseErrorModal}
                                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                                        style={{ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
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
                                    <Modal
                                        open={open}
                                        onClose={handleClose}
                                        aria-labelledby="modal-modal-title"
                                        aria-describedby="modal-modal-description"
                                    >
                                        <Box sx={style}>
                                            <Typography className={stylecss.headerModal} style={{ fontSize: '20px', fontWeight: 'bold' }} id="modal-modal-title" variant="h6" component="h2">
                                                Tạo đề thi thành công
                                            </Typography>
                                            <Typography className={stylecss.modalContent} id="modal-modal-description" sx={{ mt: 2 }} style={{ fontSize: '15px' }}>Nhấn ok để xem hoặc chỉnh sửa đề thi của bạn</Typography>
                                            <Box style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
                                                <Button onClick={handleClose} color="secondary" variant="contained" style={{ marginRight: '30px', backgroundColor: 'gray', fontSize: '13px' }}>
                                                    Quay lại
                                                </Button>
                                                <Button color="primary" onClick={handleEditExam} variant="contained" style={{ fontSize: '13px' }}>
                                                    OK
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Modal>
                                </Grid>
                            </Grid>
                        )}
                    </Box>
                ) : (
                    <>
                        <div className={stylecss.title_wrapper}>
                            <h2>Chỉnh sửa đề thi</h2>
                        </div>
                        {waiting ? (
                            <Box sx={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                height: '40vh'
                            }}>
                                <CircularProgress />
                            </Box>
                        ) : (
                            <DraftEditor nextExamId={nextExamId} title={examName} questions={listQuestionsExam} create={createDate} subject={selectedSubject} closeEditExam={refreshData}></DraftEditor>
                        )}
                    </>
                )
                }
            </div>
        </div >
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
const style = {
    position: 'absolute',
    top: '50%',
    padding: 0,
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: '10px',
    p: 4,
};
export default AddExam;

