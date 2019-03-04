const express = require('express')
const router = express.Router()
const connection = require('../config/database.js')
const crypto = require('crypto')
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
    console.log('req.body = ', req.body)

    const id = req.body.userInfo.username
    const pw = req.body.userInfo.password


    //아이디 비밀번호를 받아서
    connection.query(`SELECT LOGIN_ID, LOGIN_PW FROM TB_MBR WHERE LOGIN_ID = ?`
        , [id]
        , async (err, rows) => {
    
    if (err) return res.status(401).json({err:'에러발생'})

    // 사용자가 올린 비밀번호 pw, 아이디로 검색한 비밀번호가 맞는지 확인한다
    const result = await bcrypt.compare(pw, rows[0].LOGIN_PW)
    // const result = await crypto.compare([pw, rows[0].LOGIN_PW])

    if (result) {

      const resData = {}

      resData.ok = true
      resData.body = rows[0]

      res.status(200)
      res.json(resData)

    } else {
        return res.status(401).json({err:'일치하는 정보가 없습니다'})
    }
  })
})


module.exports = router


