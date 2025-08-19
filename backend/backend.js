const express = require('express')
const nodemailer = require('nodemailer')
const bcrypt = require('bcrypt')
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


const transport = nodemailer.createTransport({
    service: 'gmial',
    auth: {
        user: 'dtaiwo453@gmail.com',
        pass: 'Dann33_07'
    }
})



app.post('/signup', (req, res) => {
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
    let mailOptions = {
        from: 'dtaiwo453@gmail.com',
        to: 'dev.phantomx7@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    transport.sendMail(mailOptions, () => {
        console.log('email sent')
    })
    
})

app.listen(7050)