import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { CardItem } from '../card/card'
import stylecss from '../../styles-page/exam.module.css';
import Grid from '@mui/material/Grid';
import HeaderandSidebar from '../menu/headerandsidebar';
import ModalAddSubject from '../modal/modaladdsubject';
import callAPI from '../../services/callAPI';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Management = () => {
    const { id } = useParams();
    const [showLoading, setShowLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
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
        if (account) {
            setSubjects(account.listsub || []);
        }
    }, [account]);
    console.log(mainSubjects)
    const handleModalClose = () => {
        setModalOpen(false);
    };
    const handleModalOpen = () => {
        setModalOpen(true);
    };

    const getSubjectInfo = (subjectId) => {
        return mainSubjects.find(subject => subject.id === subjectId);
    };
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    const filterOutSubjects = (mainSubjects, subjects) => {
        const subjectIds = subjects.map(subject => subject.id);
        return mainSubjects.filter(mainSubject => !subjectIds.includes(mainSubject.id));
    };
    const filteredMainSubjects = filterOutSubjects(mainSubjects, subjects);
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={1} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Danh sách môn học của bạn</h2>
                </div>
                <div className={stylecss.add_subject}>
                    <button onClick={handleModalOpen} className={`${stylecss.btn_add}`} style={{ marginLeft: '20px' }}>Thêm môn học</button>
                </div>
                <Grid container spacing={2}>
                    {!showLoading ? (
                        <>
                            {subjects && subjects.length > 0 ? (
                                <>
                                    {subjects.map(subject => (
                                        <Grid item xs={12} sm={6} md={3} key={subject.id}>
                                            {getSubjectInfo(subject.id) ? (
                                                <CardItem
                                                    name={getSubjectInfo(subject.id).name}
                                                    id={subject.id}
                                                    year={getSubjectInfo(subject.id).year}
                                                    credits={getSubjectInfo(subject.id).credits}
                                                    link={`/teacher/${id}/manage/${subject.id}`}
                                                    isEdit={true}
                                                    isAdd={false}
                                                />
                                            ) : (
                                                <p></p>
                                            )}
                                        </Grid>
                                    ))}
                                </>
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
                        )}
                </Grid>
                {modalOpen && (
                    <ModalAddSubject
                        open={modalOpen}
                        listSubjects={filteredMainSubjects}
                        onClose={handleModalClose}
                        listallsub={mainSubjects}
                    />
                )}
            </div>
        </div>
    );
};


export default Management;
