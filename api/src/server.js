import express from'express'
import {build_routes} from './app_routes'
import {build_uses} from'./app_uses'
import {config} from'./config'
import {moongo} from './db/dbaccess/index'

export default function start_server() {
    let app = express()
    build_uses(app)
    build_routes(app)
    app.listen(config.PORT || 4000,()=>{
    }) 
}