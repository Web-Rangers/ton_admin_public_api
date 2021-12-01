import express from 'express'
import cookieParser from'cookie-parser'
import logger  from 'morgan'
import cors from 'cors'

function build_uses(app) {
    app.use(cors({origin:'http://localhost:3000', credentials:true}));
    app.use(express.json());
    app.use(cookieParser());
    app.set('etag', false)
    app.use(logger('dev'))
    app.use(express.urlencoded({ extended: true }));
}

export {build_uses}