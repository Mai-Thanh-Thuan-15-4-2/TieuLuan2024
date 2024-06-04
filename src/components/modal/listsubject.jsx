import React, { useCallback } from 'react';
import { Grid } from '@mui/material';
import { CardItem } from '../card/card';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import callAPI from '../../services/callAPI';
import { useParams } from 'react-router-dom';

const ListSubject = ({ listSubjects, showLoading, sucess, openModal }) => {
    const { id } = useParams();
    const handleAddSubjectToAccount = useCallback(async (subjectId) => {
        openModal();
        const api = new callAPI();
        try {
            await api.addSubjectToAccount(id, subjectId)
            sucess();
        } catch (error) {
            console.error('Error removing question:', error);
        }
    }, [openModal, sucess, id]);

    return (
        <Grid container spacing={2}>
            {!showLoading ? (
                <>
                    {listSubjects.map(subject => (
                        <Grid item xs={12} sm={6} md={3} key={subject.id}>
                            <CardItem
                                name={subject.name}
                                id={subject.id}
                                year={subject.year}
                                credits={subject.credits}
                                isAdd={true}
                                handleAddSubject={() => handleAddSubjectToAccount(subject.id)}
                            />
                        </Grid>
                    ))}
                </>
            ) : (<Box sx={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '40vh'
            }}>
                <CircularProgress />
            </Box>)}
        </Grid>
    );
}

export default ListSubject;
