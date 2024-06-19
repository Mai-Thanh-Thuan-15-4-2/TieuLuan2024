import io from 'socket.io-client';

class SocketManager {
  constructor() {
    this.socket = io('ws://localhost:8080');
    this.socket.on('connect', () => {
      console.log('Connected to server');
    });
    this.socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }

  addEventListener(event, callback) {
    this.socket.on(event, callback);
  }
  addBlock(exam) {
    this.socket.emit('addExamToBlockchain', exam);
  }
  disconnect() {
    this.socket.disconnect();
  }
}

export default SocketManager;
