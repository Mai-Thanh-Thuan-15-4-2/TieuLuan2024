import React, { useState, useEffect } from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import { styled } from '@mui/system';
import ArticleIcon from '@mui/icons-material/Article';
import InfoIcon from '@mui/icons-material/Info';
import Delete from '@mui/icons-material/Delete';
import { AddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const colors = ['#880000', '#666666', '#FF3300', '#3399FF', '#33FF00', '#FF3366', '#993300', '#3300FF', '#007700', '#FF9900'];

const CustomCard = styled(Card)(({ theme }) => ({
    backgroundImage: `url(${process.env.PUBLIC_URL + '/img/card-bg.jpg'})`,
    color: '#FFFFFF',
    width: '90%',
    border: '3px solid' + colors[Math.floor(Math.random() * colors.length)],
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

const IconArticle = styled('div')({
    position: 'absolute',
    top: '5px',
    left: '5px',
    zIndex: '2'
});

const IconInfo = styled('div')({
    position: 'absolute',
    top: '5px',
    right: '5px',
    fontSize: '25px',
    zIndex: '2'
});

const TextWrapper = styled('div')({
    position: 'absolute',
    bottom: 5,
    right: 5,
});
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
    backgroundColor: 'rgb(0.10,0.00,0.30)',
    color: '#99DDFF',
    border: '2px solid #0056b3',
    padding: '5px 10px',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '10px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 0 10px #00D5FF',
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
        boxShadow: '0 0 30px #00D5FF',
    },
});
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
const BoldLabel = styled('span')({
    fontWeight: 'bold',
});
export const CardItem = ({ id, name, year, credits, link, isEdit, isAdd }) => {
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
    const truncate = (str) => {
        return str.length > 15 ? str.substring(0, 15) + "..." : str;
    };
    return (
        <div style={{ position: 'relative' }}>
            <CustomCard>
                <IconArticle>
                    <ArticleIcon style={{ fontSize: '25px', opacity: '0.4' }} />
                </IconArticle>
                <IconInfo>
                    <InfoIcon onClick={handleInfoClick} />
                    {isEdit && (
                        <>
                            <span style={{ marginRight: '5px' }}></span>
                            <Delete style={{ color: 'red' }} />
                        </>
                    )}
                </IconInfo>
                {!isAdd ? (
                    <ButtonWrapper>
                        <Link to={link}>
                            <CustomButton>Tùy chọn</CustomButton>
                        </Link>
                    </ButtonWrapper>
                ) : (
                    <ButtonWrapper>
                            <CustomButton>Thêm</CustomButton>
                    </ButtonWrapper>
                )}

                <CardContent>
                    <TextWrapper>
                        <Typography variant="h5">{truncate(name)}</Typography>
                    </TextWrapper>
                </CardContent>
            </CustomCard>
            {detailsOpened && (
                <DetailCard>
                    <Typography><BoldLabel>ID:</BoldLabel> {id}</Typography>
                    <Typography><BoldLabel>Tên:</BoldLabel> {name}</Typography>
                    <Typography><BoldLabel>Số tín chỉ:</BoldLabel> {credits}</Typography>
                    <Typography><BoldLabel>Năm học:</BoldLabel> {year}</Typography>
                </DetailCard>
            )}
        </div>
    );
};