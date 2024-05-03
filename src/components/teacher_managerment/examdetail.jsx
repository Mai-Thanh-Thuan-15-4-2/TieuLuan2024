import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import stylecss from '../../styles-page/exam.module.css';
import HeaderandSidebar from '../menu/headerandsidebar';
import DraftEditor from '../DraftEditor/DraftEditExam';
import callAPI from '../../services/callAPI';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const ExamDetail = () => {
    const { id, id_exam } = useParams();
    const [account, setAccount] = useState(null);
    const [exams, setExams] = useState([]);
    const [contentStates, setContentStates] = useState([]);
    const [sidebarVisible, setSidebarVisible] = useState(true);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const fetchAccount = async () => {
            try {
                const api = new callAPI();
                const accountData = await api.getAccountById(id);
                setAccount(accountData);
                setShowLoading(false);
            } catch (error) {
                console.error('Error fetching account:', error);
                setShowLoading(false);
            }
        };

        fetchAccount();
    }, [id]);

    useEffect(() => {
        if (account && account.listexams) {
            const filteredExams = account.listexams.filter(exam => exam.contentState.info.id === id_exam);
            setExams(filteredExams);
        }
    }, [account, id_exam]);

    useEffect(() => {
        if (exams.length > 0) {
            const contentStates = exams.map(exam => exam.contentState);
            setContentStates(contentStates);
        }
    }, [exams]);

    const toggleSidebar = () => {
        setSidebarVisible(!sidebarVisible);
    };
    return (
        <div className={stylecss.container_manage}>
            <HeaderandSidebar visible={sidebarVisible} toggle={() => toggleSidebar()} link={`/teacher/${id}/examlist`} link1={`/teacher/${id}`} link3={`/teacher/${id}/examlist`} active={3} />
            <div className={`${sidebarVisible ? stylecss.content_manage : stylecss.content_manage_full}`}>
                <div className={stylecss.title_wrapper}>
                    <h2>Chỉnh sửa đề thi</h2>
                </div>
                {!showLoading ? (
                    <>
                        {contentStates.length > 0 && <DraftEditor content={contentStates[0]} id={id} />}
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
        </div>
    );
};

export default ExamDetail;
