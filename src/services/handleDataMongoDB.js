const MongoDBConnect = require('./MongoDBConnect.js');
const jwt = require('jsonwebtoken');
const md5 = require('crypto-js/md5');

class HandleDataMongoDB {
  constructor() {
    this.init();
  }

  async init() {
    this.mongoDBConnect = await MongoDBConnect.getInstance();
    await this.mongoDBConnect.connect();
    this.collectionName = 'EXAM_COLLECTION';
    // this.collectionName = 'EXAM_DATA2';
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
  async checkLogin(username, password) {
    try {
      const document = await this.getDocument();
  
      if (!document) {
        throw new Error('Document not found');
      }
  
      if (!document.Accounts) {
        throw new Error('Accounts field not found in the document');
      }
  
      const user = document.Accounts.find(account => account.username === username);
  
      if (!user) {
       return 1;
      }
  
      const inputPasswordHash = md5(password).toString();

      if (user.password !== inputPasswordHash) {
        return 2;
      }
  
      const payload = {
        userId: user.id,
        username: user.username,
        status: user.status,
        role: user.role,
        email: user.email,
      };
  
      const token = jwt.sign(payload, 'secretKey');
  
      return token;
    } catch (error) {
      console.error('Error checking login:', error);
      throw error;
    }
  }
  async getUserInfo(token) {
    try {
      const decoded = jwt.verify(token, 'secretKey');
      const user = {
        userId: decoded.userId,
        username: decoded.username,
        status: decoded.status,
        role: decoded.role,
        email: decoded.email
      };
      return user;
    } catch (error) {
      console.error('Lỗi giải mã token:', error);
      throw error;
    }
  }
  async getBasicExams() {
    try {
      const document = await this.getDocument();
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.Subjects) {
        throw new Error('Exams field not found in the document');
      }
      if (!document.Subjects.basic) {
        throw new Error('Basic exams data not found in the Exams field');
      }
      return document.Subjects.basic;
    } catch (error) {
      console.error('Error getting basic exams:', error);
      throw error;
    }
  }
  async getAddQuestion() {
    try {
      const document = await this.getDocument();
      if (!document) {
        throw new Error('Document not found');
      }
      if (!document.Addquestion) {
        throw new Error('Addquestion field not found in the document');
      }
      return document.Addquestion;
    } catch (error) {
      console.error('Error getting additional questions:', error);
      throw error;
    }
  }
  
  async getMainExams() {
    const document = await this.getDocument();
    if (!document || !document.Subjects || !document.Subjects.main) {
      throw new Error('Main exams data not found');
    }
    return document.Subjects.main;
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
async addQuestion(courseId, question) {
  try {
    const document = await this.getDocument();
    if (!document) {
      throw new Error('Document not found');
    }
    if (!document.Subjects || !document.Subjects.main) {
      throw new Error('Exams or main field not found in the document');
    }

    const courseIndex = document.Subjects.main.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    if (!document.Subjects.main[courseIndex].questions) {
      document.Subjects.main[courseIndex].questions = [];
    }
    document.Subjects.main[courseIndex].questions.push(question);

    const updateResult = await this.collection.updateOne(
      { _id: document._id },
      { $set: { 'Subjects.main': document.Subjects.main } }
    );
    return updateResult;
  } catch (error) {
    console.error('Error adding question:', error);
    throw error;
  }
}
async addQuestionAccount(accountId, questionId, subjectId) {
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
      throw new Error('Account not found');
    }

    if (!account.listsub) {
      account.listsub = [];
    }

    let subject = account.listsub.find(sub => sub.id === subjectId);
    if (!subject) {
      throw new Error(`Subject with ID ${subjectId} not found`);
    }

    if (!subject.listquestions) {
      subject.listquestions = [];
    }

    subject.listquestions.push(questionId);

    const filter = {
      "Accounts.id": accountId,
      "Accounts.listsub.id": subjectId
    };

    const update = {
      $set: {
        "Accounts.$[acc].listsub.$[sub].listquestions": subject.listquestions
      }
    };

    const options = {
      arrayFilters: [
        { "acc.id": accountId },
        { "sub.id": subjectId }
      ],
      returnOriginal: false
    };

    console.log('Filter:', JSON.stringify(filter));
    console.log('Update:', JSON.stringify(update));
    console.log('Options:', JSON.stringify(options));

    const updatedDocument = await this.collection.findOneAndUpdate(filter, update, options);
    if (!updatedDocument || !updatedDocument.value) {
      throw new Error('Failed to update document');
    }
  } catch (error) {
    console.error('Error adding question to account:', error);
    throw error;
  }
}
async removeQuestionFromAccount(accountId, questionId, subjectId) {
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
          throw new Error('Account not found');
      }

      const subject = account.listsub.find(sub => sub.id === subjectId);
      if (!subject) {
          throw new Error('Subject not found');
      }

      const filter = {
          "Accounts.id": accountId,
          "Accounts.listsub.id": subjectId
      };

      const update = {
          $pull: { "Accounts.$[acc].listsub.$[sub].listquestions": questionId }
      };

      const options = {
          arrayFilters: [
              { "acc.id": accountId },
              { "sub.id": subjectId }
          ],
          returnOriginal: false
      };

      const result = await this.collection.findOneAndUpdate(filter, update, options);
      if (!result || !result.value) {
          // throw new Error('Failed to update document');
      }
      return result;
  } catch (error) {
      // console.error('Error removing question from account:', error);
      // throw error;
  }
}

