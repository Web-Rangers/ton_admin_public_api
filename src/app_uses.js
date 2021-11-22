let express = require('express')
let cookieParser= require('cookie-parser')

function build_uses(app) {
    app.use(express.json());
    app.use(cookieParser());
    app.set('etag', false)
    app.use(express.urlencoded({ extended: true }));
}

module.exports = {build_uses}