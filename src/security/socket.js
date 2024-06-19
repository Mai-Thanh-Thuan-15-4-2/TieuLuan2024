const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const Blockchain = require('./sqliteManage.js');
const hashExam = require('./hashBlock.js');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const blockchain = new Blockchain();

blockchain.createTable();

app.get('/socket.io/*', (req, res) => {
  io.httpServer.emit('request', req, res);
});

app.get('/blockchain', (req, res) => {
  // Truy vấn blockchain từ cơ sở dữ liệu
  blockchain.printBlockchain((err, blockchainData) => {
    if (err) {
      console.error('Failed to fetch blockchain:', err.message);
      res.status(500).json({ error: 'Failed to fetch blockchain' });
    } else {
      res.json(blockchainData);
    }
  });
});

io.on('connection', (socket) => {
  console.log('A user connected');
  // Gửi blockchain ban đầu đến người dùng mới kết nối
  socket.emit('blockchain', blockchain);
  socket.on('addExamToBlockchain', (exam) => {
    console.log('Received new exam from client:', exam);
    // Thêm exam vào chuỗi blockchain
    const hash = new hashExam(exam);
    const data =  hash.getExamWithHash();
    blockchain.addBlock(data);
    // Gửi lại blockchain mới cho tất cả các client
    io.emit('blockchain', blockchain);
    console.log('Blockchain updated and sent to all clients.');
  });
});


server.listen(8080, () => {
  console.log('Server is running on port 8080');
});
