import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import HeaderandSidebar from '../menu/headerandsidebar';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import CardExam from '../card/cardexam';
import callAPI from '../../services/callAPI';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ExamManagement = () => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    useEffect(() => {
        let timeoutId;
        if (detailsOpened) {
            timeoutId = setTimeout(() => {
                setDetailsOpened(false);
            }, 5000);
        }
        return () => clearTimeout(timeoutId);
    }, [detailsOpened]);
    const { id } = useParams();
    const [account, setAccount] = useState(null);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [filterValue, setFilterValue] = React.useState('');
    const [sortValue, setSortValue] = React.useState('');
    const [listData, setListData] = React.useState('');
    const [listQuestionsDeleted, setListQuestionsDeleted] = useState(false);
    const [listDeleted, setListDeleted] = useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    let [filteredData, setFilteredData] = React.useState([]);
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
    useEffect(() => {
        const result = getListExams().filter(list => list).flat();
        setListData(result);
    }, [mainSubjects]);
    const handleChangelistDeleted = () => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        setListData(getListExamDeleted());
    }
    const handleChangelistQuestion = () => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        const result = getListExams().filter(list => list).flat();
        setListData(result);
    }
    const getListExamDeleted = () => {
        let result = [];
        if (account && account.listexams) {
            account.listexams.forEach(exam => {
                if (exam.contentState.info && exam.contentState.info.status === 0) {
                    result.push(exam);
                }
            });
        }
        return result;
    };
    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };
    const getListExams = () => {
        let result = [];
        if (account && account.listexams) {
            account.listexams.forEach(exam => {
                if (exam.contentState.info && exam.contentState.info.status !== 0) {
                    result.push(exam);
                }
            });
        }
        return result;
    };
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    const handleFilterChange = (event) => {
        setFilterValue(event.target.value);
        setSearchValue('');
    };

    const handleSortChange = (event) => {
        setSortValue(event.target.value);
    };

    const handleSearchChange = (event) => {
        setSearchValue(event.target.value); 
        // if (searchValue !== undefined) {
        //     setSearchValue(searchValue);
        //     const searchData = searchFunction(listData, searchValue);
        //     setFilterValue(0);
        //     setFilteredData(searchData);
        // }
    };
    // Hàm tìm kiếm chung
    const searchFunction = (data, searchValue) => {
        return data.filter(item => {
            // Kiểm tra xem item có tồn tại và không phải là undefined
            if (item && item.id && item.text) {
                // Tìm kiếm dựa trên ID và text
                return (
                    item.id.toLowerCase().includes(searchValue.toLowerCase()) ||
                    item.text.toLowerCase().includes(searchValue.toLowerCase())
                );
            }
            return false;
        });
    };
    

    // Lọc dữ liệu
    filteredData = searchValue ? searchFunction(listData, searchValue) : listData;
    switch (filterValue) {
        case '101':
            filteredData = listData.filter(item => item.author === id);
            break;
        case '102':
            filteredData = listData.filter(item => isNaN(item.status) && item.status === '0');
            break;
        case '103':
            filteredData = listData.filter(item => !isNaN(item.status) && parseInt(item.status) === 1);
            break;
        case '104':
            filteredData = listData.filter(item => isNaN(item.type) && item.type === '1');
            break;
        case '105':
            filteredData = listData.filter(item => isNaN(item.type) && item.type === '2');
            break;
        case '106':
            filteredData = listData.filter(item => !isNaN(item.level) && parseInt(item.level) === 1);
            break;
        case '107':
            filteredData = listData.filter(item => !isNaN(item.level) && parseInt(item.level) === 2);
            break;
        case '108':
            filteredData = listData.filter(item => !isNaN(item.level) && parseInt(item.level) === 3);
            break;
        case '109':
            filteredData = listData.filter(item => !isNaN(item.level) && parseInt(item.level) === 4);
            break;
        default:
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
            break;
    }
    const countQuestionBlocks = (exam) => {
        if (exam && exam.contentState && exam.contentState.blocks) {
            return exam.contentState.blocks.filter(block => block.key.startsWith("question")).length;
        } else {
            return 0;
        }
    };
    function formatDate(isoDate) {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
    return (
        <div id="subjects" className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={3} />
                <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                    <div className={stylecss.title_wrapper}>
                        <h2>Quản lý đề thi</h2>
                    </div>
                    <div className={stylecss.add_subject}>
                        <Link to={`/teacher/${id}/addexam`}>
                            <button className={`${stylecss.btn_add} ${stylecss.left}`}>Tạo đề thi</button>
                        </Link>
                        {!listQuestionsDeleted ? (
                            <button onClick={handleChangelistDeleted} className={`${stylecss.btn_add} ${stylecss.right}`}>Đề thi đã xóa({getListExamDeleted().length})</button>
                        ) : (
                            <button onClick={handleChangelistQuestion} className={`${stylecss.btn_add} ${stylecss.right}`}>Danh sách đề thi</button>
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
                                            return <em>Lọc đề thi</em>;
                                        }
                                        switch (selected) {
                                            case "0":
                                                return "Tất cả";
                                            default:
                                                return "";
                                        }
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Chọn một mục</em>
                                    </MenuItem>
                                    <MenuItem value="0">Tất cả</MenuItem>
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
                                            return <em>Sắp xếp đề thi</em>;
                                        }
                                        switch (selected) {
                                            case "0":
                                                return "Mặc định";
                                            case "1":
                                                return "Mới nhất";
                                            case "2":
                                                return "Cũ nhất";
                                            case "3":
                                                return "Nhiều câu nhất";
                                            case "4":
                                                return "Ít câu nhất";
                                            default:
                                                return "";
                                        }
                                    }}
                                >
                                    <MenuItem value="" disabled>
                                        <em>Chọn một mục</em>
                                    </MenuItem>
                                    <MenuItem value="0">Mặc định</MenuItem>
                                    <MenuItem value="1">Mới nhất</MenuItem>
                                    <MenuItem value="2">Cũ nhất</MenuItem>
                                    <MenuItem value="3">Nhiều câu nhất</MenuItem>
                                    <MenuItem value="4">Ít câu nhất</MenuItem>
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
                    <Grid container spacing={2}>
                    {!showLoading ? (
                        <>
                        {sortedData && sortedData.length > 0 ? (
                            sortedData.map(exam => (
                                <Grid item xs={12} sm={8} md={4} key={exam.contentState.info.id}>
                                    <CardExam
                                        id={exam.contentState.info.id}
                                        key={exam.contentState.info.id}
                                        name={exam.contentState.blocks[0].text}
                                        subject={getSubjectInfo(exam.contentState.info.subject).name}
                                        totalquestion={countQuestionBlocks(exam)}
                                        createdate={formatDate(exam.contentState.info.create_date)}
                                        editdate={formatDate(exam.contentState.info.edit_date)}
                                        link={`/teacher/${id}/examdetail/${exam.contentState.info.id}`}
                                        isDelete={true}
                                    />
                                </Grid>
                            ))
                        ) : (
                            <Grid item xs={12} sm={12} md={12} key="list_empty">
                                <p className={stylecss.list_empty}>Danh sách trống</p>
                            </Grid>
                        )}
                        </>
                    ) : (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '40vh'
                        }}>
                            <CircularProgress />
                        </Box>
                    )
                    }
                    </Grid>
                </div>
        </div>
    );
};


export default ExamManagement;