const express = require('express')
const router = express.Router()
const connection = require('../config/database.js')

router.post('/', (req, res) => {
    console.log('req.body = ', req.body)

    const id = req.body.userInfo.username
    const pw = req.body.userInfo.password

    connection.query(`SELECT LOGIN_ID FROM TB_MBR2 WHERE LOGIN_ID = ? AND LOGIN_PW = ?`
        , [id, pw]
        , (err, rows) => {
    
    if (err) return res.status(401).json({err:'에러발생'})

    if (rows.length) {

      console.log(rows)
      
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


