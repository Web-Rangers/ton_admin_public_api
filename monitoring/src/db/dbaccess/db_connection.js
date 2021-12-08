import mongoose from 'mongoose'


class DbConnection{
    constructor(url,scemas){
        this.__connection = mongoose.createConnection(url)
        this.models = {}
        for (let [key,val] of Object.entries(scemas)) {
            this.models[key]=this.__connection.model(key,val)
        }
    }
    is_connected(){
        return this.__connection.readyState==1
    }
}

export default DbConnection