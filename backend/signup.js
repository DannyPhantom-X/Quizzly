const express = require('express')
const signupRouter = express.Router();
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const path = require('path')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
require('dotenv').config()
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
const transport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
signupRouter.get('/otp', verifyToken, async (req, res) => {
    await sendOTP(req.user._id, req.user.email);
    res.sendFile(path.join(__dirname, '../frontend/otp.html'))
})
signupRouter.get('/', authVerifyToken,(req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html'))
})
signupRouter.post('/', authVerifyToken ,async (req, res) => {
    const {surname, firstname, email, password, confirmPassword} = req.body
    console.log(req.body)
    if (surname === '') {
        res.json({
            statuz: 'failed',
            reason: 'surname',
            message: 'Provide a valid Surname' 
        })
        return;
    }
    if(firstname === '') {
        res.json({
            statuz: 'failed',
            reason: 'firstname',
            message: 'Provide a valid Firstname'
        })
    }
    if(email === '' || email.indexOf('@') < 1 || email.lastIndexOf('.') < email.indexOf('@') ) {
        res.json({
            statuz: 'failed',
            reason: 'email',
            message: 'Provide a valid Email'
        })
        return;
    }
    if (password.length < 8 ) {
        res.json({
            statuz: 'failed',
            reason: 'password',
            message: 'Password is less than 8 Characters'
        })
        return;
    }
    if(password !== confirmPassword) {
        res.json({
            statuz: 'failed',
            reason: 'confirmpassword',
            message: 'Password is incorrect'       
        })
        return;
    }
    const exists = await usersCollection.findOne({email: email})
    if (exists !== null) {
        res.json({
            statuz: 'failed',
            reason: 'email exists',
            message: 'Email already exists'
        })
        return;
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const newuser = await usersCollection.create({
        surname: surname,
        firstname: firstname,
        email: email,
        password: hashedpassword,
        createdQuiz: [],
        takenQuiz: [],
        verified: false,
        lastActive: new Date(),
        loggedToken: 'none'
    });
    const token = await jwt.sign({
        uid: newuser._id,
        surname: newuser.surname,
        firstname: newuser.firstname,
        email: newuser.email
    }, process.env.SECRET, {expiresIn: '12h'});
    await usersCollection.findOneAndUpdate({_id: newuser._id}, {loggedToken: token})
    await res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        maxAge: 12 * 1000 * 60 *60
    })
    res.json({
        statuz: 'success',
        redirect: 'signup/otp'
    })    
})

signupRouter.post('/otp/verification', verifyToken,async (req, res) => {
    console.log('method')
    const recorduserotp = await otpCollection.findOne({ _id: req.user._id })
    console.log(recorduserotp)
    const otpStats = await bcrypt.compare(req.body.otp, recorduserotp.otp)
    if (!otpStats) {
        res.json({
            statuz: 'failed',
            reason: 'invalid otp',
            message: 'Invalid OTP'
        })
        return;
    }
    if (Date.now() < recorduserotp.expiresin) {
        await usersCollection.findOneAndUpdate({ _id: req.user._id }, {verified: true})
        await otpCollection.findOneAndDelete({ _id: req.user._id })
        const profilePic =  req.user.profilePic ? req.user.profilePic.url : null;
        res.json({
            statuz: 'success',
            redirect: '/',
            names: {
                statuz: 'success',
                surname: req.user.surname,
                firstname: req.user.firstname,
                profilePic: profilePic
            }
        })
    }else{
        res.json({
            statuz: 'failed',
            reason: 'expired otp',
            message: 'OTP has expired'
        })
    }
})

async function sendOTP(id, email) {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    let mailOptions = {
        from: '"Quizzly" <no-reply@myapp.com>',
        to: email,
        subject: 'Quizzly OTP Verification',
        html: `<b><p style="font-size: 1.5rem; color: #0f172a;">Hi,</p>
                <p style="font-size: 1.5rem; color: #0f172a;">Please use the OTP code below to complete the signup process</p>
                <p style="font-size: 1.5rem; color: #BD53ED">${otp}</p> 
                <p>This OTP will expire in 5 minutes</b>`
    };
    await transport.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Email sent:", info.response);
    }
    }) 
    const expires = Date.now() + (5 * 60 * 1000);
    const exists = await otpCollection.findOne({ _id: `${id}-otp`})
    const hashotp = await bcrypt.hash(otp, 10)
    if (exists !== null) {
        await otpCollection.findOneAndUpdate( {_id: `${id}-otp`}, {otp: hashotp, reason: 'otp', expiresin: expires} )
    }else{ otpCollection.create({_id: `${id}-otp`, email: email, reason: 'otp', otp: hashotp, expiresin: expires}) }        
}

module.exports = signupRouter