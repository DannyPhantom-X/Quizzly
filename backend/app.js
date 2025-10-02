const express = require('express')
const app = express()
const mongoose = require('mongoose')
require('dotenv').config()
const cookieParser = require('cookie-parser')
const path = require('path')
const cors = require('cors')
const {authVerifyToken, verifyToken, quizzesuriconnect, quizzlyuriconnect} = require('./general')
const signupRouter = require('./signup')
const loginRouter = require('./login')
const updateRouter = require('./update')
const takeQuizRouter = require('./takequiz')
const createQuizRouter = require('./createquiz')
const expressSession = require('express-session')
const quizzesRouter = require('./quizzes')
const jwt = require('jsonwebtoken')
const {usersCollection, otpCollection, ctdCollection, quizSchema} = require('./models')
app.use(cookieParser())
 app.use(expressSession({
    secret: "supersecretkey",
    resave: false,
    saveUninitialized: true
}))
app.use(cors())
app.use(express.json())
// app.use(express.urlencoded({ extended: true}))
app.use('/public/', express.static(path.join(__dirname, '../frontend/public')))
app.use('/signup', signupRouter)
app.use('/login', loginRouter)
app.use('/createquiz', createQuizRouter)
app.use('/takequiz', takeQuizRouter)
app.use('/myprofile', updateRouter)
app.use('/quizzes', quizzesRouter)

app.get('/', async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/home.html'))
})
app.get('/logout', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/logout.html'))
})
app.get('/api/user/logout', verifyToken,async (req, res) => {
    await usersCollection.findOneAndUpdate({_id: req.user._id}, {loggedToken: 'none'})
    await res.clearCookie('token', {
                httpOnly: true,
                secure: false,
    })

    res.json({message: 'Done'})
})  
app.get('/api/currentuser', async (req, res) => {
    function failed() {
        res.json({
            statuz: 'failed',
            message: 'NO CURRENT USER ❌'            
        })
    }
    const token = req.cookies.token;
    if (token) {
        try{
            const userPayload = await jwt.verify(token, process.env.SECRET)
            const recordUser  = await usersCollection.findOne({_id: userPayload.uid})
            if (token === recordUser.loggedToken) {
                await usersCollection.findOneAndUpdate({_id: userPayload.uid}, {lastActive: new Date()})
                req.user = recordUser;
                const profilePic =  req.user.profilePic ? req.user.profilePic.url : null;
                res.json({
                    statuz: 'success',
                    firstname: req.user.firstname,
                    surname: req.user.surname,
                    email: req.user.email,
                    profilePic: profilePic
                }) 
            }else{
                failed()
            }
        }catch (err){
            failed()
        }
    }else{
        failed()
    }
})
async function connect() {
    await quizzlyuriconnect;
    await quizzesuriconnect;
    app.listen(7000, '0.0.0.0',() => {console.log('Listening on port 7000')});
}
connect()