async addQuestionsToAccount(accountId, questionIds, subjectId) {
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
          throw new Error('Account not found');
      }

      if (!account.listsub) {
          account.listsub = [];
      }

      let subject = account.listsub.find(sub => sub.id === subjectId);
      if (!subject) {
          throw new Error(`Subject with ID ${subjectId} not found`);
      }

      if (!subject.listquestions) {
          subject.listquestions = [];
      }

      subject.listquestions = [...new Set([...subject.listquestions, ...questionIds])];

      const filter = {
          "Accounts.id": accountId,
          "Accounts.listsub.id": subjectId
      };

      const update = {
          $set: {
              "Accounts.$[acc].listsub.$[sub].listquestions": subject.listquestions
          }
      };

      const options = {
          arrayFilters: [
              { "acc.id": accountId },
              { "sub.id": subjectId }
          ],
          returnOriginal: false
      };

      console.log('Filter:', JSON.stringify(filter));
      console.log('Update:', JSON.stringify(update));
      console.log('Options:', JSON.stringify(options));

      const updatedDocument = await this.collection.findOneAndUpdate(filter, update, options);
      if (!updatedDocument || !updatedDocument.value) {
          throw new Error('Failed to update document');
      }
  } catch (error) {
      console.error('Error adding questions to account:', error);
      throw error;
  }
}
async addSubjectToAccount(idAccount, idSubject) {
  try {
      const document = await this.getDocument();
      if (!document) {
          throw new Error('Document not found');
      }
      if (!document.Accounts) {
          throw new Error('Accounts field not found in the document');
      }

      const account = document.Accounts.find(acc => acc.id === idAccount);
      if (!account) {
          throw new Error('Account not found');
      }

      const existingSubject = account.listsub.find(sub => sub.id === idSubject);
      if (existingSubject) {
          throw new Error('Subject already exists for this account');
      }

      const newSubject = {
          id: idSubject,
          status: 1,
          listquestions: []
      };

      account.listsub.push(newSubject);

      const updateResult = await this.collection.updateOne(
          { _id: document._id },
          { $set: { 'Accounts': document.Accounts } }
      );

      if (updateResult.modifiedCount === 0) {
          throw new Error('Failed to update document');
      }

      return updateResult;
  } catch (error) {
      console.error('Error adding subject to account:', error);
      throw error;
  }
}

