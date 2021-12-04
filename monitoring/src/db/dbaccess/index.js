import mongoose from 'mongoose'
import {config} from '../../config'
<<<<<<< HEAD

=======
import {Status} from '../models'
>>>>>>> efe4555 (bla)
function connection(){
    const res = mongoose.connect(config.DM_DB_URI)
    return res
}
connection()

const moongo = mongoose.connection;
moongo.on("error", console.error.bind(console, "MongoDB connection error: "));

<<<<<<< HEAD

=======
>>>>>>> efe4555 (bla)
export  {moongo}