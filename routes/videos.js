const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const fs = require('fs')

router.get('/', (req, res) => {
  const fileData = JSON.parse(fs.readFileSync(`./data/video.json`))

  return res.status(200).json(fileData)
})

router.post('/', (req, res) => {
  const body = req.body
  const newVideo = {
    id: uuidv4(),
    ...body
  }

  const fileData = JSON.parse(fs.readFileSync(`./data/video.json`))

  fs.writeFileSync('./data/video.json', JSON.stringify([ newVideo, ...fileData ]))

  return res.status(200).json(newVideo)
})

module.exports = router