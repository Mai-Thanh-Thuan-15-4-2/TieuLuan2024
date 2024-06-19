const sqlite3 = require('sqlite3').verbose();
const hashExam = require('./hashBlock.js');

class Blockchain {
  constructor() {
    this.db = new sqlite3.Database('./blockchain.db', (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Connected to the blockchain database.');
    });
  }

  createTable() {
    this.db.run(`CREATE TABLE IF NOT EXISTS blockchain (
      "index" INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT,
      id_sub TEXT,
      previous_hash TEXT,
      hash TEXT
    )`, (err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Created blockchain table.');
    });
  }

  getIndex(callback) {
    this.db.get(`SELECT MAX("index") AS maxIndex FROM blockchain`, (err, row) => {
      if (err) {
        console.error(err.message);
        callback(err, null);
      } else {
        const newIndex = row.maxIndex ? row.maxIndex + 1 : 1;
        callback(null, newIndex);
      }
    });
  }

  addBlock(exam) {
    this.getIndex((err, newIndex) => {
      if (err) {
        console.error('Failed to get index:', err.message);
      } else {
        this.getPreviousHash(newIndex - 1, (err, previousHash) => {
          if (err) {
            console.error('Failed to get previous hash:', err.message);
          } else {
            if (previousHash === exam.hash) {
              console.error('Invalid blockchain: Previous hash equals to current hash');
            } else {
              const block = {
                index: newIndex,
                timestamp: exam.info ? (exam.info.create_date || new Date().toISOString()) : new Date().toISOString(),
                id_sub: exam.info ? exam.info.subject : '',
                previous_hash: previousHash,
                hash: exam.hash
              };
              this.db.run(`INSERT INTO blockchain("index", timestamp, id_sub, previous_hash, hash) VALUES(?, ?, ?, ?, ?)`, 
                [block.index, block.timestamp, block.id_sub, block.previous_hash, block.hash], (err) => {
                if (err) {
                  console.error(err.message);
                } else {
                  console.log('Added new block to blockchain.');
                  this.printBlockchain();
                }
              });
            }
          }
        });
      }
    });
  }

  getPreviousHash(index, callback) {
    if (index === 0) {
      callback(null, '0');
    } else {
      this.db.get(`SELECT hash FROM blockchain WHERE "index" = ?`, [index], (err, row) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, row.hash);
        }
      });
    }
  }

  printBlockchain() {
    this.db.each(`SELECT "index", timestamp, id_sub, previous_hash, hash FROM blockchain`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      console.log(row);
    });
  }

  closeConnection() {
    this.db.close((err) => {
      if (err) {
        console.error(err.message);
      }
      console.log('Closed the database connection.');
    });
  }
}

module.exports = Blockchain;

// // Sử dụng lớp Blockchain
// const blockchain = new Blockchain();
// blockchain.createTable();

// // Giả sử chúng ta có một đề thi mới
// const originalExam = {
//     contentState: {
//         info: {
//             id: "EXAM_1002_2",
//             status: 1,
//             create_date: "2024-04-11T16:17:10.021Z",
//             edit_date: "2024-04-11T16:17:13.184Z",
//             subject: "214231"
//         },
//         entityMap: {},
//         blocks: [
//             {
//                 key: "title_exam",
//                 text: "Đề thi 2",
//                 type: "unstyle",
//                 depth: 0,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 1,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "question_CTMT4",
//                 text: "1. Hệ điều hành trong vcdwcew máy tính có vai trò gì?",
//                 type: "unstyled",
//                 depth: 0,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 47,
//                         style: "BOLD"
//                     },
//                     {
//                         offset: 0,
//                         length: 47,
//                         style: "ITALIC"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "answer_exam00",
//                 text: "A. Quản lý và điều phối các tài nguyên hệ thống",
//                 type: "unstyled",
//                 depth: 5,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 2,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "answer_exam01",
//                 text: "B. Chỉ để lưu trữ dữ liệu",
//                 type: "unstyled",
//                 depth: 5,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 2,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "answer_exam02",
//                 text: "C. Chỉ để xử lý các tác vụ lkk và chương trình",
//                 type: "unstyled",
//                 depth: 5,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 2,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "answer_exam03",
//                 text: "D. Chỉ để hiển tfqsfcdw wqfcq hị hình ảnh",
//                 type: "unstyled",
//                 depth: 5,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 2,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             },
//             {
//                 key: "endBlock",
//                 text: "HẾT",
//                 type: "centerAlign",
//                 depth: 0,
//                 inlineStyleRanges: [
//                     {
//                         offset: 0,
//                         length: 6,
//                         style: "BOLD"
//                     }
//                 ],
//                 entityRanges: [],
//                 data: {}
//             }
//         ]
//     }
// };

// const exam = new hashExam(originalExam);
// const data = exam.getExamWithHash();
// blockchain.addBlock(data);
// blockchain.printBlockchain();
// blockchain.closeConnection();
