import React, { useState } from 'react';
import { Grid, IconButton, Typography, Modal, TextField } from '@mui/material';
import stylecss from '../../styles-page/exam.module.css';
import CloseIcon from '@mui/icons-material/Close';
import ListSubject from './listsubject';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import InputAdornment from '@mui/material/InputAdornment';


const ModalAddSubject = ({ open, onClose, listSubjects, showLoading, openModal, sucess}) => {
    const [confirmModal, setConfirmModal] = useState(false);
    const [subjectInfo, setSubjectInfo] = useState({
        id: '',
        name: '',
        credits: 0,
        year: 0
    });
    const [showErrorName, setShowErrorName] = useState(false);
    const [showErrorId, setShowErrorId] = useState(false);
    const [showErrorEmpty, setShowErrorEmpty] = useState(false);
    const isDuplicateId = (id) => {
        return listSubjects.some(subject => subject.id === id);
    };
    const isDuplicateName = (name) => {
        const lowerCaseName = name.toLowerCase();
        return listSubjects.some(subject => subject.name.toLowerCase() === lowerCaseName);
    };
    const handleConfirm = () => {
        const { id, name } = subjectInfo;
        const duplicateId = isDuplicateId(id);
        const duplicateName = isDuplicateName(name);

        if (!id.trim() && !name.trim()) {
            setShowErrorEmpty(true);
        } else if (!id.trim()) {
            setShowErrorEmpty(true);
        } else if (!name.trim()) {
            setShowErrorEmpty(true);
        } else if (duplicateId && duplicateName) {
            setShowErrorId(true);
            setShowErrorName(true);
        } else if (duplicateId) {
            setShowErrorId(true);
            setShowErrorName(false);
        } else if (duplicateName) {
            setShowErrorId(false);
            setShowErrorName(true);
        } else {
            onClose();
            setConfirmModal(false);
            setShowErrorId(false);
            setShowErrorName(false);
        }
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        setSubjectInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };
    const handleClose = () => {
        if (confirmModal) {
            onClose();
        } else {
            setConfirmModal(true);
        }
    };

    const handleCancelModal = () => {
        setConfirmModal(false);
        setShowErrorEmpty(false);
        setShowErrorId(false)
        setShowErrorName(false)
    };
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const filteredSubjects = listSubjects.filter(subject => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const lowerCaseId = subject.id.toLowerCase();
        const lowerCaseName = subject.name.toLowerCase();
        return lowerCaseId.includes(lowerCaseSearchTerm) || lowerCaseName.includes(lowerCaseSearchTerm);
    });
    return (
        <>
            <Modal
                open={confirmModal}
                onClose={handleCancelModal}
                aria-labelledby="confirm-close-title"
                aria-describedby="confirm-close-description"
            >
                <div className={stylecss.modalClose}>
                    <Typography
                        style={{
                            marginBottom: '20px',
                            fontSize: '18px'
                        }}
                        className={stylecss.modalHeader_addquestion}
                        variant="h5"
                        id="modal-title"
                        gutterBottom
                    >
                        Thêm môn học
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<p>Mã môn học</p>}
                                name="id"
                                value={subjectInfo.id}
                                onChange={handleChange}
                            />
                            {showErrorId && (
                                <p style={{ color: 'red' }}>*Mã môn học đã có trước đó</p>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<p>Tên môn học</p>}
                                name="name"
                                value={subjectInfo.name}
                                onChange={handleChange}
                            />
                            {showErrorName && (
                                <p style={{ color: 'red' }}>*Tên môn học đã có trước đó</p>
                            )}
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<p>Số tín chỉ</p>}
                                name="credits"
                                type='number'
                                inputProps={{ min: 0 }}
                                value={subjectInfo.credits}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label={<p>Năm học</p>}
                                name="year"
                                type='number'
                                inputProps={{ min: 0, max: 4 }}
                                value={subjectInfo.year}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>
                    {showErrorEmpty && (
                        <p style={{ color: 'red' }}>*Không được để trống tên hoặc mã môn học</p>
                    )}
                    <div className={stylecss.modalClose_actions}>
                        <button className={stylecss.button_close} onClick={handleCancelModal}>Hủy</button>
                        <button className={stylecss.button_confirm} style={{ backgroundColor: 'blue' }} onClick={handleConfirm}>Thêm</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <>
                    <IconButton
                        className={stylecss.btnClose}
                        aria-label="close"
                        onClick={onClose}
                    >
                        <CloseIcon style={{ fontSize: '30px', color: 'red' }} />
                    </IconButton>
                    <div className={stylecss.modalContent_addquestion}>
                        <Typography
                            style={{
                                marginTop: '40px',
                                marginBottom: '20px',
                                fontSize: '20px'
                            }}
                            className={stylecss.modalHeader_addquestion}
                            variant="h5"
                            id="modal-title"
                            gutterBottom
                        >
                            Thêm môn học
                        </Typography>
                        <div className={stylecss.add_subject}>
                            <InputBase
                                placeholder="Tìm kiếm..."
                                inputProps={{ 'aria-label': 'search' }}
                                sx={{
                                    border: '1px solid black',
                                    borderRadius: '4px',
                                    padding: '8px 12px',
                                    width: '50%',
                                    marginLeft: '20px',
                                    fontSize: '13px'
                                }}
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="search"
                                            style={{ cursor: 'default' }}
                                        >
                                            <SearchIcon style={{ cursor: 'default' }} />
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                            <button onClick={handleClose} className={`${stylecss.btn_add} ${stylecss.right}`}>Thêm môn học mới</button>
                        </div>
                        <ListSubject listSubjects={filteredSubjects} showLoading={showLoading} openModal={openModal} sucess={sucess} />
                    </div>
                </>
            </Modal>
        </>
    );
};

export default ModalAddSubject;
