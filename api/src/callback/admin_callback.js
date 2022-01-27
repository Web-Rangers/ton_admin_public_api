import fetch from 'node-fetch';

export default function MakeCallBack(){
    return async (req,res)=>{
        let options = {
            method:req.method
        }
        
        let url = 'http://'+ process.env.ADMIN_SERVICE+req.originalUrl;
   
        options.headers = req.headers
        if(req.method == 'GET'){
            if (Object.keys(req.query).length) {
                url += '?'
                
                let params = Object.entries(req.query).map(element=>`${element[0]}=${element[1]}`);
                url += params.join('&')
            }
            console.log(url);
            
        }
        else{
            options.body = JSON.stringify(req.body)
        }
               
        try {
            let response_ = await fetch(url,options)
            if (response_.status==200){
                let json = await response_.json() 
                res.status(json.status)
                res.send(json); 
            }
            else{
                res.status(response_.status)
                res.send({status:response_.status});   
            }
               
        } catch (error) {
            res.status(400)
            console.log(error);
            
            res.send(error); 
        }
           
    }
}