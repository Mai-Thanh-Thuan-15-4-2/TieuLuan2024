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
import styled from 'styled-components';

const Management = () => {
    const { id } = useParams();
    const [showLoading, setShowLoading] = useState(true);
    const [account, setAccount] = useState(null);
    const [mainSubjects, setMainSubjects] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [subjects, setSubjects] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const handleClickOutside = async (event) => {
        try {
            const api = new callAPI();
            const accountData = await api.getAccountById(id);
            setAccount(accountData);
            const mainExamsData = await api.fetchMainExams();
            setMainSubjects(mainExamsData);
        } catch (error) {
            console.error('Error updating questions and main subjects:', error);
        }
        setShowModal(false);
    };
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
          const filteredSubjects = account.listsub.filter(subject => subject.status !== 0);
          setSubjects(filteredSubjects);
        }
      }, [account]);
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
    const [listSubjectsDeleted, setListSubjectsDeleted] = useState(false);
    const [listDeleted, setListDeleted] = useState(false);
    const getListSubjectsDeleted = () => {
        let result = [];
        if (account && account.listsub) {
            account.listsub.forEach(sub => {
                if (sub.status === 0) {
                    result.push(sub);
                }
            });
        }
        return result;
    };
    const getListSubjects = () => {
        let result = [];
        if (account && account.listsub) {
            account.listsub.forEach(sub => {
                if (sub.status !== 0) {
                    result.push(sub);
                }
            });
        }
        return result;
    };
    const handleChangelistDeleted = () => {
        setListSubjectsDeleted(!listSubjectsDeleted);
        setListDeleted(!listDeleted);
        setSubjects(getListSubjectsDeleted());
    }
    const handleChangelistSubject = () => {
        setListSubjectsDeleted(!listSubjectsDeleted);
        setListDeleted(!listDeleted);
        const result = getListSubjects().filter(list => list).flat();
        setSubjects(result);
    }
    return (
        <>
            <div className={stylecss.container_manage}>
                <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={1} />
                <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                    <div className={stylecss.title_wrapper}>
                        <h2>Danh sách môn học của bạn</h2>
                    </div>
                    <div className={stylecss.add_subject}>
                        <button onClick={handleModalOpen} className={`${stylecss.btn_add}`} style={{ marginLeft: '20px' }}>Thêm môn học</button>
                        {!listSubjectsDeleted ? (
                            <button onClick={handleChangelistDeleted} className={`${stylecss.btn_add} ${stylecss.right}`}>Môn học đã xóa({getListSubjectsDeleted().length})</button>
                        ) : (
                            <button onClick={handleChangelistSubject} className={`${stylecss.btn_add} ${stylecss.right}`}>Danh sách môn học</button>
                        )}
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
                                                        id_acc={id}
                                                        showModal={showModal}
                                                        openModal={() => setShowModal(true)}
                                                        sucess={() => setLoading(false)}
                                                        status={subject.status}
                                                        changeList={() => setListSubjectsDeleted(false)}
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
                            showLoading={showLoading}
                            showModal={showModal}
                            openModal={() => setShowModal(true)}
                            sucess={() => setLoading(false)}
                        />
                    )}
                </div>
            </div>
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


export default Management;
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
