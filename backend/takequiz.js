const express = require('express')
const takeQuizRouter = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
takeQuizRouter.get('/', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/takequiz.html'))
})

takeQuizRouter.post('/', verifyToken, async (req, res) => {
    const isExist = await ctdCollection.findOne({ quizId: req.body.quizId})
    if (isExist) {
        res.json({
            statuz: 'success'
        })
    }else{
        res.json({
            statuz: 'failed'
        })
    }
})

takeQuizRouter.get('/:quizId/cand-info', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/takequiz-cand.html'));
})
takeQuizRouter.get('/:quizId/cand-info/api', verifyToken, async (req, res) => {
    const quizId = req.params.quizId;
    const ctdQuiz = await ctdCollection.findOne({quizId: quizId});
    const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId});
    console.log(quiz)
    console.log('this is it: ' + quiz.quizInfo.instruction)
    res.json({
        instruction: quiz.quizInfo.instructions,
        candInfo: quiz.candInfo
    })
})
takeQuizRouter.get('/:quizId/api', verifyToken, async (req, res) => {
    const quizId = req.params.quizId;
    const ctdQuiz = await ctdCollection.findOne({quizId: quizId});
    const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId});
    res.json({
        subject: quiz.quizInfo.subject,
        noQues: quiz.quizInfo.noQues,
        duration: quiz.quizInfo.interval,
        author: `${req.user.surname} ${req.user.firstname}`
    })
})

takeQuizRouter.get('/:quizId', verifyToken,async (req, res) => {
    const quizId = req.params.quizId
    const isValid = await ctdCollection.findOne({quizId})
    if (isValid) {
        res.sendFile(path.join(__dirname, '../frontend/takequiz-about.html'))
    }else{
        res.redirect('/')
    }
})
module.exports = takeQuizRouter