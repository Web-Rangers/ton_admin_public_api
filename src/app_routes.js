const {bridge_router,metric_router,service_router} = require('./routes')

function build_routes(app) {
    app.use('/api/bridge',bridge_router)
    app.use('/api/metric',metric_router)
    app.use('/api/service',service_router)
}

module.exports = {build_routes}