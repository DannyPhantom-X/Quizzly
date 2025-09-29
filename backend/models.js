const mongoose  = require('mongoose')
require('dotenv').config()
// const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const quizzlyuri = process.env.QUIZZLYURI
const quizzesuri = process.env.QUIZZESURI
const quizzlyuriconnect = mongoose.createConnection(quizzlyuri)
const quizzesuriconnect = mongoose.createConnection(quizzesuri)
const { v4: uuidv4}  = require('uuid')
const usersSchema = new mongoose.Schema({
    _id: {
            type: String,
            default: () => uuidv4()
        },
    surname: String,
    firstname: String,
    password: String,
    email: String,
    profilePic: {
        type: {
            url: String,
            public_id: String,
        },default: null
    },
    createdQuiz: [String],
    takenQuiz: [String],
    createdAt: { type: Date, default: Date.now },
    lastActive: Date,
    loggedToken: String,
    verified: Boolean
})
const otpSchema = new mongoose.Schema({
    _id: String,
    email: String,
    otp: String,
    expiresin: Number
})
const ctdQuizSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: () => uuidv4()
    },
    quizId: String,
    authorId: String
})
const quizSchema = new mongoose.Schema({
    _id: {
            type: String,
            default: () => uuidv4()
        },
    quizId: String,
    quizInfo: Object,
    candInfo: [String],
    authorName: String,
    authorId: String,
    questions: [Object],
    attemptedBy: [String],
    createdAt: { type: Date, default: Date.now }
})
const usersCollection = quizzlyuriconnect.model('users', usersSchema)
const otpCollection = quizzlyuriconnect.model('otp', otpSchema)
const ctdCollection = quizzlyuriconnect.model('ctdquizzes', ctdQuizSchema);

module.exports = {usersCollection, otpCollection, ctdCollection, quizSchema}