const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const HandleDataMongoDB = require('./handleDataMongoDB');

const app = express();
const port = 4000;

app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());
app.use(express.json());

app.use(async (req, res, next) => {
    try {
        req.handleData = new HandleDataMongoDB();
        await req.handleData.init();
        next();
    } catch (error) {
        next(error);
    }
});

app.get('/api/header', async (req, res, next) => {
    try {
        const header = await req.handleData.getHeader();
        res.json(header);
    } catch (error) {
        next(error);
    }
});

app.get('/api/mainExams', async (req, res, next) => {
    try {
        const mainExams = await req.handleData.getMainExams();
        res.json(mainExams);
    } catch (error) {
        next(error);
    }
});

app.get('/api/basicExams', async (req, res, next) => {
    try {
        const basicExams = await req.handleData.getBasicExams();
        if (!basicExams || basicExams.length === 0) {
            throw new Error('No basic exams found');
        }
        res.json(basicExams);
    } catch (error) {
        next(error);
    }
});

app.get('/api/accounts', async (req, res, next) => {
    try {
        const accounts = await req.handleData.getListAccount();
        if (!accounts || accounts.length === 0) {
            throw new Error('No accounts found');
        }
        res.json(accounts);
    } catch (error) {
        next(error);
    }
});

app.get('/api/accounts/:id', async (req, res, next) => {
    try {
        const accountId = req.params.id;
        const account = await req.handleData.getAccountById(accountId);
        if (!account) {
            throw new Error(`Account with id ${accountId} not found`);
        }
        res.json(account);
    } catch (error) {
        next(error);
    }
});

app.put('/api/:id/edit_exams/:id_exam/contentState', async (req, res, next) => {
    try {
        const id = req.params.id;
        const examId = req.params.id_exam;
        const newBlocks = req.body.blocks;
        await req.handleData.updateContentStateById(id, examId, newBlocks);
        res.json({ message: 'Content state updated successfully' });
    } catch (error) {
        next(error);
    }
});
app.get('/api/additionalQuestions', async (req, res, next) => {
    try {
        const additionalQuestions = await req.handleData.getAddQuestion();
        res.json(additionalQuestions);
    } catch (error) {
        next(error);
    }
});
app.post('/api/:subjectId/addQuestion', async (req, res, next) => {
    try {
        const subjectId = req.params.subjectId;
        const newQuestion = req.body;
        await req.handleData.addQuestion(subjectId, newQuestion);
        res.json({ message: 'Question added successfully' });
    } catch (error) {
        next(error);
    }
});
app.post('/api/:id/:subjectId/addQuestionAccount', async (req, res) => {
    try {
        const accountId = req.params.id;
        const subjectId = req.params.subjectId;
        const questionId = req.body.questionId;

        await req.handleData.addQuestionAccount(accountId, questionId, subjectId);
        res.json({ message: 'Question added successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }

});
app.delete('/api/:id/:subjectId/removeQuestionAccount', async (req, res) => {
    try {
        const accountId = req.params.id;
        const subjectId = req.params.subjectId;
        const questionId = req.body.questionId;

        await req.handleData.removeQuestionFromAccount(accountId, questionId, subjectId);
        res.json({ message: 'Question removed successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/:id/addSubjectToAccount', async (req, res) => {
    try {
        const idAccount = req.params.id;
        const { idSub } = req.body;

        await req.handleData.addSubjectToAccount(idAccount, idSub);
        res.json({ message: 'Subject added successfully to account' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/:id/:subjectId/addQuestionsToAccount', async (req, res) => {
    try {
        const accountId = req.params.id;
        const subjectId = req.params.subjectId;
        const questionIds = req.body.questionIds;

        if (!Array.isArray(questionIds) || questionIds.length === 0) {
            return res.status(400).json({ error: 'Invalid question IDs' });
        }

        await req.handleData.addQuestionsToAccount(accountId, questionIds, subjectId);
        res.json({ message: 'Questions added successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/accounts/:id/addExam', async (req, res) => {
    try {
        const accountId = req.params.id;
        const newExam = req.body;

        await req.handleData.addExam(accountId, newExam);
        res.json({ message: 'Exam added successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.patch('/api/courses/:idSubject/questions', async (req, res) => {
    try {
        const { idSubject } = req.params;
        const { idQuestion, status } = req.body;

        await req.handleData.updateQuestion(idSubject, idQuestion, status);
        res.json({ message: 'Question status updated successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/courses/:idSubject/deleteQuestions', async (req, res) => {
    try {
        const { idSubject } = req.params;
        const { idQuestion } = req.body;

        await req.handleData.removeQuestionPermanently(idSubject, idQuestion);
        res.json({ message: 'Question permanently removed successfully' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/:id/removeSubjectFromAccount', async (req, res) => {
    try {
        const idAccount = req.params.id;
        const idSubject = req.body.subjectId;

        await req.handleData.removeSubjectFromAccount(idAccount, idSubject);
        res.json({ message: 'Subject removed successfully from account' });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.patch('/api/:id/updateStatusExam', async (req, res) => {
    try {
        const idAccount = req.params.id;
        const { idExam, status } = req.body;

        const updateResult = await req.handleData.updateStatusExam(idAccount, idExam, status);
        res.json({ message: 'Exam status updated successfully', updateResult });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.delete('/api/:id/deleteExam', async (req, res) => {
    try {
        const idAccount = req.params.id;
        const { idExam } = req.body;

        const deleteResult = await req.handleData.deleteExam(idAccount, idExam);
        res.json({ message: 'Exam deleted successfully', deleteResult });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.patch('/api/:id/updateSubjectStatus', async (req, res) => {
    try {
        const idAccount = req.params.id;
        const { idSubject, newStatus } = req.body;

        const updateResult = await req.handleData.updateStatusSubjectFromAccount(idAccount, idSubject, newStatus);
        res.json({ message: 'Subject status updated successfully', updateResult });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/api/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const token = await req.handleData.checkLogin(username, password);
        res.json({ token });
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.get('/api/getuserinfo', async (req, res) => {
    try {
        const token = req.headers['token'];
        const user = await req.handleData.getUserInfo(token);
        if (!user) {
            throw new Error(`User not found`);
        }
        res.json(user);
    } catch (error) {
        console.error('Error in API handler:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
});
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
