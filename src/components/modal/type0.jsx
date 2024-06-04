import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import callAPI from '../../services/callAPI';
import styled from 'styled-components';
import EnhancedTable from '../table/EnhancedTable';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Type0 = () => {
    const { id, id_sub } = useParams();
    const [account, setAccount] = useState(null);
    const [showLoading, setShowLoading] = useState(true);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [listQuestions, setListQuestions] = useState([]);
    const [listQuestionsAcc, setListQuestionsAcc] = useState([]);
    const [selected, setSelected] = useState([]);
    const [rows, setRows] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAccountAndMainSubjects() {
            try {
                const api = new callAPI();
                const accountData = await api.getAccountById(id);
                setAccount(accountData);
                const mainExamsData = await api.fetchMainExams();
                setMainSubjects(mainExamsData);
                setLoading(false)
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false)
            }
        };
        fetchAccountAndMainSubjects();
    }, [id]);
    const getCategoriesByIds = (ids) => {
        const selectedCategories = [];
        ids.forEach(id => {
            const selectedMainSubject = mainSubjects.find(subject => subject.id === id_sub);
            if (selectedMainSubject) {
                const categories = selectedMainSubject.listcategory;
                const selectedCategory = categories.find(category => category.id === id);
                if (selectedCategory) {
                    selectedCategories.push(selectedCategory);
                }
            }
        });
        return selectedCategories;
    };

    const getQuestionsByIds = (ids) => {
        let result = [];
        const subject = mainSubjects.find(exam => exam.id === id_sub);
        if (subject && subject.questions && subject.questions.length > 0) {
            subject.questions.forEach(question => {
                if (ids.includes(question.id)) {
                    result.push(question)
                }
            });
        }
        return result;
    };

    useEffect(() => {
        if (account && account.listsub) {
            const questionIds = account.listsub
                .map(sub => sub.listquestions)
                .filter(list => list)
                .flat();
            const result = getQuestionsByIds(questionIds);
            setListQuestionsAcc(result);
        }
    }, [account, id_sub, mainSubjects]);

    useEffect(() => {
        const selectedSubject = mainSubjects.find(subject => subject.id === id_sub);

        if (selectedSubject) {
            const questionsOfSelectedSubject = selectedSubject.questions;
            setListQuestions(questionsOfSelectedSubject);
        } else {
            console.log('Không tìm thấy môn học có id =', id_sub);
        }
    }, [mainSubjects, id_sub]);

    useEffect(() => {
        const updatedRows = (listQuestions || [])
            .filter(question => {
                const isQuestionAcc = (listQuestionsAcc || []).some(accQuestion => accQuestion.id === question.id);
                const isAuthor = question.author === id;
                const statusCheck = (isAuthor && question.status !== -1) || (!isAuthor && question.status === 1);
                return !isQuestionAcc && statusCheck;
            })
            .map(question => {
                const categories = getCategoriesByIds(question.category) || [];
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
        setRows(updatedRows);
    }, [listQuestions, listQuestionsAcc]);    
    const handleAddQuestions = async () => {
        if (selected.length === 0) {
            console.log('No questions selected');
            return;
        }
        setShowModal(true);
        try {
            const api = new callAPI();
            await api.addQuestionsToAccount(id, selected, id_sub);
            console.log('Questions added successfully');
            setShowLoading(false)
            const updatedAccountData = await api.getAccountById(id);
            setAccount(updatedAccountData);
        } catch (error) {
            console.error('Error adding questions:', error);
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
    const handleClickOutside = (event) => {
        window.location.reload();
    };
    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = rows.map((n) => n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

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

    const mapLevelToDescription = (level) => {
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
    };
    const headCells = [
        { id: 'question', numeric: false, disablePadding: true, label: 'Câu hỏi' },
        { id: 'category', numeric: true, disablePadding: false, label: 'Chủ đề' },
        { id: 'type', numeric: true, disablePadding: false, label: 'Loại' },
        { id: 'createat', numeric: true, disablePadding: false, label: 'Ngày thêm' },
        { id: 'level', numeric: true, disablePadding: false, label: 'Mức độ' },
        { id: 'owner', numeric: true, disablePadding: false, label: 'Người tạo' },
    ];
    return (
        <div className={stylecss.form_type1}>
            {!loading ? (
                <EnhancedTable initialRows={rows} headCells={headCells} handleClick={handleClick} handleSelectAllClick={handleSelectAllClick} selected={selected} handleCreateExam={handleAddQuestions}></EnhancedTable>
            ) : (
            <Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40vh'
            }}>
                <CircularProgress />
            </Box>)}
            {showModal && (
        <Overlay className="modal" onClick={handleClickOutside}>
          <SuccessContainer style={{ width: '250px' }}>
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
                  <Link to={`/teacher/${id}/manage/${id_sub}`}>
                    <button className="see-now">Xem ngay</button>
                  </Link>
                </>
              )
            )}
          </SuccessContainer>
        </Overlay>
      )}
        </div>
    );
};
export default Type0;
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
