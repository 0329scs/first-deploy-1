const express = require('express')
const router = express.Router()
const connection = require('../config/database.js')
const crypto = require('crypto')

router.post('/', (req, res) => {
  console.log('==== registration ====')

  console.log('req.body = ', req.body)

  let { usermail, password } = req.body.form

  // promise
  const changePassword = () => {
    return new Promise((reslove, reject) => {
        // 랜덤 바이트 64바이트 생성
        crypto.randomBytes(64, (err, buf) => {
          // 버퍼 문자열 변환
          const salt = buf.toString('base64')
          console.log('salt = ', salt)
          // pbkdf2 메서드에 ( 비밀번호, 위의salt, 10만번 반복, 출력바이트, 해시알고리즘)
          crypto.pbkdf2(password, salt, 100000, 64, 'sha512', (err, key) => {
              // 결과값 변환
              console.log('password = ', key.toString('base64'))
              password = key.toString('base64')
              
              reslove(password)
          })
        })
    })
  }
  changePassword()
    .then(resPwd => {
      connection.query(`INSERT INTO TB_MBR
                        (
                          LOGIN_ID
                        , LOGIN_PW

                        )
                        VALUES
                        (
                          ?
                        , ?
                        )` 
                        , [ usermail, resPwd ], (err, rows) => {

                        console.log('============= 쿼리 날린 후 =============')
                        
                        if (err) return res.status(401).json({err:'에러발생'})           

                        console.log(rows);

                        if(rows.affectedRows > 0) {

                            const resData = {}
  
                            resData.ok = true
  
                            res.status(200)
                            res.end(JSON.stringify(resData))
                        }
      })
    })
})

module.exports = router

