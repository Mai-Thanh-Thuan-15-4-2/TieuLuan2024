import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import HeaderandSidebar from '../menu/headerandsidebar';
import { QuestionCard } from '../card/cardquestion';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import { Grid, Modal, Typography } from '@mui/material';
import ModalTopicManage from '../modal/modaltopicmanage';
import CloseIcon from '@mui/icons-material/Close';
import callAPI from '../../services/callAPI';
import LinearProgress from '@mui/material/LinearProgress';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import styled from 'styled-components';

const SubjectManagement = () => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    const [showLoading, setShowLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [mainSubjects, setMainSubjects] = useState([]);
    const { id, id_sub } = useParams();
    const [subject, setSubject] = useState({});
    const [filterValue, setFilterValue] = React.useState('');
    const [sortValue, setSortValue] = React.useState('');
    const [listQuestionsAcc, setListQuestionsAcc] = React.useState([]);
    const [listQuestionsDeleted, setListQuestionsDeleted] = useState(false);
    const [listDeleted, setListDeleted] = useState(false);
    const [searchValue, setSearchValue] = React.useState('');
    const [openModal, setOpenModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const handleClickOutside = async (event) => {
        try {
            const api = new callAPI();
            const accountData = await api.getAccountById(id);
            setAccount(accountData);
            if (accountData && accountData.listsub) {
                const questionIds = accountData.listsub
                    .map(sub => sub.listquestions)
                    .filter(list => list)
                    .flat();
                const updatedListQuestionsAcc = getQuestionsByIds(questionIds);
                setListQuestionsAcc(updatedListQuestionsAcc);
            }
            
            const mainExamsData = await api.fetchMainExams();
            setMainSubjects(mainExamsData);
            
            const selectedSubject = mainExamsData.find(exam => exam.id === id_sub) || {};
            setSubject(selectedSubject);
            
        } catch (error) {
            console.error('Error updating questions and main subjects:', error);
        }
        setListDeleted(false);
        setListQuestionsDeleted(false);
        setLoading(false);
        setShowModal(false);
    };
    const [filteredData, setFilteredData] = React.useState([]);
    const [categories, setCategories] = useState([]);
    useEffect(() => {
        let timeoutId;
        if (detailsOpened) {
            timeoutId = setTimeout(() => {
                setDetailsOpened(false);
            }, 5000);
        }
        return () => clearTimeout(timeoutId);
    }, [detailsOpened]);
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
        if (mainSubjects) {
            const selectedSubject = mainSubjects.find(exam => exam.id === id_sub) || [];
            setSubject(selectedSubject);
        }
    }, [mainSubjects]);
    useEffect(() => {
        if (subject && subject.listcategory) {
            const filteredCategories = subject.listcategory.filter(cat => !cat.author || cat.author === id);
            setCategories(filteredCategories);
        }
    }, [subject]);
    useEffect(() => {
        if (account && mainSubjects.length > 0) {
            const result = getQuestionsByIds(account.listsub.map(sub => sub.listquestions).filter(list => list).flat());
            setListQuestionsAcc(result);
        }
    }, [account, mainSubjects]);

    const handleChangelistDeleted = () => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        setListQuestionsAcc(getQuestionsWithStatusMinusOne());
    }
   
    const handleChangelistQuestion = () => {
        setListQuestionsDeleted(!listQuestionsDeleted);
        setListDeleted(!listDeleted);
        const result = getQuestionsByIds(account.listsub.map(sub => sub.listquestions).filter(list => list).flat());
        setListQuestionsAcc(result);
    }
    const getQuestionsByIds = (ids) => {
        let result = [];
        const subject = mainSubjects.find(exam => exam.id === id_sub);
        if (subject && subject.questions && subject.questions.length > 0) {
            subject.questions.forEach(question => {
                if (ids.includes(question.id) && question.status !== -1) {
                    result.push(question);
                }
            });
        }
        return result;
    };
    const getQuestionsWithStatusMinusOne = () => {
        let result = [];
        if (subject && subject.questions && subject.questions.length > 0) {
            result = subject.questions.filter(question => question.status === -1 && question.author === id);
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
        if (question.level === 5) {
            return question.answer;
        } else if (question.answers && question.answers.length > 0) {
            const correctAnswer = question.answers.find((answer) => answer.correct);
            return correctAnswer ? correctAnswer.text : '';
        } else {
            return '';
        }
    };
    const getCategoryContent = (categoryIds) => {
        const subjectInfo = getSubjectInfo(id_sub);
        if (subjectInfo && subjectInfo.listcategory) {
            const contents = categoryIds.map(categoryId => {
                const category = subjectInfo.listcategory.find(cat => cat.id === categoryId);
                return category ? category.content : '';
            });
            return contents.join(', ');
        }
        return '';
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
    useEffect(() => {
            let updatedFilteredData = listQuestionsAcc;
            if (searchValue) {
                updatedFilteredData = searchFunction(listQuestionsAcc, searchValue);
            } else {
                switch (filterValue) {
                    case '101':
                        updatedFilteredData = listQuestionsAcc.filter(item => item.author === id);
                        break;
                    case '102':
                        updatedFilteredData = listQuestionsAcc.filter(item => isNaN(item.status) && item.status === '0');
                        break;
                    case '103':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.status) && parseInt(item.status) === 1);
                        break;
                    case '104':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 1);
                        break;
                    case '110':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 2);
                        break;
                    case '111':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 3);
                        break;
                    case '112':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 4);
                        break;
                    case '113':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 5);
                        break;
                    case '114':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type !== 6);
                        break;
                    case '105':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.type) && item.type === 6);
                        break;
                    case '106':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 1);
                        break;
                    case '107':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 2);
                        break;
                    case '108':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 3);
                        break;
                    case '109':
                        updatedFilteredData = listQuestionsAcc.filter(item => !isNaN(item.level) && parseInt(item.level) === 4);
                        break;
                    default:
                        const categoryIndex = parseInt(filterValue) - 1;
                        if (categoryIndex >= 0 && categoryIndex < categories.length) {
                            const categoryId = categories[categoryIndex].id;
                            updatedFilteredData = listQuestionsAcc.filter(item => item.category === categoryId);
                        }
                        break;
                }
            }
            setFilteredData(updatedFilteredData);
    }, [listQuestionsAcc, searchValue, filterValue, categories]);
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
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    return (
        <>
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={1} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    {!showLoading ? (
                        getSubjectInfo(id_sub)?.name ? (
                            <h2>{getSubjectInfo(id_sub).name}</h2>
                        ) : (
                            <h2>Không có môn học</h2>
                        )
                    ) : (
                        <Box sx={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '60px'
                        }}>
                            <CircularProgress />
                        </Box>
                    )}
                </div>
                <div className={stylecss.add_subject2}>
                    <Link to={`/teacher/${id}/manage/${id_sub}/addquestion`}>
                        <button className={`${stylecss.btn_add} ${stylecss.left}`}>Thêm câu hỏi</button>
                    </Link>
                    <button onClick={() => setOpenModal(true)} className={stylecss.btn_add}>Quản lý chủ đề</button>
                    {!listQuestionsDeleted ? (
                        <button onClick={handleChangelistDeleted} className={stylecss.btn_add}>
                            Câu hỏi đã xóa({getQuestionsWithStatusMinusOne().length})
                        </button>
                    ) : (
                        <button onClick={handleChangelistQuestion} className={stylecss.btn_add}>
                            Danh sách câu hỏi
                        </button>
                    )}
                </div>
                <Modal
                    open={openModal}
                    onClose={handleCloseModal}
                    aria-labelledby="modal-title"
                    aria-describedby="modal-description"
                >
                    <>
                        <IconButton
                            className={stylecss.btnClose}
                            aria-label="close"
                            onClick={handleCloseModal}
                        >
                            <CloseIcon style={{ fontSize: '30px', color: 'red' }} />
                        </IconButton>
                        <div className={stylecss.modalContent_addquestion}>
                            <Typography
                                style={{
                                    marginTop: '40px',
                                    marginBottom: '20px',
                                    fontSize: '20px'
                                }}
                                className={stylecss.modalHeader_addquestion}
                                variant="h5"
                                id="modal-title"
                                gutterBottom
                            >
                                Quản lý chủ đề
                            </Typography>
                            <ModalTopicManage categories={categories} id={id}></ModalTopicManage>
                        </div>
                    </>
                </Modal>
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
                                            return "Trắc nghiệm 1 đáp án";
                                        case "110":
                                            return "Trắc nghiệm nhiều đáp án";
                                        case "111":
                                            return "Điền vào chỗ trống";
                                        case "112":
                                            return "Từ khóa nổi bật";
                                        case "113":
                                            return "Đoạn văn";
                                        case "114":
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
                                {categories && categories.map((category, index) => (
                                    <MenuItem key={category.id} value={index + 1}>Chủ đề {index + 1}: {category.content}</MenuItem>
                                ))}
                                <MenuItem value="101">Câu hỏi do bạn thêm</MenuItem>
                                <MenuItem value="102">Đã ẩn</MenuItem>
                                <MenuItem value="103">Không bị ẩn</MenuItem>
                                <MenuItem value="104">Trắc nghiệm 1 đáp án</MenuItem>
                                <MenuItem value="110">Trắc nghiệm nhiều đáp án</MenuItem>
                                <MenuItem value="111">Điền vào chỗ trống</MenuItem>
                                <MenuItem value="112">Từ khóa nổi bật</MenuItem>
                                <MenuItem value="113">Đoạn văn</MenuItem>
                                <MenuItem value="114">Trắc nghiệm</MenuItem>
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
                {!showLoading ? (
                    <>
                        {sortedData && sortedData.length > 0 ? (
                            sortedData.map(question => (
                                <QuestionCard
                                    id_acc={id}
                                    id_sub={id_sub}
                                    key={question.id}
                                    id={question.id}
                                    question={question.text}
                                    category={getCategoryContent(question.category)}
                                    correct_answer={getCorrectAnswer(question)}
                                    answers={question.answers}
                                    date={question.created_at}
                                    answer={question.answer}
                                    author={question.author}
                                    name={question.name}
                                    childquestions={question.child_questions}
                                    type={question.type}
                                    isdelete={listDeleted}
                                    openModal={() => setShowModal(true)}
                                    sucess={() => setLoading(false)} 
                                    status={question.status}
                                />
                            ))
                        ) : (
                            <p className={stylecss.list_empty}>Danh sách trống</p>
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
                )}
            </div>
        </div >
          {showModal && (
            <Overlay className="modal" onClick={handleClickOutside}>
                <SuccessContainer>
                    {loading ? (
                        <>
                            <Spinner />
                            <Text>Vui lòng chờ...</Text>
                        </>
                    ) : (
                        loading === false && (
                            <>
                                <SuccessIcon>✓</SuccessIcon>
                                <SuccessText>Thành công!</SuccessText>
                            </>
                        )
                    )}
                </SuccessContainer>
            </Overlay>
        )}
       </>
    );
};


export default SubjectManagement;
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
