import fetch from 'node-fetch';

export default function MakeCallBack(){
    return async (req,res)=>{
        let options = {
            method:req.method
        }
        
        let url = 'http://'+ process.env.CHART_SERVICE+req.originalUrl;
   
        options.headers = req.headers

               
        try {
            let response_ = await fetch(url,options)
            if (response_.status==200){
                let json = await response_.json() 
                res.status(response_.status)
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