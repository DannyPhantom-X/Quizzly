const express = require('express')
const takeQuizRouter = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema, tknQuizSchema} = require('./models')
takeQuizRouter.get('/', verifyToken, async (req, res) => {
    // const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId})
    // for (const attemptee of quiz.attemptedBy) {
    //     if(attemptee === req.user._id) {
    //         res.redirect('/')
    //     }
    // }
    res.sendFile(path.join(__dirname, '../frontend/takequiz.html'))
})

takeQuizRouter.post('/', verifyToken, async (req, res) => {
    const isExist = await ctdCollection.findOne({ quizId: req.body.quizId})
    if (isExist) {
        const quiz = await quizzesuriconnect.model(isExist.authorId, quizSchema).findOne({quizId: req.body.quizId})
        for (const attemptee of quiz.attemptedBy) {
            if(attemptee === req.user._id) {
                res.json({
                    statuz: 'failed'
                })
                return;
            }
        }
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
takeQuizRouter.post('/:quizId/details/proceed', verifyToken,async (req, res) => {
    const quizId = req.params.quizId
    req.session.seenDetails = true;
    const candDetails = req.body
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
    const author = await usersCollection.findById(ctdQuiz.authorId)
    res.json({
        subject: quiz.quizInfo.subject,
        noQues: quiz.quizInfo.noQues,
        duration: quiz.quizInfo.interval,
        author: `${author.surname} ${author.firstname}`
    })
})

takeQuizRouter.get('/:quizId', verifyToken,async (req, res) => {
    const quizId = req.params.quizId
    const isValid = await ctdCollection.findOne({quizId})
    if (isValid) {
        if (req.query.term == 'details' && req.session.seenProceed) {
            // req.session.seenDetails ? res.redirect(`/takequiz/${quizId}?term=start`) : null;
            res.sendFile(path.join(__dirname, '../frontend/takequiz-cand.html'));
        }else if (req.query.term == 'start' && req.session.seenDetails) {
            res.sendFile(path.join(__dirname, '../frontend/takequiz-ques.html'));
        }else {
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
    if (quiz.quizInfo.options) {
        if (quiz.quizInfo.randQues) {
            const randomQues = randomize(quiz.questions)
            randomQues.forEach((ques)=> {
                if (quiz.quizInfo.randOptions ) {
                    const randomOptions =  randomize(ques.option)
                    questions.push({question: ques.question, options: randomOptions ,answer: ''})    
                }else{
                    questions.push({question: ques.question, options: ques.option, answer: ''})
                }
            })

        }else{
            quiz.questions.forEach((ques) => {
                questions.push({question: ques.question, options: ques.option, answer: ''})
            })
        }
    }else{
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
    }
    res.json({
        questions: questions,
        optionsStats: quiz.quizInfo.options,
        noQues: quiz.quizInfo.noQues
    })
})
takeQuizRouter.post('/:quizId/ques/submit', verifyToken, async(req, res) => {
    let score = 0
    const candDetails = req.body.candDetails
    const quesandans = req.body.quesandans
    const quizId = req.params.quizId
    const ctdQuiz = await ctdCollection.findOne({quizId: quizId})
    const quiz = await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOne({quizId: quizId})
    for (const detail of candDetails) {
        if (quiz.candInfo.indexOf(detail.label) < 0) {
            return res.json({statuz: 'failed'})
        }
    }
    quiz.questions.forEach((qanda) => {
        quesandans.forEach((uq) => {
            if(qanda.question === uq.question) {
                qanda.answer === uq.answer ? score ++ : null;
            }
        })
    })
    let percentage = ((score/Number(quiz.quizInfo.noQues)) * 100).toFixed(2)
    // const tkn = await quizzesuriconnect.model(`${req.user._id}-tkn`, tknQuizSchema)
    // await tkn.create({quizId: quizId, candInfo: candDetails, score: score ,authorId: ctdQuiz.authorId})
    // await usersCollection.findByIdAndUpdate(req.user._id, { $push: {takenQuiz: quizId}})
    // await quizzesuriconnect.model(ctdQuiz.authorId, quizSchema).findOneAndUpdate({quizId: quizId}, { $push {attemptedBy: req.user._id}})
    res.json({
        subject: quiz.quizInfo.subject,
        noQues: quiz.quizInfo.noQues,
        percentage: percentage,
        score: score
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