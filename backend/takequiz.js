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
takeQuizRouter.get('/:quizId/proceed', async (req, res) => {
    req.session.seenProceed = true;
    res.json({redirectTo: `/takequiz/${req.params.quizId}?term=details`})
})
takeQuizRouter.get('/:quizId/details/proceed', async (req, res) => {
    req.session.seenDetails = true;
    res.json({redirectTo: `/takequiz/${req.params.quizId}?term=start`})
})
takeQuizRouter.get('/:quizId/details/api', verifyToken, async (req, res) => {
    const quizId = req.params.quizId;
    const ctdQuiz = await ctdCollection.findOne({quizId: quizId});
    const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId});
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
        if (req.query.term == 'details' && req.session.seenProceed) {
            console.log('details')
            // req.session.seenDetails ? res.redirect(`/takequiz/${quizId}?term=start`) : null;
            res.sendFile(path.join(__dirname, '../frontend/takequiz-cand.html'));
        }else if (req.query.term == 'start' && req.session.seenDetails) {
            console.log('start')
            res.sendFile(path.join(__dirname, '../frontend/takequiz-ques.html'));
        }else {
            console.log('heree')
            // req.session.seenDetails ? res.redirect(`/takequiz/${quizId}?term=start`) : null;
            // req.session.seenProceed ? res.redirect(`/takequiz/${quizId}?term=details`) : null;
            res.sendFile(path.join(__dirname, '../frontend/takequiz-about.html'));
        }
    }else{
        res.redirect('/')
    }
})

takeQuizRouter.get('/:quizId/ques/api', verifyToken, async(req, res) => {
    const quizId = req.params.quizId;
    const ctdQuiz = await ctdCollection.findOne({quizId: quizId});
    const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId});
    let questions = []
    if (quiz.quizInfo.randQues) {
        const randomQues = randomize(quiz.questions)
        randomQues.forEach((ques)=> {
            questions.push({question: ques.question, answer: ''})
        })
    }else{
        quiz.questions.forEach((ques) => {
            questions.push({question: ques.question, answer: ''})
        })
    }
    res.json({
        questions: questions,
        optionsStats: quiz.quizInfo.options,
        noQues: quiz.quizInfo.noQues
    })
})

function randomize(param) {
    const copy = [...param]
    const newList = []
    copy.forEach((item, i) => {
        const j = Math.floor(Math.random() * param.length)
        newList.push(param.splice(j, 1)[0])
    })
    return newList;
}



module.exports = takeQuizRouter