async addExam(idAccount, exam) {
  try {
      const document = await this.getDocument();
      if (!document || !document.Accounts) {
          throw new Error('Accounts not found in document');
      }

      const account = document.Accounts.find(acc => acc.id === idAccount);
      if (!account) {
          throw new Error('Account not found');
      }
      if (!account.listexams) {
          account.listexams = [];
      }
      account.listexams.push(exam);

      const result = await this.collection.updateOne({}, { $set: { "Accounts": document.Accounts } });
      if (result.modifiedCount === 0) {
          throw new Error('Failed to update document');
      }
  } catch (error) {
      console.error('Error adding exam:', error);
      throw error;
  }
}
async updateQuestion(courseId, questionId, status) {
  try {
    const document = await this.getDocument();
    if (!document) {
      throw new Error('Document not found');
    }
    if (!document.Subjects || !document.Subjects.main) {
      throw new Error('Exams or main field not found in the document');
    }

    const courseIndex = document.Subjects.main.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    const questionIndex = document.Subjects.main[courseIndex].questions.findIndex(q => q.id === questionId);
    if (questionIndex === -1) {
      throw new Error(`Question with ID ${questionId} not found in course ${courseId}`);
    }

    document.Subjects.main[courseIndex].questions[questionIndex].status = status;

    const updateResult = await this.collection.updateOne(
      { _id: document._id },
      { $set: { 'Subjects.main': document.Subjects.main } }
    );
    return updateResult;
  } catch (error) {
    console.error('Error removing question:', error);
    throw error;
  }
}
async removeQuestionPermanently(courseId, questionId) {
  try {
    const document = await this.getDocument();
    if (!document) {
      throw new Error('Document not found');
    }
    if (!document.Subjects || !document.Subjects.main) {
      throw new Error('Exams or main field not found in the document');
    }

    const courseIndex = document.Subjects.main.findIndex(course => course.id === courseId);
    if (courseIndex === -1) {
      throw new Error(`Course with ID ${courseId} not found`);
    }

    const updateResult = await this.collection.updateOne(
      { _id: document._id, 'Subjects.main.id': courseId },
      { $pull: { 'Subjects.main.$.questions': { id: questionId } } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error(`Failed to remove question with ID ${questionId} from course ${courseId}`);
    }

    return updateResult;
  } catch (error) {
    console.error('Error removing question:', error);
    throw error;
  }
}
async removeSubjectFromAccount(idAccount, idSubject) {
  try {
    const document = await this.getDocument();
    if (!document) {
      throw new Error('Document not found');
    }
    if (!document.Accounts) {
      throw new Error('Accounts field not found in the document');
    }

    const accountIndex = document.Accounts.findIndex(acc => acc.id === idAccount);
    if (accountIndex === -1) {
      throw new Error('Account not found');
    }

    const subjectIndex = document.Accounts[accountIndex].listsub.findIndex(sub => sub.id === idSubject);
    if (subjectIndex === -1) {
      throw new Error('Subject not found in the account');
    }

    document.Accounts[accountIndex].listsub.splice(subjectIndex, 1);

    const updateResult = await this.collection.updateOne(
      { _id: document._id },
      { $set: { 'Accounts': document.Accounts } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update document');
    }

    return updateResult;
  } catch (error) {
    console.error('Error removing subject from account:', error);
    throw error;
  }
}
async updateStatusSubjectFromAccount(idAccount, idSubject, newStatus) {
  try {
    const document = await this.getDocument();
    if (!document) {
      throw new Error('Document not found');
    }
    if (!document.Accounts) {
      throw new Error('Accounts field not found in the document');
    }

    const accountIndex = document.Accounts.findIndex(acc => acc.id === idAccount);
    if (accountIndex === -1) {
      throw new Error('Account not found');
    }

    const subjectIndex = document.Accounts[accountIndex].listsub.findIndex(sub => sub.id === idSubject);
    if (subjectIndex === -1) {
      throw new Error('Subject not found in the account');
    }

    document.Accounts[accountIndex].listsub[subjectIndex].status = newStatus;

    const updateResult = await this.collection.updateOne(
      { _id: document._id },
      { $set: { 'Accounts': document.Accounts } }
    );

    if (updateResult.modifiedCount === 0) {
      throw new Error('Failed to update document');
    }

    return updateResult;
  } catch (error) {
    console.error('Error removing subject from account:', error);
    throw error;
  }
}
async updateStatusExam(idAccount, idExam, status) {
  try {
      const document = await this.getDocument();
      if (!document) {
          throw new Error('Document not found');
      }
      if (!document.Accounts) {
          throw new Error('Accounts field not found in the document');
      }

      const account = document.Accounts.find(acc => acc.id === idAccount);
      if (!account) {
          throw new Error('Account not found');
      }

      const exam = account.listexams.find(ex => ex.contentState.info.id === idExam);
      if (!exam) {
          throw new Error('Exam not found');
      }
      exam.contentState.info.status = status;
      const updateResult = await this.collection.updateOne(
          { _id: document._id, 'Accounts.id': idAccount, 'Accounts.listexams.contentState.info.id': idExam },
          { $set: { 'Accounts.$[account].listexams.$[exam].contentState.info.status': status } },
          { arrayFilters: [{ 'account.id': idAccount }, { 'exam.contentState.info.id': idExam }] }
      );

      if (updateResult.modifiedCount === 0) {
          throw new Error('Failed to update document');
      }

      return updateResult;
  } catch (error) {
      console.error('Error updating exam status:', error);
      throw error;
  }
}
async deleteExam(idAccount, idExam) {
  try {
      const document = await this.getDocument();
      if (!document) {
          throw new Error('Document not found');
      }
      if (!document.Accounts) {
          throw new Error('Accounts field not found in the document');
      }

      const account = document.Accounts.find(acc => acc.id === idAccount);
      if (!account) {
          throw new Error('Account not found');
      }

      const examIndex = account.listexams.findIndex(ex => ex.contentState.info.id === idExam);
      if (examIndex === -1) {
          throw new Error('Exam not found');
      }
      account.listexams.splice(examIndex, 1);

      const updateResult = await this.collection.updateOne(
          { _id: document._id, 'Accounts.id': idAccount },
          { $set: { 'Accounts.$.listexams': account.listexams } }
      );

      if (updateResult.modifiedCount === 0) {
          throw new Error('Failed to update document');
      }

      return updateResult;
  } catch (error) {
      console.error('Error deleting exam:', error);
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
