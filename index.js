const express = require('express')
const videoRoutes = require('./routes/videos')
// INSTALL cors NPM LIBRARY AND IMPORT
const cors = require('cors')

// REQUIRED LINE OF CODE TO GET ACCESS TO process.env
require('dotenv').config()

const app = express()

app.use(express.json())
// USE CORS TO ENABLE
app.use(cors())

// app.use('/', authMiddleware)

// CREATE VARIABLES FOR YOUR ENVIRONMENT VARIABLES
// PROCESS.ENV = object that contains your environment variables
const PORT = process.env.PORT || 8000
const { VERSION, BASE_PATH } = process.env

// /api/v1/characters
// app.use(`${BASE_PATH}/${VERSION}/characters`, charactersRoutes)
app.use(`/videos`, videoRoutes)

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`)
})