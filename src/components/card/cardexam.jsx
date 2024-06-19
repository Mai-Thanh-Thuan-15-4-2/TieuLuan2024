import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import stylecss from '../../styles-page/exam.module.css';
import InfoIcon from '@mui/icons-material/Info';
import { Card, Typography, Modal } from '@mui/material';
import { Link } from 'react-router-dom';
import Delete from '@mui/icons-material/Delete';
import callAPI from '../../services/callAPI';
import Restore from '@mui/icons-material/Restore';
import FolderDeleteIcon from '@mui/icons-material/FolderDelete';
import StarIcon from '@mui/icons-material/Star';


const DetailCard = styled(Card)(({ theme }) => ({
    position: 'absolute',
    top: 'calc(15% + 10px)',
    left: '50%',
    width: "80%",
    transform: 'translateX(-50%)',
    padding: theme.spacing(2),
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '8px 0px 8px 8px',
    textAlign: 'left',
    zIndex: '9999',
    '& strong': {
        fontWeight: 'bold',
    },
    '& p': {
        fontSize: '10px',
        margin: 0,
    },
}));
const ButtonWrapper = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: 0,
    transition: 'all 0.3s ease-in-out',
    zIndex: 1,
    '&:hover': {
        opacity: 1,
        transform: 'translate(-50%, -60%)',
    },
}));

