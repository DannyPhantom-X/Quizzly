const express = require('express');
const createQuizRouter = express.Router()
const jwt = require('jsonwebtoken')
const path = require('path')
const mongoose = require('mongoose')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
const { v4: uuidv4}  = require('uuid')
createQuizRouter.get('/', verifyToken,async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        res.sendFile(path.join(__dirname, '../frontend/createquiz.html'))
    }else{
        res.redirect('/signup/otp')
    }
})
createQuizRouter.get('/ques&ans', verifyToken,async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/createquiz-ques-ans.html'))
})
createQuizRouter.post('/', verifyToken, async (req, res) => {
    const qid = await uuidv4();
    const quizId = `${qid}-${req.body.quizInfo.subject.toLowerCase()}`
    const quizCollection = await quizzesuriconnect.model(`${req.user._id}`, quizSchema)
    await quizCollection.create({
        quizId: quizId,
        quizInfo: req.body.quizInfo,
        candInfo: req.body.candInfo,
        authorName: `${req.user.surname} ${req.user.firstname}`,
        authorId: req.user._id,
        questions: req.body.questions,
        attemptedBy: [],
    })
    await ctdCollection.create( { quizId: quizId } )
    await usersCollection.findOneAndUpdate({ _id: req.user._id}, { $push: {createdQuiz: quizId}})
    res.json({
        statuz: 'success',
        message: quizId
    })
})

module.exports = createQuizRouter