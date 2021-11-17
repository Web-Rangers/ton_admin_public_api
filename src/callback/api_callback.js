module.exports = (req,res,next)=>{
    return (req,res,next)=>{        
        const httpRequest ={
            body: req.body,
            query: req.query,
            files: req.files,
            cookie: req.cookies,
            params: req.params,
            ip: req.ip,
            method: req.method,
            path: req.path,
            headers: {
              'Content-Type': req.get('Content-Type'),
              'Access-Control-Allow-Origin': 'http://localhost:3000',
              Referer: req.get('referer'),
              'User-Agent': req.get('User-Agent')
            }
        }
        console.log(httpRequest);
        controller(httpRequest)
        .then((httpResponse) => {
          
          // if(httpResponse.cookie){
            
          //   res.cookie('token',httpResponse.cookie,{ sameSite: 'none', secure: true });
            
          // }    
          // res.type('json')
          // res.status(httpResponse.status).send(httpResponse)
          return httpResponse.sendResponse(req,res,next)
        })
        .catch(async (err) => {
          if (!errorHandler.isTrustedError(err)) {
              res.status(500).send({ error: err })
          }
          await errorHandler.handleError(err);
          
          res.status(err.httpCode)
          return res.send({status:err.httpCode,message:err.name,content:err.content})
        })
      }
}