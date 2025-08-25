const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { v4: uuidv4}  = require('uuid')
const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')
require('dotenv').config()
const quizzlyuri = process.env.QUIZZLYURI
quizzlyuriconnect = mongoose.createConnection(quizzlyuri)
const app = express()
app.use(cors())
app.use(express.json())
const usersSchema = new mongoose.Schema({
    _id: {
            type: String,
            default: uuidv4()
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
    expires: String
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
            stauz: 'failed',
            reason: 'confirmpassword',
            message: 'Password and Confim Password are not equal'       
        })
        return;
    }
    const hashedpassword = await bcrypt.hash(password, 10)
    const newuser = await usersCollection.create({
        surname: surname,
        firstname: firstname,
        email: email,
        password: hashedpassword,
        verified: false,
    });
    console.log(newuser)
    console.log(typeof newuser)
    const token = await jwt.sign({
        uid: newuser._id,
        surname: newuser.surname,
        firstname: newuser.firstname,
        email: newuser.email
    }, process.env.SECRET, {expiresIn: '1h'});
    console.log(token);
    setTimeout(() => {
        // sendOTP(newuser._id, newuser.email)
        res.json({statuz: 'Success',
            token: token })
    }, 2000)
    
    
})

app.post('/signnup/otp/verification', async (req, res) => {
    jwt.verify(req.body, process.env.SECRET, (err, user) => {
        if (!err){

        }
    })
})


async function sendOTP(id, email) {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    let mailOptions = {
        from: 'Quizzly',
        to: 'dtaiwo453@gmail.com',
        subject: 'Quizzly OTP Verification',
        html: `<b><p style="font-size: 1.5rem; color: #0f172a;">Hi,</p>
                <p style="font-size: 1.5rem; color: #0f172a;">Please use the OTP code below to complete your account setup</p>
                <p>${otp}</p> </b>`
    };
    transport.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error("Error:", err);
      } else {
        console.log("Email sent:", info.response);
      }
    })
    otpCollection.create({_id: id, email: email, otp: otp, expires: '1h'})
}
async function connect() {
    await quizzlyuriconnect;
    console.log('connected to db')
    app.listen(7050,() => {console.log('pipe conccefte')})
}

connect()