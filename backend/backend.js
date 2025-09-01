const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { v4: uuidv4}  = require('uuid')
const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')
const shortUuid = require('short-uuid')
const cookieParser = require('cookie-parser')
const path = require('path')
require('dotenv').config()
const quizzlyuri = process.env.QUIZZLYURI
const quizzesuri = process.env.QUIZZESURI
console.log(quizzlyuri)
const quizzlyuriconnect = mongoose.createConnection(quizzlyuri)
const quizzesuriconnect = mongoose.createConnection(quizzesuri)
const app = express()
app.use(cookieParser())
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true}))
console.log(__dirname)
app.use('/public/', express.static(path.join(__dirname, '../frontend/public')))
const usersSchema = new mongoose.Schema({
    _id: {
            type: String,
            default: () => uuidv4()

        },
    surname: String,
    firstname: String,
    password: String,
    email: String,
    verified: Boolean
})
const otpSchema = new mongoose.Schema({
    _id: String,
    email: String,
    otp: String,
    expiresin: Number
})
const quizInfoSchema = new mongoose.Schema({
    subject: String,
    noQues: String,
    duration: String,
    randQues: Boolean,
    options: Boolean,
    noOptions: Number,
    randOptions: Boolean,
    instructions: String,
    author: String,
    createdAt: { type: Date, default: Date.now }
})
const candInfoSchema = new mongoose.Schema({
    cand: [String],
    author: String,
    createdAt: { type: Date, default: Date.now }
})
const usersCollection = quizzlyuriconnect.model('users', usersSchema)
const otpCollection = quizzlyuriconnect.model('otp', otpSchema)

// usersCollection.create({
//     surname: 'Par',
//     firstname: 'String',
//     password: 'pas',
//     email: 'deviel.com',
//     verified: false
// })