const CustomButton = styled('button')({
    backgroundColor: '#FFFFFF',
    color: '#875304',
    border: '1px solid #875304',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'all 0.3s ease-in-out',
});
const IconInfo = styled('div')({
    position: 'absolute',
    top: '8px',
    right: '8px',
    fontSize: '25px',
    zIndex: '2'
});
const BoldLabel = styled('span')({
    fontWeight: 'bold',
});
const CardExam = ({ id, name, subject, totalquestion, createdate, editdate, link, isDelete, id_account, sucess, openModal, status }) => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    const [confirmCloseModal, setConfirmCloseModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const handleRemoveExamFromAccount = async () => {
        setConfirmCloseModal(false);
        const api = new callAPI();
        openModal();
        try {
            await api.updateStatusExam(id_account, id, 0)
            sucess();
        } catch (error) {
            console.error('Error removing question:', error);
            sucess();
        }
    };
    const handleRestoreExamFromAccount = async () => {
        setConfirmCloseModal(false);
        const api = new callAPI();
        openModal();
        try {
            await api.updateStatusExam(id_account, id, 1)
            sucess();
        } catch (error) {
            console.error('Error removing question:', error);
            sucess();
        }
    };
    const handleDeleteExamFromAccount = async () => {
        setConfirmCloseModal(false);
        const api = new callAPI();
        openModal();
        try {
            await api.deleteExam(id_account, id)
            sucess();
        } catch (error) {
            console.error('Error removing question:', error);
            sucess();
        }
    };
    useEffect(() => {
        let timeoutId;
        if (detailsOpened) {
            timeoutId = setTimeout(() => {
                setDetailsOpened(false);
            }, 2000);
        }
        return () => clearTimeout(timeoutId);
    }, [detailsOpened]);

    const handleInfoClick = () => {
        setDetailsOpened(!detailsOpened);
    };
    const truncate = (str, length) => {
        if (str && typeof str === 'string') {
            return str.length > length ? str.substring(0, length) + "..." : str;
        }
        return str;
    };

    return (
        <div style={{ position: 'relative' }}>
            <Modal
                open={confirmCloseModal}
                onClose={() => setConfirmCloseModal(false)}
                aria-labelledby="confirm-close-title"
                aria-describedby="confirm-close-description"
            >
                <div className={stylecss.modalClose}>
                    <div style={{ textAlign: 'center' }}>
                        {(status === 1 || status === 2) ? (
                            <>
                                <Typography className={stylecss.modalClose_title} variant="p" id="confirm-close-title" gutterBottom>
                                    Xóa đề thi <span style={{ color: 'green' }}>{name}</span>
                                </Typography>
                                <p style={{ color: 'red', fontSize: '15px', marginTop: '10px' }}>Bạn có chắn chắc muốn xóa đề thi này?</p>
                            </>
                        ) : (
                            <>
                                <Typography className={stylecss.modalClose_title} variant="p" id="confirm-close-title" gutterBottom>
                                    Khôi phục <span style={{ color: 'green' }}>{name}</span>
                                </Typography>
                                <p style={{ color: 'red', fontSize: '15px', marginTop: '10px' }}>Bạn có chắn chắc muốn khôi phục đề thi này?</p>
                            </>
                        )}

                    </div>
                    <div className={stylecss.modalClose_actions}>
                        <button className={stylecss.button_close} onClick={() => setConfirmCloseModal(false)}>Quay lại</button>
                        {(status === 1 || status === 2) ? (
                            <button className={stylecss.button_confirm} onClick={handleRemoveExamFromAccount}>Xóa</button>
                        ) : (
                            <button className={stylecss.button_confirm} style={{ backgroundColor: 'green' }} onClick={handleRestoreExamFromAccount}>Khôi phục</button>
                        )}
                    </div>
                </div>
            </Modal>
            <Modal
                open={openDeleteModal}
                onClose={() => setOpenDeleteModal(false)}
                aria-labelledby="confirm-close-title"
                aria-describedby="confirm-close-description"
            >
                <div className={stylecss.modalClose}>
                    <div style={{ textAlign: 'center' }}>
                        <Typography className={stylecss.modalClose_title} variant="p" id="confirm-close-title" gutterBottom>
                            Xóa vĩnh viễn <span style={{ color: 'green' }}>{name}</span>
                        </Typography>
                        <p style={{ color: 'red', fontSize: '15px', marginTop: '10px' }}>Việc xóa vĩnh viễn sẽ không thể nào khôi phục lại.</p>
                    </div>
                    <div className={stylecss.modalClose_actions}>
                        <button className={stylecss.button_close} onClick={() => setOpenDeleteModal(false)}>Quay lại</button>
                        <button className={stylecss.button_confirm} onClick={handleDeleteExamFromAccount}>Xóa</button>
                    </div>
                </div>
            </Modal>
            <div className={stylecss.examCard}>
                <div className={stylecss.examTitle}>
                    <p className={stylecss.examName}>{truncate(name, 25)}</p>
                    <IconInfo>
                        {status === 2 &&
                            <>
                                <StarIcon style={{ color: '#DBBA00' }} />
                                <span style={{ marginRight: '5px' }}></span>
                            </>
                        }
                        <InfoIcon onClick={handleInfoClick} />
                        {isDelete && (
                            <>
                                <span style={{ marginRight: '5px' }}></span>
                                {(status === 1) ? (
                                    <FolderDeleteIcon style={{ color: '#F03405' }} onClick={() => setConfirmCloseModal(true)} />
                                ) : (status === 2) ? (
                                    <Delete style={{ color: 'red' }} onClick={() => setOpenDeleteModal(true)} />
                                ) : (
                                    <>
                                        <Restore style={{ color: 'green' }} onClick={() => setConfirmCloseModal(true)} />
                                        <span style={{ marginRight: '5px' }}></span>
                                        <Delete style={{ color: 'red' }} onClick={() => setOpenDeleteModal(true)} />
                                    </>
                                )}
                            </>

                        )}
                    </IconInfo>
                </div>
                <ButtonWrapper>
                    {(status === 1 || status === 2) && (
                        <Link to={link}>
                            <CustomButton>Tùy chọn</CustomButton>
                        </Link>
                    )}
                </ButtonWrapper>
                <div className={stylecss.examDetails}>
                    <p className={stylecss.examSubject}>{truncate(subject, 20)}</p>
                    <p className={stylecss.examQuestionCount}>{truncate(totalquestion, 15)}</p>
                </div>
            </div>
            {detailsOpened && (
                <DetailCard>
                    <Typography><BoldLabel>ID:</BoldLabel> {id}</Typography>
                    <Typography><BoldLabel>Tên:</BoldLabel> {name}</Typography>
                    <Typography><BoldLabel>Môn học:</BoldLabel> {subject}</Typography>
                    <Typography><BoldLabel>Số câu:</BoldLabel> {totalquestion}</Typography>
                    <Typography><BoldLabel>Ngày tạo:</BoldLabel> {createdate}</Typography>
                    <Typography><BoldLabel>Ngày chỉnh sửa:</BoldLabel> {editdate}</Typography>
                </DetailCard>
            )}
        </div>
    );
}

export default CardExam;
