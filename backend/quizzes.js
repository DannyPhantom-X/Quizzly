const express = require('express')
const quizzesRouter = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
quizzesRouter.get('/tkn-info', verifyToken, async (req, res) => {
    const takenQuiz = []
    for(const tq of req.user.takenQuiz) {
        const ctdQuiz = await ctdCollection.findOne({quizId: tq});
        const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: tq})
        takenQuiz.push({
            subject: quiz.quizInfo.subject,
            noQues: quiz.quizInfo.noQues,
            duration: quiz.quizInfo.interval,
            quizId: tq,
            authorName: quiz.authorName
        })
    }
    console.log(takenQuiz)
    res.json({
        answer: takenQuiz
    })
})
quizzesRouter.get('/ctd-info', verifyToken,async (req, res) => {
    const createdQuiz = []
    for(const cq of req.user.createdQuiz) {
        const quizCollection = await quizzesuriconnect.model(req.user._id, quizSchema)
        let quiz = await quizCollection.findOne({quizId: cq})
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