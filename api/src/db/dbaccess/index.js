import mongoose from 'mongoose'
import {config} from '../../config'
import {Status} from '../models'

function connection(){
    const res = mongoose.connect(config.DM_DB_URI)
    return res
}
connection()

const moongo = mongoose.connection;
moongo.on("error", console.error.bind(console, "MongoDB connection error: "));


export  {moongo}