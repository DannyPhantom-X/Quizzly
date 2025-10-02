const mongoose  = require('mongoose')
require('dotenv').config()
const quizzlyuri = process.env.QUIZZLYURI
const quizzesuri = process.env.QUIZZESURI
const quizzlyuriconnect = mongoose.createConnection(quizzlyuri)
const quizzesuriconnect = mongoose.createConnection(quizzesuri)
const jwt = require('jsonwebtoken')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
async function authVerifyToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try{
            const userPayload = await jwt.verify(token, process.env.SECRET)
            const recordUser  = await usersCollection.findOne({_id: userPayload.uid})
            if (token === recordUser.loggedToken) {
                await usersCollection.findOneAndUpdate({_id: userPayload.uid}, {lastActive: new Date()})
                req.user = recordUser;  
                res.redirect('/')
            }else{
                next()
            }
        }catch (err){
            next()
        }
    }else{
        next()
    }
}
async function verifyToken(req, res, next) {
    console.log('Done')
    const token = req.cookies.token
    if (token) {
        try{
            const userPayload = await jwt.verify(token, process.env.SECRET)
            const recordUser  = await usersCollection.findOne({_id: userPayload.uid})
            if (token === recordUser.loggedToken) {
                await usersCollection.findOneAndUpdate({_id: userPayload.uid}, {lastActive: new Date()})
                if (recordUser.verified) {
                    req.user = recordUser;
                    next()
                }else{
                    if (req.path === '/otp') {
                        req.user = recordUser;
                        next()
                    }else{
                        req.user = recordUser;
                        res.redirect('/signup/otp')
                    }
                }
            }else{
                res.redirect('/')
            }
        }catch (err){
            req.user = 'tokenissue';
        }
    }else{
        req.user = 'tokenissue';
        res.redirect('/')
    }
}
module.exports = {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect}