const express = require('express')
const app = express()
const morgan = require('morgan')
const port = 3009
const bodyParser = require('body-parser')

const users = require('./users')
const songs = require('./songs')

app.use(bodyParser.json())
app.use(morgan('combined'))

app.use('/', users)
app.use('/', songs)


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})