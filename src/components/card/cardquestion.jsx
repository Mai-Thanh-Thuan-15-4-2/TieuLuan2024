import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
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
export const QuestionCard = ({ id_acc, id, question, answers, correct_answer, category, author, name, type, isdelete, answer, childquestions }) => {
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
        if (str && typeof str === 'string') {
            return str.length > length ? str.substring(0, length) + "..." : str;
        }
        return "";
    };
    const groupWordsByIndex = (answers) => {
        let groupedWords = [];
        let currentGroup = [];

        answers.forEach((answer, index) => {
            const prevAnswer = answers[index - 1];

            if (!prevAnswer || answer.index === prevAnswer.index + 1) {

                currentGroup.push(answer.word);
            } else {

                groupedWords.push(currentGroup.join(' '));
                currentGroup = [answer.word];
            }
        });

        groupedWords.push(currentGroup.join(' '));

        return groupedWords;
    };
    return (
        <div style={{ position: 'relative' }}>
            <CustomCard>
                {!isdelete ? (
                    <IconInfo>
                        <Visibility onClick={handleInfoClick} style={{ marginRight: '5px', color: 'darkslategrey' }} />
                        {(id_acc === author) ? (
                            <>
                                <LockOpen style={{ marginRight: '5px', color: 'green' }} />
                                <Edit style={{ marginRight: '5px', color: '#3366FF' }} />
                                <Delete style={{ marginRight: '5px', color: 'red' }} />

                            </>
                        ) : (
                            <>
                                <LockOpen style={{ marginRight: '5px', color: 'lightgray' }} />
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
                            {type === 4 ? (
                                <BlueText dangerouslySetInnerHTML={{ __html: isSmallScreen ? truncate(question, 30) : truncate(question, 102) }} />
                            ) : type === 5 ? (
                                <BlueText>{isSmallScreen ? truncate(name, 30) : truncate(name, 100)}</BlueText>
                            ) : (
                                <BlueText>{isSmallScreen ? truncate(question, 30) : truncate(question, 100)}</BlueText>
                            )}
                        </Typography>
                    </TextWrapper>
                    <AnswerWrapper theme={theme}>
                        <Typography variant="p">
                            {type !== 5 ? (
                                <BoldLabel>Đáp án đúng: </BoldLabel>
                            ) : (
                                <BoldLabel>Loại câu hỏi: </BoldLabel>
                            )}
                            {type === 1 || type === 4 ? (
                                isSmallScreen ? truncate(correct_answer, 30) : truncate(correct_answer, 100)
                            ) : type === 2 ? (
                                <>
                                    {answers && answers.filter(answer => answer.correct).map((answer, index) => (
                                        <React.Fragment key={answer.id}>
                                            {index !== 0 && ", "}
                                            {isSmallScreen ? (
                                                truncate(answer.text, 10)
                                            ) : (
                                                truncate(answer.text, 100)
                                            )}
                                        </React.Fragment>
                                    ))}
                                </>
                            ) : type === 5 ? (
                                <span style={{ fontWeight: 'bolder', color: 'green' }}>Đoạn văn</span>
                            ) : type === 6 ? (
                                <span>{isSmallScreen ? truncate(answer, 30) : truncate(answer, 100)}</span>
                            ) : (
                                <>
                                    {answers &&
                                        groupWordsByIndex(answers).map((groupedWord, index) => (
                                            <React.Fragment key={index}>
                                                {index !== 0 && ", "}
                                                {isSmallScreen ? (
                                                    truncate(groupedWord, 10)
                                                ) : (
                                                    truncate(groupedWord, 100)
                                                )}
                                            </React.Fragment>
                                        ))}
                                </>
                            )}
                        </Typography>
                    </AnswerWrapper>
                </CardContent>
            </CustomCard>
            {detailsOpened && (
                <DetailCard>
                    <Typography><BoldLabel>ID: </BoldLabel> {id}</Typography>
                    <Typography><BoldLabel>Chủ đề: </BoldLabel>{category}</Typography>
                    {type === 4 || type === 5 ? (
                        <Typography>
                            <BoldLabel>Nội dung: </BoldLabel>
                            <span dangerouslySetInnerHTML={{ __html: question }} />
                        </Typography>
                    ) : (
                        <Typography>
                            <BoldLabel>Nội dung: </BoldLabel>{question}
                        </Typography>
                    )}
                    {(type === 1 || type === 2 || type === 4 || type === 5) && (
                        <>
                            <Typography><BoldLabel>Đáp án: </BoldLabel></Typography>
                            {answers && (
                                <>
                                    {answers.map((answer, index) => (
                                        <Typography key={answer.id}>
                                            {index + 1}. {answer.text}
                                        </Typography>
                                    ))}
                                </>
                            )}
                        </>
                    )}
                    {type === 5 && childquestions.map((childQuestion, index) => (
                        <div key={childQuestion.id} style={{ fontSize: '10px' }}>
                            <BoldLabel style={{ fontSize: '10px' }}>{`Câu hỏi ${index + 1}: ${childQuestion.text}`}</BoldLabel>
                            {childQuestion.answers.map((childAnswer, childIndex) => (
                                <div key={childAnswer.id} style={{ fontSize: '10px' }}>
                                    <BoldLabel style={{ fontSize: '10px' }}>{`Đáp án ${index + 1}.${childIndex + 1}: `}</BoldLabel>
                                    <span style={{ fontSize: '10px' }}>{childAnswer.text}</span>
                                </div>
                            ))}
                        </div>
                    ))}
                    {type === 1 || type === 4 ? (
                        <Typography><BoldLabel>Đáp án đúng: </BoldLabel>{correct_answer}</Typography>
                    ) : type === 2 ? (
                        <Typography variant="p">
                            <BoldLabel style={{ fontSize: '10px' }}>Đáp án đúng: </BoldLabel>
                            <br></br>
                            {answers && answers.map((answer) => (
                                answer.correct && (
                                    <>
                                        <span style={{ fontSize: '10px' }} key={answer.id}>
                                            {answer.text}
                                        </span>
                                        <br></br>
                                    </>
                                )
                            ))}
                        </Typography>
                    ) : type === 3 ? (
                        <>
                            <BoldLabel style={{ fontSize: '10px' }}>Đáp án đúng: </BoldLabel>
                            {answers &&
                                groupWordsByIndex(answers).map((groupedWord, index) => (
                                    <span key={index} style={{ fontSize: '10px' }}>
                                        {index !== 0 && ", "}
                                        {groupedWord}
                                    </span>
                                ))}
                        </>
                    ) : type === 6 ? (
                        <>
                            <BoldLabel style={{ fontSize: '10px' }}>Đáp án đúng: </BoldLabel>
                            <p>{answer}</p>
                        </>
                    ) : type === 5 ? (
                        <> </>
                    ) : (
                        <>
                            <BoldLabel style={{ fontSize: '10px' }}>Đáp án đúng: </BoldLabel>
                            <br></br>
                            <p>Không có đáp án</p>
                        </>
                    )
                    }
                </DetailCard>
            )}
        </div >
    );
};