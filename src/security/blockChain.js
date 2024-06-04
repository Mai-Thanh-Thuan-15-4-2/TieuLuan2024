const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)).toString();
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2024", "Genesis Block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }
        return true;
    }
}

class JSONBlockchain extends Blockchain {
    constructor(jsonString) {
        super();
        this.jsonData = JSON.parse(jsonString);
        this.blocks = this.jsonData.contentState.blocks;
        this.formatEditDate();
        this.addBlocksFromJSON();
    }

    formatEditDate() {
        const editDate = this.jsonData.contentState.info.edit_date;
        const dateObj = new Date(editDate);
        const day = dateObj.getDate();
        const month = dateObj.getMonth() + 1;
        const year = dateObj.getFullYear();
        this.formattedEditDate = `${(day < 10 ? '0' : '') + day}/${(month < 10 ? '0' : '') + month}/${year}`;
    }

    addBlocksFromJSON() {
        for (let i = 0; i < this.blocks.length; i++) {
            const blockData = this.blocks[i];
            const block = new Block(i + 1, this.formattedEditDate, blockData, this.getLatestBlock().hash);
            this.addBlock(block);
        }
    }
}

// Chuỗi JSON từ bên ngoài
const jsonString = `{
    "contentState": {
        "info": {
            "id": "EXAM_1002_1",
            "status": 1,
            "create_date": "2024-04-11T16:17:10.021Z",
            "edit_date": "2024-04-11T16:17:13.184Z",
            "subject": "214231"
        },
        "entityMap": {},
        "blocks": [
            {
                "key": "title_exam",
                "text": "Đề thi 1",
                "type": "unstyle",
                "depth": 0,
                "inlineStyleRanges": [
                    {
                        "offset": 0,
                        "length": 1,
                        "style": "BOLD"
                    }
                ],
                "entityRanges": [],
                "data": {}
            }
        ]
    }
}`;

const jsonBlockchain = new JSONBlockchain(jsonString);
console.log('Blockchain:', jsonBlockchain);
console.log('Is blockchain valid?', jsonBlockchain.isChainValid());
