const crypto = require('crypto');

function hashBlock(block) {
    // Chuyển đổi block thành chuỗi JSON
    const blockJson = JSON.stringify(block, Object.keys(block).sort());
    
    // Tạo hash SHA-256
    return crypto.createHash('sha256').update(blockJson).digest('hex');
}

// Đề thi ban đầu
const originalExam = {
    contentState: {
        info: {
            id: "EXAM_1002_2",
            status: 1,
            create_date: "2024-04-11T16:17:10.021Z",
            edit_date: "2024-04-11T16:17:13.184Z",
            subject: "214231"
        },
        entityMap: {},
        blocks: [
            {
                key: "title_exam",
                text: "Đề thi 2",
                type: "unstyle",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 1,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "question_CTMT4",
                text: "1. Hệ điều hành trong máy tính có vai trò gì?",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 47,
                        style: "BOLD"
                    },
                    {
                        offset: 0,
                        length: 47,
                        style: "ITALIC"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam00",
                text: "A. Quản lý và điều phối các tài nguyên hệ thống",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam01",
                text: "B. Chỉ để lưu trữ dữ liệu",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam02",
                text: "C. Chỉ để xử lý các tác vụ và chương trình",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam03",
                text: "D. Chỉ để hiển thị hình ảnh",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "endBlock",
                text: "HẾT",
                type: "centerAlign",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 6,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            }
        ]
    }
};

// Hash các block trong đề thi ban đầu
const hashedBlocks = {};
originalExam.contentState.blocks.forEach(block => {
    hashedBlocks[block.key] = hashBlock(block);
});

// Kiểm tra sự thay đổi của block
function checkBlockChanges(newExam) {
    newExam.contentState.blocks.forEach(block => {
        const blockKey = block.key;
        const newHash = hashBlock(block);

        if (hashedBlocks[blockKey]) {
            if (newHash !== hashedBlocks[blockKey]) {
                console.log(`Block ${blockKey} đã thay đổi.`);
            }
        } else {
            console.log(`Block ${blockKey} không tồn tại trong đề thi ban đầu.`);
        }
    });
}

// Đề thi mới (có thay đổi)
const changedExam = {
    contentState: {
        info: {
            id: "EXAM_1002_2",
            status: 1,
            create_date: "2024-04-11T16:17:10.021Z",
            edit_date: "2024-04-11T16:17:13.184Z",
            subject: "214231"
        },
        entityMap: {},
        blocks: [
            {
                key: "title_exam",
                text: "Đề thi 2",
                type: "unstyle",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 1,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "question_CTMT4",
                text: "1. Hệ điều hành trong máy tính có vai trò gì?",
                type: "unstyled",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 47,
                        style: "BOLD"
                    },
                    {
                        offset: 0,
                        length: 47,
                        style: "ITALIC"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam00",
                text: "A. Quản lý và điều phối các tài nguyên hệ thống",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam01",
                text: "B. Chỉ để lưu trữ dữ liệu",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam02",
                text: "C. Chỉ để xử lý các tác vụdvfdv  fwfc    và chương trình",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "answer_exam03",
                text: "D. Chỉ để hiển thị hình ảnh",
                type: "unstyled",
                depth: 5,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 2,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            },
            {
                key: "endBlock",
                text: "HẾT",
                type: "centerAlign",
                depth: 0,
                inlineStyleRanges: [
                    {
                        offset: 0,
                        length: 6,
                        style: "BOLD"
                    }
                ],
                entityRanges: [],
                data: {}
            }
        ]
    }
};

// Kiểm tra sự thay đổi của block trong đề thi mới
checkBlockChanges(changedExam);
