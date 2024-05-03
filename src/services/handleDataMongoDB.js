const MongoDBConnect = require('./MongoDBConnect.js');

class HandleDataMongoDB {
  constructor() {
    this.init();
  }

  async init() {
    this.mongoDBConnect = await MongoDBConnect.getInstance();
    await this.mongoDBConnect.connect();
    this.collectionName = 'EXAM_COLLECTION';
    this.collection = this.mongoDBConnect.db.collection(this.collectionName);
  }
  async getDocument() {
    try {
      if (this.collection) {
        return await this.collection.findOne({});
      } else {
        throw new Error('Collection not initialized');
      }
    } catch (error) {
      console.error('Error getting document:', error);
      throw error;
    }
  }

  async getHeader() {
    const document = await this.getDocument();
    return document.Header;
  }

  async getBasicExams() {
    try {
      const document = await this.getDocument();
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.Exams) {
        throw new Error('Exams field not found in the document');
      }
      if (!document.Exams.basic) {
        throw new Error('Basic exams data not found in the Exams field');
      }
      return document.Exams.basic;
    } catch (error) {
      console.error('Error getting basic exams:', error);
      throw error;
    }
  }

  async getMainExams() {
    const document = await this.getDocument();
    if (!document || !document.Exams || !document.Exams.main) {
      throw new Error('Main exams data not found');
    }
    return document.Exams.main;
  }
  async getListAccount() {
    try {
      const document = await this.getDocument();
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.Accounts) {
        throw new Error('Accounts field not found in the document');
      }
      return document.Accounts;
    } catch (error) {
      console.error('Error getting account list:', error);
      throw error;
    }
  }
  async getAccountById(accountId) {
    try {
      const document = await this.getDocument();
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.Accounts) {
        throw new Error('Accounts field not found in the document');
      }
      const account = document.Accounts.find(acc => acc.id === accountId);
      if (!account) {
        throw new Error(`Account with ID ${accountId} not found`);
      }
      return account;
    } catch (error) {
      console.error('Error getting account by ID:', error);
      throw error;
    }
  }
  async updateContentStateById(accountId, examId, newBlocks) {
    try {
        const currentDate = new Date();
        const currentDateTimeString = currentDate.toISOString();
        
        const document = await this.getDocument();
        if (!document || !document.Accounts) {
            throw new Error('Data or Accounts not found in the document');
        }
        const account = document.Accounts.find(acc => acc.id === accountId);
        if (!account || !account.listexams) {
            throw new Error(`Account with ID ${accountId} not found or does not have listexams`);
        }
        const examIndex = account.listexams.findIndex(exam => exam.contentState && exam.contentState.info && exam.contentState.info.id === examId);
        if (examIndex === -1) {
            throw new Error(`Exam with ID ${examId} not found in the listexams of account ${accountId}`);
        }

        const currentInfo = { ...account.listexams[examIndex].contentState.info };
        console.log(currentInfo);
        const newContentState = {
          blocks: newBlocks,
          entityMap: {},
          info: {
              ...currentInfo, 
              edit_date: currentDateTimeString 
          }
      };
        account.listexams[examIndex].contentState = newContentState;
        await this.collection.updateOne({}, { $set: { 'Accounts': document.Accounts } });
        console.log(`Content state updated successfully for exam with ID ${examId} of account ${accountId}`);
    } catch (error) {
        console.error('Error updating content state:', error);
        throw error;
    }
}
  async getPara() {
    const document = await this.getDocument();
    return document.Header.paragraph;
  }

  async updateTitle(newTitle) {
    try {
      await this.collection.updateOne({}, { $set: { 'Header.title': newTitle } });
      console.log('Title updated successfully');
    } catch (error) {
      console.error('Error updating title:', error);
      throw error;
    }
  }

  async updatePara(newPara) {
    try {
      await this.collection.updateOne({}, { $set: { 'Header.paragraph': newPara } });
      console.log('Paragraph updated successfully');
    } catch (error) {
      console.error('Error updating paragraph:', error);
      throw error;
    }
  }
}

module.exports = HandleDataMongoDB;
