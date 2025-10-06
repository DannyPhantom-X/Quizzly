const express = require('express')
const updateRouter= express.Router()
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const streamifier = require('streamifier')
const storage = multer.memoryStorage();
const upload = multer({ storage });
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const transporter = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
require('dotenv').config()
const path = require('path')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})
updateRouter.post('/update/profilepic', verifyToken, upload.single('profilePic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }
        const result = await new Promise((resolve, reject) => {
            let stream = cloudinary.uploader.upload_stream(
            { folder: "quizzly_profiles", // optional folder
            transformation: [
                { width: 256, height: 256, crop: "fill", gravity: "face" }, 
                { quality: "auto", fetch_format: "auto" }
            ]},
            (error, result) => {
                if (result) resolve(result);
                else reject(error);
            }
            );
            streamifier.createReadStream(req.file.buffer).pipe(stream);
        });
        if(req.user.profilePic && req.user.profilePic.url) {
            await cloudinary.uploader.destroy(req.user.profilePic.public_id);
        }
        const user = await usersCollection.findByIdAndUpdate(req.user._id, {profilePic: {url: result.secure_url, public_id: result.public_id}})
        res.json({statuz: 'success'})
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload failed" });
        }
})
updateRouter.post('/update', verifyToken, async (req, res) => {
    if (req.body.newEmail) {
        if (req.body.verificationEmailCode) {
            const userEmailCode = await otpCollection.findById(`${req.user._id}-email`)
            console.log(req.body.verificationEmailCode)
            console.log(userEmailCode.otp)
            const isEmailCode = await bcrypt.compare(req.body.verificationEmailCode, userEmailCode.otp)
            const emailExists = await usersCollection.findOne({email: req.body.newEmail})
            const email = req.body.newEmail
            console.log(emailExists)
            console.log(!isEmailCode)
            if(!isEmailCode || emailExists === null || email === '' || email.indexOf('@') < 1 || email.lastIndexOf('.') < email.indexOf('@')) {
                console.log('failed')
                res.json({
                    statuz: 'failed',
                    message: 'Email Error'
                })
                return;
            }else{
                req.body.email = req.body.newEmail
            }
        }
    }if (req.body.newPassword) {
        if (req.body.verificationPasswordCode) {
            console.log(req.body)
            const userPasswordCode = await otpCollection.findById(`${req.user._id}-password`)
            const isPasswordCode = await bcrypt.compare(req.body.verificationPasswordCode, userPasswordCode.otp)
            const isPassword = await bcrypt.compare(req.body.oldPassword, req.user.password)
            if(!isPasswordCode || req.body.newPassword !== req.body.confirmPassword || !isPassword) {
                res.json({
                    statuz: 'failed',
                    message: 'Password Error' 
                })
                return;
            }else{
                const password = req.body.newPassword
                req.body.password = await bcrypt.hash(password, 10)
            }
        }
    }
    const newUser = await usersCollection.findByIdAndUpdate(req.user._id, req.body)
    res.json({statuz: 'success', user: newUser})
})
updateRouter.post('/update/verification', verifyToken, async (req, res) => {
    if ( req.body.reason && (req.body.reason === 'email' || 'password ') ) {
        try{
            await sendVerification(req.user._id, req.user.email, req.body.reason)
            res.json({
                statuz: 'success'
            })
        }catch (err) {
            console.log(err)
            res.json({
                statuz: 'failed'
            })
        }

    }else{
        res.json({
            statuz: 'failed'
        })
    }
})
updateRouter.get('/', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profile.html'))
})

module.exports = updateRouter

async function sendVerification(id, email, reason) {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    let mailOptions = {
        from: '"Quizzly" <no-reply@myapp.com>',
        to: email,
        subject: `Quizzly ${capitalize(reason)} Verification`,
        html: `<b><p style="font-size: 1.5rem; color: #0f172a;">Hi,</p>
                <p style="font-size: 1.5rem; color: #0f172a;">The verification code needed to change your ${reason} is: </p>
                <p style="font-size: 1.5rem; color: #BD53ED">${otp}</p> 
                <p>This verification code will expire in 5 minutes</b>`
    };
    await transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
        console.error("Error:", err);
    } else {
        console.log("Email sent:", info.response);
    }
    }) 
    const expires = Date.now() + (5 * 60 * 1000);
    const exists = await otpCollection.findOne({ _id: `${id}-${reason}`})
    const hashotp = await bcrypt.hash(otp, 10)
    if (exists !== null) {
        await otpCollection.findOneAndUpdate( {_id: `${id}-${reason}`}, {otp: hashotp, reason: reason, expiresin: expires} )
    }else{ otpCollection.create({_id: `${id}-${reason}`, email: email, otp: hashotp, reason: reason, expiresin: expires}) }        
}

function capitalize(word) {
    const capital = word.slice(0, 1).toUpperCase()
    const rest = word.slice(1, (word.length))
    return `${capital}${rest}`
}