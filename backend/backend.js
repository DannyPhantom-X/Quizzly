const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const cors = require('cors')
const { v4: uuidv4}  = require('uuid')
const mongoose  = require('mongoose')
const jwt = require('jsonwebtoken')
const shortUuid = require('short-uuid')
const multer = require('multer')
const cookieParser = require('cookie-parser')
const streamifier = require('streamifier')
const path = require('path')
const cloudinary = require('cloudinary').v2
const { type } = require('os')
const { Verify } = require('crypto')
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
// app.use(express.urlencoded({ extended: true}))
const storage = multer.memoryStorage();
const upload = multer({ storage });
app.use('/public/', express.static(path.join(__dirname, '../frontend/public')))
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    quizId: String
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

const transport = nodemailer.createTransport({
    service: 'gmail',
    secure: false,
    auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.AUTH_PASS
    }
})
app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'))
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
    if(req.user.verified) {
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
            await sendOTP(req.user._id, req.user.email);
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
    if(req.user === 'tokenissue' || req.user === null || req.user === undefined){
        res.json({
            statuz: 'failed',
            message: 'NO CURRENT USER ❌'            
        })
    }
    else{
        if(req.user.verified) {
            const profilePic =  req.user.profilePic ? req.user.profilePic.url : null;
            res.json({
                statuz: 'success',
                firstname: req.user.firstname,
                surname: req.user.surname,
                email: req.user.email,
                profilePic: profilePic
            })  
        }
    }
})
app.get('/myprofile', verifyToken, async (req, res) => {
    if(req.user === 'tokenissue' || req.user === null || req.user === undefined){
        res.json({
            statuz: 'failed',
            message: 'NO CURRENT USER ❌'            
        })
    }
    else{
        if(req.user.verified) {
            res.sendFile(path.join(__dirname, '../frontend/profile.html'))
        }
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
        createdQuiz: [],
        takenQuiz: [],
        verified: false,
        lastActive: new Date(),
        loggedToken: 'none'
    });
    console.log(newuser)
    const token = await jwt.sign({
        uid: newuser._id,
        surname: newuser.surname,
        firstname: newuser.firstname,
        email: newuser.email
    }, process.env.SECRET, {expiresIn: '12h'});
    console.log(token);
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
app.get('/takequiz/:quizId', verifyToken,async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        const quizId = req.params.quizId
        const isValid = await ctdCollection.findOne({quizId})
        if (isValid) {
            res.sendFile(path.join(__dirname, '../frontend/takequiz-about.html'))
        }else{
            res.redirect('/')
        }
        
    }else{
        res.redirect('/signup/otp')
    }
})
app.get('/quizzes', verifyToken, async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        res.sendFile(path.join(__dirname, '../frontend/quizzes.html'))
    }else{
        res.redirect('/signup/otp')
    }
})
app.get('/logout', verifyToken, async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        res.sendFile(path.join(__dirname, '../frontend/logout.html'))
    }else{
        res.redirect('/signup/otp')
    }
})
app.get('/user-tkn-quizzes-info', verifyToken, async (req, res) => {
    console.log('reached')
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        return;
    }else{
        const takenQuiz = []
            for(const tq of req.user.takenQuiz) {
                const quizCollection = await quizzesuriconnect.model(tq, quizSchema)
                let quiz = await quizCollection.find({})
                quiz = quiz[0];
                takenQuiz.push({
                    subject: quiz.quizInfo.subject,
                    noQues: quiz.quizInfo.noQues,
                    duration: quiz.quizInfo.duration,
                    quizId: tq,
                    authorName: quiz.authorName
                })
            }
        res.json({
            answer: takenQuiz
        })
    }
})
app.get('/user-ctd-quizzes-info', verifyToken,async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        return;
    }else{
        const createdQuiz = []
            for(const cq of req.user.createdQuiz) {
                const quizCollection = await quizzesuriconnect.model(cq, quizSchema)
                let quiz = await quizCollection.find({})
                quiz = quiz[0];
                createdQuiz.push({
                    subject: quiz.quizInfo.subject,
                    noQues: quiz.quizInfo.noQues,
                    quizId: cq,
                    attemptedBy: quiz.attemptedBy.length
                })
            }
        res.json({
            answer: createdQuiz
        })
    }
})
app.get('/api/takequiz/:quizId', verifyToken, async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        const quizId = req.params.quizId
        const quizCollection = await quizzesuriconnect.model(req.user._id, quizSchema)
        let quiz = await quizCollection.findOne({quizId: quizId})
        res.json({
            subject: quiz.quizInfo.subject,
            noQues: quiz.quizInfo.noQues,
            duration: quiz.quizInfo.interval,
            author: `${req.user.surname} ${req.user.firstname}`
        })
    }else{
        res.redirect('/signup/otp')
    }
})
app.get('/takequiz/:quizId/cand-info', verifyToken, async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        console.log(req.params.quizId);
        res.sendFile(path.join(__dirname, '../frontend/takequiz-cand.html'));
    }else{
        res.redirect('/signup/otp')
    }
})
app.post('/takequiz', verifyToken, async (req, res) => {
    const isExist = await ctdCollection.findOne({ quizId: req.body.quizId})
    console.log(isExist)
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
app.post('/signup/otp/verification', verifyToken,async (req, res) => {
    const recorduserotp = await otpCollection.findOne({ _id: req.user._id })
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
app.post('/update/user/profilepic', verifyToken, upload.single('profilePic'), async (req, res) => {
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
        console.log('result:' + result)
        const user = await usersCollection.findByIdAndUpdate(req.user._id, {profilePic: {url: result.secure_url, public_id: result.public_id}})
        // result.secure_url is the image link
        // res.json({ imageUrl: result.secure_url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload failed" });
        }
})
app.post('/update/user/info', verifyToken, async (req, res) => {
    const newUser = await usersCollection.findByIdAndUpdate(req.user._id, req.body)
    console.log(newUser)
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

app.post('/update',async (req, res) => {
    const emailDelete = req.body.email;
    const userResult = await usersCollection.findOneAndUpdate({ email: emailDelete}, { $push: {takenQuiz: 'c8df61e6-89e9-407d-b14f-9fdb5dfe8df3-mathematics'}});
    res.json({
        result: userResult
        
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
            console.log('unverified')
            return;
        }
        if (recordUser.loggedToken !== 'none') {
            const min = 30 * 60 * 1000;
            const diff = Date.now() - recordUser.lastActive.getTime();
            console.log(diff)
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
        console.log(isValid)
        if(isValid) {
            const token = await jwt.sign({
                    uid: recordUser._id,
                    surname: recordUser.surname,
                    firstname: recordUser.firstname,
                    email: recordUser.email
            }, process.env.SECRET, {expiresIn: '12h'});
            console.log(token)
            console.log('logged in')
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
app.post('/createquiz', verifyToken, async (req, res) => {
    if (req.user === 'tokenissues' || req.user === undefined || req.user === null) { 
        res.redirect('/')
        return;
    }
    if(req.user.verified) {
        console.log(req.body)
        const qid = await uuidv4();
        console.log(qid)
        const quizId = `${qid}-${req.body.quizInfo.subject.toLowerCase()}`
        console.log(quizId)
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
    }else{
        res.redirect('/signup/otp')
    }
})
async function sendOTP(id, email) {
    console.log(id)
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`
    console.log(otp)
    let mailOptions = {
        from: '"Quizzly" <no-reply@myapp.com>',
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
app.post('/create', async (req, res) => {
    console.log(req.body.quizId)
    const result = await ctdCollection.create( { quizId: req.body.quizId } )
    res.json({
        result: result
    })

})
app.get('/api/user/logout', verifyToken,async (req, res) => {
    await usersCollection.findOneAndUpdate({_id: req.user._id}, {loggedToken: 'none'})
    await res.clearCookie('token', {
                httpOnly: true,
                secure: false,
    })

    res.json({message: 'Done'})
})
async function verifyToken(req, res, next) {
    const token = req.cookies.token;
    if (token) {
        try{
            const userPayload = await jwt.verify(token, process.env.SECRET)
            const recordUser  = await usersCollection.findOne({_id: userPayload.uid})
            if (token === recordUser.loggedToken) {
                await usersCollection.findOneAndUpdate({_id: userPayload.uid}, {lastActive: new Date()})
                req.user = recordUser;
            }else {
                req.user = 'tokenissue';
            }
            next()
        }catch (err){
            req.user = 'tokenissue';
            next()
        }
    }else{
        req.user = 'tokenissue';
        next()
    }
}
async function connect() {
    await quizzlyuriconnect;
    await quizzesuriconnect;
    console.log('connected to db');
    app.listen(7050, '0.0.0.0',() => {console.log('pipe conccefte')});
}
connect()