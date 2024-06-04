import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import HeaderandSidebar from '../menu/headerandsidebar';
import CardAddQuestion from '../card/cardaddquestion';
import Grid from '@mui/material/Grid';
import callAPI from '../../services/callAPI';
import ModalAddQuestion from '../modal/modaladdquestion';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const AddQuestion = () => {
    const { id, id_sub } = useParams();
    const [account, setAccount] = useState(null);
    const [showLoading, setShowLoading] = useState(true);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [addQuestions, setAddQuestions] = useState([]);
    const exams = account ? account.listexams : [];
    const [modalOpen, setModalOpen] = useState(false);
    const [modalId, setModalId] = useState(null);

    useEffect(() => {
        async function fetchAccountAndMainSubjects() {
            try {
                const api = new callAPI();
                const accountData = await api.getAccountById(id);
                setAccount(accountData);
                const mainExamsData = await api.fetchMainExams();
                setMainSubjects(mainExamsData);
                const additionalQuestions = await api.fetchAdditionalQuestions();
                setAddQuestions(additionalQuestions)
                setShowLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setShowLoading(false);
            }
        };
        fetchAccountAndMainSubjects();
    }, []);
    const handleModalOpen = (id) => {
        setModalId(id);
        setModalOpen(true);
    };

    const handleModalClose = () => {
        setModalOpen(false);
        setModalId(null);
    };

    function getCategoryByIdSub() {
        let selectedCategory = [];
        const selectedMainSubject = mainSubjects.find(subject => subject.id === id_sub);
        if (selectedMainSubject && selectedMainSubject.listcategory) {
            selectedCategory = selectedMainSubject.listcategory.filter(category => {
                if (category.author) {
                    return category.author === id;
                }
                return true;
            });
        }
        return selectedCategory;
    }    
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
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
      
        return null;
      }
    const maxQuestionId = getMaxQuestionId(mainSubjects);
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}/manage/${id_sub}`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={1} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Thêm câu hỏi</h2>
                </div>
                <Grid container spacing={2}>
                    {!showLoading ? (
                        <>
                            {addQuestions.map((question, index) => (
                                <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
                                    <CardAddQuestion
                                        title={question.title}
                                        des={question.description}
                                        gifUrl={question.img}
                                        onClick={() => handleModalOpen(question.id)}
                                    />
                                </Grid>
                            ))}
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
                        </Box>)}
                </Grid>
                {modalOpen && modalId && (
                    <ModalAddQuestion
                        id={modalId}
                        title={addQuestions.find(question => question.id === modalId).title}
                        open={modalOpen}
                        categories={getCategoryByIdSub()}
                        onClose={handleModalClose}
                    />
                )}
            </div>
        </div>
    );
};

export default AddQuestion;
