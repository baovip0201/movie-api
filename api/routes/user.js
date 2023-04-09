const express = require('express')
const router = express.Router()
const signupSchema = require("../models/user-schema")
const bcrypt = require("bcrypt")
const bodyParser = require("body-parser")
const jwt = require('jsonwebtoken')

module.exports = router

router.use(bodyParser.json())
router.post('/signup', async (req, res) => {
    try {
        //console.log(req.body)
        const { name, username, password, confirmPassword } = req.body
        const hashPassword = await bcrypt.hash(password, 10)
        if (password !== confirmPassword) return res.status(400).send("Mật khẩu không khớp")
        signupSchema.findOne({ userName: username }).then(async (data) => {
            if (!data) {
                await signupSchema.create({
                    name: name,
                    userName: username,
                    password: hashPassword
                })
                return res.send("Đăng kí thành công")
            } else res.status(409).send("Tên người dùng đã tồn tại")
        })
    } catch (error) {
        console.log(error)
        res.status(500).send('Internal server error')
    }
})

router.post('/login', async (req, res) => {
    const { username, password } = req.body
    try {
        signupSchema.findOne({ userName: username })
            .then(async (data) => {
                if (data) {
                    bcrypt.compare(password, data.password, (err, result) => {
                        if (err) {
                            return res.status(401).send('Auth failed')
                        }
                        if (result) {
                            const token = jwt.sign(
                                {
                                    userID: data._id,
                                    username: data.userName
                                },
                                process.env.JWT_SECRET,
                                { expiresIn: "1h" })
                            return res.status(200).send({ message: 'Auth successful', token: token })
                        }
                    })
                }
                else return res.status(401).send('Auth failed')
            })

    } catch (error) {
        res.status(500).send('Internal server error')
    }
})