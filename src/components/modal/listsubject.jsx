import React from 'react';
import { Grid } from '@mui/material';
import { CardItem } from '../card/card';

const ListSubject = ({ listSubjects }) => {
    return (
        <Grid container spacing={2}>
            {listSubjects.map(subject => (
                <Grid item xs={12} sm={6} md={3} key={subject.id}>
                    <CardItem
                        name={subject.name}
                        id={subject.id}
                        year={subject.year}
                        credits={subject.credits}
                        isAdd={true}
                    />
                </Grid>
            ))}
        </Grid>
    );
}

export default ListSubject;
