import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../styles-page/exam.module.css';
import JsonData from '../data/data.json';
import HeaderandSidebar from './headerandsidebar';
import { QuestionCard } from './cardquestion';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';

const SubjectManagement = () => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    useEffect(() => {
        let timeoutId;
        if (detailsOpened) {
            timeoutId = setTimeout(() => {
                setDetailsOpened(false);
            }, 5000);
        }
        return () => clearTimeout(timeoutId);
    }, [detailsOpened]);
    const { id, id_sub } = useParams();
    const account = JsonData.Accounts.find(account => account.id === id);
    const mainSubjects = JsonData.Exams.main;
    const subject = mainSubjects.find(exam => exam.id === id_sub) || [];
    const categories = subject.listcategory;
    const [filterValue, setFilterValue] = React.useState('');
    const [sortValue, setSortValue] = React.useState('');
    const [listQuestionsAcc, setListQuestionsAcc] = React.useState('');
    const [listQuestionsDeleted, setListQuestionsDeleted] = useState(false);
    const [listDeleted, setListDeleted] = useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    let [filteredData, setFilteredData] = React.useState([]);
    useEffect(() => {
        const result = getQuestionsByIds(account.listsub.map(sub => sub.listquestions).filter(list => list).flat());
        setListQuestionsAcc(result);
    }, []);
    const handleChangelistDeleted =() => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        setListQuestionsAcc(getQuestionsWithStatusMinusOne());
    }
    const handleChangelistQuestion =() => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        const result = getQuestionsByIds(account.listsub.map(sub => sub.listquestions).filter(list => list).flat());
        setListQuestionsAcc(result);
    }
    const getQuestionsByIds = (ids) => {
        let result = [];
        if (mainSubjects && mainSubjects.length > 0) {
            mainSubjects.forEach(subject => {
                if (subject.questions && subject.questions.length > 0) {
                    subject.questions.forEach(question => {
                        if (ids.includes(question.id) && question.status !== -1) {
                            result.push(question);
                        }
                    });
                }
            });
        }
        return result;
    };    
    const getQuestionsWithStatusMinusOne = () => {
        let result = [];
        if (mainSubjects && mainSubjects.length > 0) {
            mainSubjects.forEach(subject => {
                if (subject.questions && subject.questions.length > 0) {
                    subject.questions.forEach(question => {
                        if (question.status === -1 && question.author === id) {
                            result.push(question);
                        }
                    });
                }
            });
        }
        return result;
    };
    
    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };

    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const getCorrectAnswer = (question) => {
        const correctAnswer = question.answers.find((answer) => answer.correct);
        return correctAnswer ? correctAnswer.text : '';
    };
    const getCategoryContent = (categoryId) => {
        const category = getSubjectInfo(id_sub).listcategory.find((cat) => cat.id === categoryId);
        return category ? category.content : '';
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
        setSearchValue('');
    };

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
    };

    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setSearchValue(searchValue);
        const searchData = searchFunction(listQuestionsAcc, searchValue);
        setFilterValue(0);
        setFilteredData(searchData);
    };

    // Hàm tìm kiếm chung
    const searchFunction = (data, searchValue) => {
        return data.filter(item => {
            // Tìm kiếm dựa trên ID và text
            return (
                item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                item.text.toLowerCase().includes(searchValue.toLowerCase())
            );
        });
    };

    // Lọc dữ liệu
    filteredData = searchValue ? searchFunction(listQuestionsAcc, searchValue) : listQuestionsAcc;
    switch (filterValue) {
        case '101':
            filteredData = listQuestionsAcc.filter(item => item.author === id);
            break;
        case '102':
            filteredData = listQuestionsAcc.filter(item => isNaN(item.status) && item.status === '0');
            break;
        case '103':
            filteredData = listQuestionsAcc.filter(item => !isNaN(item.status) && parseInt(item.status) === 1);
            break;
        case '104':
            filteredData = listQuestionsAcc.filter(item => isNaN(item.type) && item.type === '1');
            break;
        case '105':
            filteredData = listQuestionsAcc.filter(item => isNaN(item.type) && item.type === '2');
            break;
        case '106':
            filteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 1);
            break;
        case '107':
            filteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 2);
            break;
        case '108':
            filteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 3);
            break;
        case '109':
            filteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 4);
            break;
        default:
            const categoryIndex = parseInt(filterValue) - 1;
            if (categoryIndex >= 0 && categoryIndex < categories.length) {
                const categoryId = categories[categoryIndex].id;
                filteredData = listQuestionsAcc.filter(item => item.category === categoryId);
            }
            break;
    }
    function parseDate(dateString) {
        if (!dateString || typeof dateString !== 'string') {
            return null;
        }

        const parts = dateString.split('/');
        if (parts.length !== 3) {
            return null;
        }

        const day = parseInt(parts[0]);
        const month = parseInt(parts[1]);
        const year = parseInt(parts[2]);

        if (isNaN(day) || isNaN(month) || isNaN(year)) {
            return null;
        }

        return new Date(year, month - 1, day);
    }

    // Sắp xếp dữ liệu
    let sortedData = filteredData;
    switch (sortValue) {
        case '1':
            sortedData = filteredData.sort((a, b) => a.level - b.level);
            break;
        case '2':
            sortedData = filteredData.sort((a, b) => b.level - a.level);
            break;
        case '3':
            sortedData = filteredData.sort((a, b) => {
                const dateA = parseDate(a.create_at);
                const dateB = parseDate(b.create_at);
                return dateA - dateB;
            });
            break;
        case '4':
            sortedData = filteredData.sort((a, b) => {
                const dateA = parseDate(a.create_at);
                const dateB = parseDate(b.create_at);
                return dateB - dateA;
            });
            break;
        case '5':
            sortedData = filteredData.sort((a, b) => b.viewers - a.viewers);
            break;
        default:
            sortedData = filteredData;
    }
    return (
        <div id="subjects" className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}`} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>{getSubjectInfo(id_sub).name}</h2>
                </div>
                <div className={stylecss.add_subject}>
                    <button className={`${stylecss.btn_add} ${stylecss.left}`}>Thêm câu hỏi</button>
                    {!listQuestionsDeleted ? (
                    <button onClick={handleChangelistDeleted}  className={`${stylecss.btn_add} ${stylecss.right}`}>Câu hỏi đã xóa({getQuestionsWithStatusMinusOne().length})</button>
                    ) : (
                    <button onClick={handleChangelistQuestion}  className={`${stylecss.btn_add} ${stylecss.right}`}>Danh sách câu hỏi</button>
                    )}
                </div>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <Select
                                id="filter"
                                value={filterValue}
                                onChange={handleFilterChange}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Lọc câu hỏi</em>;
                                    }
                                    switch (selected) {
                                        case "0":
                                            return "Tất cả";
                                        case "101":
                                            return "Câu hỏi do bạn thêm";
                                        case "102":
                                            return "Đã ẩn";
                                        case "103":
                                            return "Không bị ẩn";
                                        case "104":
                                            return "Trắc nghiệm";
                                        case "105":
                                            return "Tự luận";
                                        case "106":
                                            return "Mức độ: Biết";
                                        case "107":
                                            return "Mức độ: Hiểu";
                                        case "108":
                                            return "Mức độ: Vận dụng";
                                        case "109":
                                            return "Mức độ: Vận dụng cao";
                                        default:
                                            const index = parseInt(selected) - 1;
                                            if (index >= 0 && index < categories.length) {
                                                return categories[index].content;
                                            } else {
                                                return "";
                                            }
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Chọn một mục</em>
                                </MenuItem>
                                <MenuItem value="0">Tất cả</MenuItem>
                                {categories.map((category, index) => (
                                    <MenuItem key={category.id} value={index + 1}>Chủ đề {index + 1}: {category.content}</MenuItem>
                                ))}
                                <MenuItem value="101">Câu hỏi do bạn thêm</MenuItem>
                                <MenuItem value="102">Đã ẩn</MenuItem>
                                <MenuItem value="103">Không bị ẩn</MenuItem>
                                <MenuItem value="104">Trắc nghiệm</MenuItem>
                                <MenuItem value="105">Tự luận</MenuItem>
                                <MenuItem value="106">Mức độ: Biết</MenuItem>
                                <MenuItem value="107">Mức độ: Hiểu</MenuItem>
                                <MenuItem value="108">Mức độ: Vận dụng</MenuItem>
                                <MenuItem value="109">Mức độ: Vận dụng cao</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <FormControl fullWidth>
                            <Select
                                id="sort"
                                value={sortValue}
                                onChange={handleSortChange}
                                displayEmpty
                                renderValue={(selected) => {
                                    if (!selected) {
                                        return <em>Sắp xếp câu hỏi</em>;
                                    }
                                    switch (selected) {
                                        case "0":
                                            return "Mặc định";
                                        case "1":
                                            return "Dễ đến khó";
                                        case "2":
                                            return "Khó đến dễ";
                                        case "3":
                                            return "Mới nhất";
                                        case "4":
                                            return "Cũ nhất";
                                        case "5":
                                            return "Số lượt tiếp cận";
                                        default:
                                            return "";
                                    }
                                }}
                            >
                                <MenuItem value="" disabled>
                                    <em>Chọn một mục</em>
                                </MenuItem>
                                <MenuItem value="0">Mặc định</MenuItem>
                                <MenuItem value="1">Dễ đến khó</MenuItem>
                                <MenuItem value="2">Khó đến dễ</MenuItem>
                                <MenuItem value="3">Mới nhất</MenuItem>
                                <MenuItem value="4">Cũ nhất</MenuItem>
                                <MenuItem value="5">Số lượt tiếp cận</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <TextField
                            fullWidth
                            id="search"
                            placeholder='Tìm kiếm'
                            value={searchValue}
                            onChange={handleSearchChange}
                            InputProps={{
                                endAdornment: (
                                    <IconButton>
                                        <SearchIcon />
                                    </IconButton>
                                ),
                            }}
                        />
                    </Grid>
                </Grid>
                {sortedData && sortedData.length > 0 ? (
                    sortedData.map(question => (
                        <QuestionCard
                            id_acc={id}
                            key={question.id}
                            id={question.id}
                            question={question.text}
                            answers={question.answers}
                            category={getCategoryContent(question.category)}
                            correct_answer={getCorrectAnswer(question)}
                            author={question.author}
                            isdelete={listDeleted}
                        />
                    ))
                ) : (
                    <p className={stylecss.list_empty}>Danh sách trống</p>
                )}
            </div>
        </div>
    );
};


export default SubjectManagement;
