let api_callback= (controller)=>{
  return (req,res,next)=>{  
      const httpRequest ={
          body: req.body,
          query: req.query,
          params: req.params,
          ip: req.ip,
          method: req.method,
          path: req.path,
          headers: {'Access-Control-Allow-Origin': '*',...req.headers}
      }
      controller(httpRequest)
      .then((httpResponse) => {
        if (httpResponse.headers) {
          res.set(httpResponse.headers)
        }
        console.log(httpResponse);
        return res.status(httpResponse.status).send({status:httpResponse.status,message:httpResponse.message,result:httpResponse.result})
      })
      .catch(async (err) => {
        console.log(err);
        res.status(500).send({ error: err })
      })
    }
}

export {api_callback}