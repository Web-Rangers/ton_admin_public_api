let api_callback= (controller)=>{
  return (req,res,next)=>{        
      const httpRequest ={
          body: req.body,
          query: req.query,
          params: req.params,
          ip: req.ip,
          method: req.method,
          path: req.path,
          headers: {
            'Content-Type': req.get('Content-Type'),
            Referer: req.get('referer'),
            'User-Agent': req.get('User-Agent')
          }
      }
      controller(httpRequest)
      .then((httpResponse) => {
        return res.status(httpResponse.status).send({status:httpResponse.status,message:httpResponse.message})
      })
      .catch(async (err) => {
        res.status(500).send({ error: err })
      })
    }
}

module.exports = {api_callback}