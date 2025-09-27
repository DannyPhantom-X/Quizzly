const express = require('express')
const quizzesRouter = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
quizzesRouter.get('/ctd-info', verifyToken, async (req, res) => {
    const takenQuiz = []
        for(const tq of req.user.takenQuiz) {
            const quizCollection = await quizzesuriconnect.model(tq, quizSchema)
            let quiz = await quizCollection.find({})
            quiz = quiz[0];
            takenQuiz.push({
                subject: quiz.quizInfo.subject,
                noQues: quiz.quizInfo.noQues,
                duration: quiz.quizInfo.duration,
                quizId: tq,
                authorName: quiz.authorName
            })
        }
    res.json({
        answer: takenQuiz
    })
})
quizzesRouter.get('/tkn-info', verifyToken,async (req, res) => {
    const createdQuiz = []
        for(const cq of req.user.createdQuiz) {
            const quizCollection = await quizzesuriconnect.model(cq, quizSchema)
            let quiz = await quizCollection.find({})
            quiz = quiz[0];
            createdQuiz.push({
                subject: quiz.quizInfo.subject,
                noQues: quiz.quizInfo.noQues,
                quizId: cq,
                attemptedBy: quiz.attemptedBy.length
            })
        }
    res.json({
        answer: createdQuiz
    })
})
quizzesRouter.get('/', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/quizzes.html'))
})
module.exports = quizzesRouter