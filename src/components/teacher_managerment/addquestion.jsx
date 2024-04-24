import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import JsonData from '../../data/data.json';
import HeaderandSidebar from '../menu/headerandsidebar';
import CardAddQuestion from '../card/cardaddquestion';
import Grid from '@mui/material/Grid';
import ModalAddQuestion from '../modal/modaladdquestion';

const AddQuestion = () => {
    const { id, id_sub } = useParams();
    const account = JsonData.Accounts.find(account => account.id === id);
    const exams = account ? account.listexams : [];
    const mainSubjects = JsonData.Exams.main;
    const [modalOpen, setModalOpen] = useState(false);
    const [modalId, setModalId] = useState(null);

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
        if (selectedMainSubject) {
            selectedCategory = selectedMainSubject.listcategory.filter(category => {
                if (category.author) {
                    return category.author === id;
                }
                return true;
            });
        }
        return selectedCategory;
    }
    
    
    console.log(getCategoryByIdSub())
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };

    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}/manage/${id_sub}`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={1} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Thêm câu hỏi</h2>
                </div>
                <Grid container spacing={2}>
                    {JsonData.Addquestion.map((question, index) => (
                        <Grid key={index} item xs={12} sm={6} md={6} lg={6}>
                            <CardAddQuestion
                                title={question.title}
                                des={question.description}
                                gifUrl={question.img}
                                onClick={() => handleModalOpen(question.id)}
                            />
                        </Grid>
                    ))}
                </Grid>
                {modalOpen && modalId && (
                    <ModalAddQuestion
                        id={modalId}
                        title={JsonData.Addquestion.find(question => question.id === modalId).title}
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