const transport = nodemailer.createTransport({
    // host: 'smtp.gmail.com',
    // port: 587,
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
app.get('/', async (req, res) => {
    const token = req.cookies.token
    console.log(token)
    res.sendFile(path.join(__dirname, '../frontend/home.html'))
})
app.get('/signup', (req, res) => {
    if(req.user === 'tokenissue' || req.user === undefined || req.user === null) {
        res.sendFile(path.join(__dirname, '../frontend/signup.html'))
        }else{
            if(req.user.verified) {
                res.redirect('/')
            }
    }
})
app.get('/login', verifyToken,async (req, res) => {
    if(req.user === 'tokenissue' || req.user === undefined || req.user === null) {
        res.sendFile(path.join(__dirname, '../frontend/login.html'))
        }else{
            if(req.user.verified) {
                res.redirect('/')
            }else{
                res.redirect('/signup/otp')
            }
    }
})
app.get('/createquiz', verifyToken,async (req, res) => {
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
app.get('/createquiz/ques&ans', verifyToken,async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    const recordUser = await usersCollection.findOne({_id: req.user.id})
    if(recordUser.verified) {
        res.sendFile(path.join(__dirname, '../frontend/createquiz-ques-ans.html'))
    }else{
        res.redirect('/signup/otp')
    }
    
})
app.get('/signup/otp', verifyToken,async (req, res) => {
    if(req.user === 'tokenissue' || req.user === null || req.user === undefined){
        res.redirect('/')
    }
    else{
        if(!req.user.verified){
            res.sendFile(path.join(__dirname, '../frontend/otp.html'))
            return;            
        }else{
            res.redirect('/')
        }    
    }
})
app.get('/takequiz', verifyToken, async (req, res) => {
    if(req.user === 'tokenissue' || req.user === null || req.user === undefined){
        res.redirect('/')
    }
    else{
        if(req.user.verified){
            res.sendFile(path.join(__dirname, '../frontend/takequiz.html'))
            return;            
        }else{
            res.redirect('/')
        }    
    }
})
app.get('/api/currentuser', verifyToken, async (req, res) => {
    console.log('reached')
    if(req.user === 'tokenissue' || req.user === null || req.user === undefined){
        res.json({
            statuz: 'failed',
            message: 'NO CURRENT USER ❌'            
        })
    }
    else{
        res.json({
            statuz: 'success',
            firstname: req.user.firstname,
            surname: req.user.surname
        })  
    }
})
app.post('/signup', async (req, res) => {
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
        console.log('already failed')
        return;
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    console.log(hashedpassword)
    const newuser = await usersCollection.create({
        surname: surname,
        firstname: firstname,
        email: email,
        password: hashedpassword,
        verified: false,
    });
    console.log(newuser)
    const token = await jwt.sign({
        uid: newuser._id,
        surname: newuser.surname,
        firstname: newuser.firstname,
        email: newuser.email
    }, process.env.SECRET, {expiresIn: '12h'});
    console.log(token);
    await sendOTP(newuser._id, newuser.email);
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

app.post('/signup/otp/verification', verifyToken,async (req, res) => {
    if (req.user === 'tokenissues' && req.user === undefined && req.user === null) {
        if(!req.user.verified) {
            res.redirect('/')
            return;
        }
    }
    const recorduserotp = await otpCollection.findOne({ _id: req.user.id })
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
        res.json({
            statuz: 'success',
            redirect: '/',
            names: {
                surname: req.user.surname,
                firstname: req.user.firstname
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

app.post('/signup/otp/resend', verifyToken,async(req, res) => {
    if (req.user === 'tokenissues' || req.user === null || req.user === undefined) { 
        res.redirect('/')
        return;
    }
    const usersexists = await usersCollection.findOne({_id: req.user._id})
    console.log(usersexists)
    if(usersexists !== null) {
        if (usersexists.verified) { 
            res.redirect('/')
            return;
            }
    }
    await sendOTP(req.user._id, req.user.email)
    res.send('Done')
})

app.delete('/delete', async (req, res) => {
    const emailDelete = req.body.email;
    const userResult = await usersCollection.findOneAndDelete({ email: emailDelete});
    const otpResult = await otpCollection.findOneAndDelete({ email: emailDelete});
    res.json({
        otp: otpResult,
        user: userResult
    })
    console.log('Deleted')
})

app.post('/login', async (req, res) => {
    const { email, password} = req.body
    if(email === '' || email.indexOf('@') < 1 || email.lastIndexOf('.') < email.indexOf('@') ) {
        res.json({
            statuz: 'failed',
            reason: 'email',
            message: 'Provide a valid Email'
        })
        return;
    }
    const recordUser = await usersCollection.findOne( {email: email} )
    if(recordUser === null) {
        res.json({
            statuz: 'failed',
            reason: 'wrong email',
            message: 'Wrong Email'
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
            console.log('unverified')
            return;
        }
        const isValid = await bcrypt.compare(password, recordUser.password)
        console.log(isValid)
        if(isValid) {
            const token = await jwt.sign({
                    uid: recordUser._id,
                    surname: recordUser.surname,
                    firstname: recordUser.firstname,
                    email: recordUser.email
                }, process.env.SECRET, {expiresIn: '12h'})
                console.log(token)
                console.log('logged in')
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

app.post('/createquiz/quizinfo', async () => {

})
app.post('/createquiz/candinfo', verifyToken,async () => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/');
        return;
    }
    if(req.user.verified) {
        
    }else{
        res.redirect('/signup/otp');
    }
})
app.post('/createquiz/ques&ans', async () => {})
async function sendOTP(id, email) {
    console.log(id)
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    let mailOptions = {
        from: 'quizzly@gmail.com',
        to: email,
        subject: 'Quizzly OTP Verification',
        html: `<b><p style="font-size: 1.5rem; color: #0f172a;">Hi,</p>
                <p style="font-size: 1.5rem; color: #0f172a;">Please use the OTP code below to complete the signup process</p>
                <p style="font-size: 1.5rem; color: #BD53ED">${otp}</p> 
                <p>This OTP will expire in 5 minutes</b>`
    };
    console.log('Mail Time')
    await transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    }) 
    const expires = Date.now() + (5 * 60 * 1000);
    const exists = await otpCollection.findOne({ _id: id})
    const hashotp = await bcrypt.hash(otp, 10)
    if (exists !== null) {
        await otpCollection.findOneAndUpdate( {_id: id}, {otp: hashotp, expiresin: expires} )
    }else{ otpCollection.create({_id: id, email: email, otp: hashotp, expiresin: expires}) }        
}
async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try{
            const userPayload = await jwt.verify(token, process.env.SECRET)
            const recordUser  = await usersCollection.findOne({_id: userPayload.uid})
            req.user = recordUser;
            next()
        }catch (err){
            req.user = 'tokenissue'
            next()
        } 
    }else{
        req.user = 'tokenissue'
        next()
    }
    
}
async function connect() {
    await quizzlyuriconnect;
    await quizzesuriconnect;
    console.log('connected to db');
    app.listen(7050, 'localhost',() => {console.log('pipe conccefte')});
}

connect()
