const {bridge_router,metric_router,service_router} = require('./routes')

function build_routes(app) {
    app.use('/bridge',bridge_router)
    app.use('/metric',metric_router)
    app.use('/service',service_router)
}

module.exports = {build_routes}