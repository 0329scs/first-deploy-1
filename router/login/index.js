const express = require('express')
const router = express.Router()
const connection = require('../config/database.js')
const crypto = require('crypto')
const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
    console.log('req.body = ', req.body)

    const id = req.body.userInfo.username
    let pw = req.body.userInfo.password
    let result = false

    //아이디 비밀번호를 받아서
    connection.query(`SELECT LOGIN_ID, LOGIN_PW, SALT FROM TB_MBR WHERE LOGIN_ID = ?`
        , [id]
        , (err, rows) => {
    
    if (err) return res.status(401).json({err:'에러발생'})
    console.log('salt = ',rows[0].SALT)
    console.log('pw = ', rows[0].LOGIN_PW);
    
    crypto.pbkdf2(pw, rows[0].SALT, 100000, 64, 'sha512', (err, key) => {
      // 결과값 변환
      console.log('password = ', key.toString('base64'))
      pw = key.toString('base64')
      
      // reslove(password)
      result = pw === rows[0].LOGIN_PW
      console.log(result);
      console.log('변환 후 pw = ', pw);
      console.log('데이터베이스 받은 pw = ', rows[0].LOGIN_PW);

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
    
    

    // 사용자가 올린 비밀번호 pw, 아이디로 검색한 비밀번호가 맞는지 확인한다
    // const result = await bcrypt.compare(pw, rows[0].LOGIN_PW)
    // const result = await crypto.compare([pw, rows[0].LOGIN_PW])

    // if (result) {

    //   const resData = {}
    //   console.log('===================');
    //   return
    //   resData.ok = true
    //   resData.body = rows[0]

    //   res.status(200)
    //   res.json(resData)

    // } else {
    //     return res.status(401).json({err:'일치하는 정보가 없습니다'})
    // }
  })
})


module.exports = router


