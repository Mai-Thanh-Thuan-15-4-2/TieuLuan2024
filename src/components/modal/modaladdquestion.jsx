import React, { useState } from 'react';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import stylecss from '../../styles-page/exam.module.css';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import Type0 from './type0';
import Type1 from './type1';
import Type2 from './type2';
import Type3 from './type3';
import Type4 from './type4';
import Type5 from './type5';
import Type6 from './type6';

const ModalAddQuestion = ({ id, title, open, onClose, categories, mainSubjects, account}) => {
    const [confirmCloseModal, setConfirmCloseModal] = useState(false);

    const contentById = {
        'type0': (
            <Type0></Type0>
        ),
        'type1': (
            <Type1 categories={categories}></Type1>
        ),
        'type2': (
            <Type2 categories={categories}></Type2>
        ),
        'type3': (
            <Type3 categories={categories}></Type3>
        ),
        'type4': (
            <Type4 categories={categories}></Type4>
        ),
        'type5': (
            <Type5 categories={categories}></Type5>
        ),
        'type6': (
            <Type6 categories={categories}></Type6>
        ),
    };

    const handleClose = () => {
        if (confirmCloseModal) {
            onClose();
            setConfirmCloseModal(false);
        } else {
            setConfirmCloseModal(true);
        }
    };

    return (
        <>
            <Modal
                open={confirmCloseModal}
                onClose={() => setConfirmCloseModal(false)}
                aria-labelledby="confirm-close-title"
                aria-describedby="confirm-close-description"
            >
                <div className={stylecss.modalClose}>
                    <Typography className={stylecss.modalClose_title} variant="p" id="confirm-close-title" gutterBottom>
                        Bạn có chắc chắn muốn thoát không?
                    </Typography>
                    <div className={stylecss.modalClose_actions}>
                        <button className={stylecss.button_close} onClick={() => setConfirmCloseModal(false)}>Hủy</button>
                        <button className={stylecss.button_confirm} onClick={handleClose}>Đồng ý</button>
                    </div>
                </div>
            </Modal>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <>
                    <IconButton
                        className={stylecss.btnClose}
                        aria-label="close"
                        onClick={handleClose}
                    >
                        <Close style={{ fontSize: '30px', color: 'red' }} />
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
                           Loại câu hỏi: <span style={{fontWeight: 'bold'}}>{title}</span>
                        </Typography>
                        {contentById[id]}
                    </div>
                </>
            </Modal>

        </>
    );
};

export default ModalAddQuestion;


