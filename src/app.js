const path = require('path')
const http = require('http')
const express = require('express')
const hbs = require('hbs')
const app = express()
const server = http.createServer(app)
app.use(express.json())

// Define path for Express Config

const publicDirectoryPath = path.join(__dirname, '..', 'public')
const viewPath = path.join(__dirname, '..', 'temp', 'views')
const partialsPath = path.join(__dirname, '..', 'temp', 'partials')
// setup handlebars engine & views locations
app.set('view engine', 'hbs')
app.set('views', viewPath)
hbs.registerPartials(partialsPath)

// Setup static directory to Serve 
app.use(express.static(publicDirectoryPath))
app.get('', (req, res) => {
    res.render('index', {
        name: 'Mohammed Qattan'
    })
})



module.exports = server