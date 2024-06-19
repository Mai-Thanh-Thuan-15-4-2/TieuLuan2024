const crypto = require('crypto');

class hashExam {
    constructor(exam) {
      this.info = exam.contentState.info;
      this.blocks = exam.contentState.blocks;
    }
    hashBlocks() {
        const sortedBlocks = this.blocks.map(block => JSON.stringify(block)).sort();
        return crypto.createHash('sha256').update(sortedBlocks.join('')).digest('hex');
    }
    getExamWithHash() {
      return {
        info: this.info,
        hash: this.hashBlocks()
      };
    }
  }  

  module.exports = hashExam;