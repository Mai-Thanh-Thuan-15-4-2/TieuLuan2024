import React, { useState } from 'react';
import { Grid, IconButton, Typography, Modal, Card, CardHeader, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { AddCircleOutline, Edit, Delete} from '@mui/icons-material';

const ModalTopicManage = ({ categories, id }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [openSubModal, setOpenSubModal] = useState(false);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        handleOpenModal();
    };

    const handleSubModalOpen = () => {
        setOpenSubModal(true);
    };

    const handleSubModalClose = () => {
        setOpenSubModal(false);
    };
    const truncate = (str) => {
        return str.length > 30 ? str.substring(0, 30) + "..." : str;
    };
    return (
        <div>
            <Grid container spacing={2}>
                {categories.map((category, index) => (
                    <Grid item xs={12} sm={6} md={4} key={index}>
                        <Card style={{background: 'linear-gradient(to bottom, #B8DEDE, white)'}}>
                            <CardHeader
                                title={truncate(category.content)}
                                action={
                                    <>
                                        <IconButton onClick={() => handleCategoryClick(category)}>
                                            <Edit />
                                        </IconButton>
                                        <IconButton>
                                            <Delete style={{color: 'red'}}/>
                                        </IconButton>
                                    </>
                                }
                            />
                        </Card>

                    </Grid>
                ))}
                <IconButton style={{marginTop: '10px', marginLeft: '20px'}}>
                    <AddCircleOutline style={{ fontSize: '30px', color: 'blue' }}/>
                </IconButton>
            </Grid>
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Dialog onClose={handleCloseModal} open={openModal}>
                    <DialogTitle id="modal-title">{selectedCategory && selectedCategory.content}</DialogTitle>
                    <DialogContent>
                        <Typography variant="body1" id="modal-description">
                            <Button onClick={handleSubModalOpen}>Open Sub Modal</Button>
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseModal}>Close</Button>
                    </DialogActions>
                </Dialog>
            </Modal>
            <Dialog onClose={handleSubModalClose} open={openSubModal}>
                <DialogTitle>Sub Modal Title</DialogTitle>
                <DialogContent>
                    <Typography>Sub Modal Content</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleSubModalClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default ModalTopicManage;
