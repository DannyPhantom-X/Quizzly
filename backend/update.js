const express = require('express')
const updateRouter= express.Router()
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2
const multer = require('multer')
const streamifier = require('streamifier')
const storage = multer.memoryStorage();
const upload = multer({ storage });
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
        console.log('result:' + result)
        const user = await usersCollection.findByIdAndUpdate(req.user._id, {profilePic: {url: result.secure_url, public_id: result.public_id}})
        // result.secure_url is the image link
        // res.json({ imageUrl: result.secure_url });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Upload failed" });
        }
})
updateRouter.post('/update', verifyToken, async (req, res) => {
    const newUser = await usersCollection.findByIdAndUpdate(req.user._id, req.body)
    console.log(newUser)
})

updateRouter.get('/', verifyToken, async (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/profile.html'))
})

module.exports = updateRouter