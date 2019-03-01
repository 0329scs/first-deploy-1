const express = require('express')
const router = express.Router()

const notice = require('./notice')
const login = require('./login')
const registration = require('./registration')


router.use('/notice', notice)
router.use('/login', login)

router.use('/registration', registration)

module.exports = router