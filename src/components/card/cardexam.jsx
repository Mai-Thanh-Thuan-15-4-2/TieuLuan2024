import React, { useState, useEffect } from 'react';
import { styled } from '@mui/system';
import stylecss from '../../styles-page/exam.module.css';
import InfoIcon from '@mui/icons-material/Info';
import { Card, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import Delete from '@mui/icons-material/Delete';


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
const CardExam = ({ id, name, subject, totalquestion, createdate, editdate, link, isDelete }) => {
    const [detailsOpened, setDetailsOpened] = useState(false);

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
    const truncate = (str, lenght) => {
        return str.length > lenght ? str.substring(0, lenght) + "..." : str;
    };
    return (
        <div style={{ position: 'relative' }}>
            <div className={stylecss.examCard}>
                <div className={stylecss.examTitle}>
                    <p className={stylecss.examName}>{truncate(name, 25)}</p>
                    <IconInfo>
                    <InfoIcon onClick={handleInfoClick} />
                    {isDelete && (
                        <>
                            <span style={{ marginRight: '5px' }}></span>
                            <Delete style={{ color: 'red' }} />
                        </>
                    )}
                </IconInfo>
                </div>
                <ButtonWrapper>
                    <Link to={link}>
                        <CustomButton>Tùy chọn</CustomButton>
                    </Link>
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
