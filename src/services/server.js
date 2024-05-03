const express = require('express');
const cors = require('cors');
const HandleDataMongoDB = require('./handleDataMongoDB');

const app = express();
const port = 4000;

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

app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
