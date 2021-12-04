import EventEmitter from 'events'
const emitter = new EventEmitter()
import {Status} from '../db/models'

class Status_{
    async update_status(data){
        try {
            let status =await Status.findOne({})
            if (!status){
                status = new Status()
            }
            let change = false
            for (let kw of Object.entries(data)) {
                let [key,val] = kw
                if(status[key]){
                    if (Object.keys(val).length>0){
                        for (let vkw of Object.entries(val)) {
                            let [vkey,vval] = vkw
                            status[key][vkey] = vval
                        }
                        change = true
                    }
                    else{
                        if(status[key]!=val){
                            change = true
                        }
                        if (status[key]){
                            status[key] = val  
                        } 
                    }
                }     
            }
<<<<<<< HEAD
=======
            delete status.__v
>>>>>>> efe4555 (bla)
            await status.save()
            if (change)
                emitter.emit('data_change',status)
        } catch (error) {
           console.log(error); 
        }
        
    }

    get_status(){
        return this.status
    }
}
const status = new Status_()
export {status,emitter}