let api_callback= (controller)=>{
  return (req,res,next)=>{        
      const httpRequest ={
          body: req.body,
          query: req.query,
          params: req.params,
          ip: req.ip,
          method: req.method,
          path: req.path,
          headers: req.headers
      }
      controller(httpRequest)
      .then((httpResponse) => {
        return res.status(httpResponse.status).send({status:httpResponse.status,message:httpResponse.message,data:httpResponse.data})
      })
      .catch(async (err) => {
        console.log(err);
        res.status(500).send({ error: err })
      })
    }
}

module.exports = {api_callback}