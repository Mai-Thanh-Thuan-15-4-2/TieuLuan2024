import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ArticleIcon from '@mui/icons-material/Article';
import Lock from '@mui/icons-material/Lock';
import Restore from '@mui/icons-material/Restore';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Visibility from '@mui/icons-material/Visibility';
import LockOpen from '@mui/icons-material/LockOpen';
import { useTheme, useMediaQuery } from '@material-ui/core';


const CustomCard = styled(Card)(({ theme }) => ({
    backgroundColor: 'GhostWhite',
    width: '95%',
    height: '100%',
    padding: theme.spacing(2),
    margin: theme.spacing(1),
    textAlign: 'right',
    position: 'relative',
    cursor: 'pointer',
    marginLeft: '20px',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
        transform: 'scale(1.05)',
        zIndex: '1',
        '& $DetailCard': {
            opacity: 1,
            pointerEvents: 'auto'
        }
    }
}));
const IconInfo = styled('div')({
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '25px',
    zIndex: '2'
});
const IconDelete = styled('div')({
    position: 'absolute',
    alignItems: 'center',
    right: '20px',
    zIndex: '2'
});

const TextWrapper = styled('div')(({ theme }) => ({
    position: 'absolute',
    top: 5,
    left: 10,
    '& p': {
        maxWidth: '70ch',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    [theme.breakpoints.down('sm')]: {
        '& p': {
            maxWidth: '30ch',
        },
    },
}));
const AnswerWrapper = styled('div')(({ theme }) => ({
    position: 'absolute',
    bottom: 5,
    left: 10,
    '& p': {
        maxWidth: '70ch',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
    },
    [theme.breakpoints.down('sm')]: {
        '& p': {
            maxWidth: '30ch',
        },
    },
}));
const DetailCard = styled(Card)(({ theme }) => ({
    position: 'absolute',
    top: 'calc(15% + 10px)',
    left: '50%',
    width: "80%",
    transform: 'translateX(-50%)',
    padding: theme.spacing(2),
    backgroundColor: 'white',
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
const BoldLabel = styled('span')({
    fontWeight: 'bold',
});
const BlueText = styled('span')({
    color: "#1f30b2",
    fontWeight: 'bold'
});
export const QuestionCard = ({ id_acc, id, question, answers, correct_answer, category, author, isdelete }) => {
    const [detailsOpened, setDetailsOpened] = useState(false);
    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
        return str.length > length ? str.substring(0, length) + "..." : str;
    };
    return (
        <div style={{ position: 'relative' }}>
            <CustomCard>
                {!isdelete ? (
                    <IconInfo>
                        <Visibility onClick={handleInfoClick} style={{ marginRight: '5px', color: '#3366FF' }} />
                        <LockOpen style={{ marginRight: '5px' }} />
                        {(id_acc === author) ? (
                            <>
                                <Edit style={{ marginRight: '5px', color: '#3366FF' }} />
                                <Delete style={{ marginRight: '5px', color: 'red' }} />
                            </>
                        ) : (
                            <>
                                <Edit style={{ marginRight: '5px', color: 'lightgray' }} />
                                <Delete style={{ marginRight: '5px', color: 'lightgray' }} />
                            </>
                        )}
                    </IconInfo>
                ) : (
                    <>
                        <IconDelete>
                            <Restore style={{ marginRight: '5px', color: 'green', fontSize: '30px' }} />
                            <Delete style={{ marginRight: '5px', color: 'red', fontSize: '30px' }} />
                        </IconDelete>
                    </>
                )}
                <CardContent>
                    <TextWrapper theme={theme}>
                        <Typography variant="p">
                            <BoldLabel>Câu hỏi: </BoldLabel>
                            <BlueText>{isSmallScreen ? truncate(question, 30) : truncate(question, 100)}</BlueText>
                        </Typography>
                    </TextWrapper>
                    <AnswerWrapper theme={theme}>
                        <Typography variant="p">
                            <BoldLabel>Đáp án đúng: </BoldLabel>
                            {isSmallScreen ? truncate(correct_answer, 30) : truncate(correct_answer, 100)}
                        </Typography>
                    </AnswerWrapper>
                </CardContent>
            </CustomCard>
            {detailsOpened && (
                <DetailCard>
                    <Typography><BoldLabel>ID: </BoldLabel> {id}</Typography>
                    <Typography><BoldLabel>Nội dung: </BoldLabel>{question}</Typography>
                    <Typography><BoldLabel>Chủ đề: </BoldLabel>{category}</Typography>
                    <Typography><BoldLabel>Đáp án: </BoldLabel></Typography>
                    {answers.map((answer, index) => (
                        <Typography key={answer.id}>
                            {index + 1}. {answer.text}
                        </Typography>
                    ))}
                    <Typography><BoldLabel>Đáp án đúng: </BoldLabel>{correct_answer}</Typography>
                </DetailCard>
            )}
        </div>
    );
};