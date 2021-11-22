let express = require('express')
let cookieParser= require('cookie-parser')
let logger = require('morgan')
let cors = require('cors')

function build_uses(app) {
    app.use(cors({origin:'http://localhost:3000', credentials:true}));
    app.use(express.json());
    app.use(cookieParser());
    app.set('etag', false)
    app.use(logger('dev'))
    app.use(express.urlencoded({ extended: true }));
}

module.exports = {build_uses}