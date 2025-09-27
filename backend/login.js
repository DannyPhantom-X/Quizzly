const express = require('express')
const loginRouter= express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken} = require('./general')
require('dotenv').config()
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
loginRouter.get('/', authVerifyToken,async (req, res) => { 
    res.sendFile(path.join(__dirname, '../frontend/login.html'))
})

loginRouter.post('/', authVerifyToken, async (req, res) => {
    console.log('brroo')
    const { email, password} = req.body
    console.log(req.body)
    if(email === '' || email.indexOf('@') < 1 || email.lastIndexOf('.') < email.indexOf('@') ) {
        res.json({
            statuz: 'failed',
            reason: 'email',
            message: 'Provide a valid Email'
        })
        return;
    }
    const recordUser = await usersCollection.findOne( {email: email} )
    console.log(recordUser)
    if(recordUser === null) {
        res.json({
            statuz: 'failed',
            reason: 'wrong email',
            message: 'Incorrect Email'
        })
        console.log('wrong email')
        return;
    }else{
        if (!recordUser.verified) {
            res.json({
                statuz: 'failed',
                reason: 'unverified',
                message: 'This account has not been verified'
            })
            return;
        }
        if (recordUser.loggedToken !== 'none') {
            const min = 30 * 60 * 1000;
            const diff = Date.now() - recordUser.lastActive.getTime();
            if (diff < min) {
                res.json({
                    statuz: 'failed',
                    reason: 'loggedIn',
                    message: 'User is already logged In'
                })
                return;
            }
        }
        const isValid = await bcrypt.compare(password, recordUser.password)
        if(isValid) {
            const token = await jwt.sign({
                    uid: recordUser._id,
                    surname: recordUser.surname,
                    firstname: recordUser.firstname,
                    email: recordUser.email
            }, process.env.SECRET, {expiresIn: '12h'});
            await usersCollection.findOneAndUpdate({_id: recordUser._id}, {lastActive: new Date()})
            await usersCollection.findOneAndUpdate({_id: recordUser._id}, {loggedToken: token})
            res.cookie('token', token, {
                httpOnly: true,
                secure: false,
                maxAge: 12*1000*60*60
            })
            res.json({
                statuz: 'success',
                redirect: '/',
                names: {
                    surname: recordUser.surname,
                    firstname: recordUser.firstname
                }
            })
            return;
        }else{
            res.json({
                statuz: 'failed',
                reason: 'incorrect password',
                message: 'Password is incorrect'
            })
            console.log('incorrect password')
        }
    }
})

module.exports = loginRouter;