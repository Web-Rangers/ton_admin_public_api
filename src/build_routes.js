const {bridge_router,metric_router} = require('./routes')

function build_routes(app) {
    app.use('/bridge',bridge_router)
    app.use('/metric',metric_router)
}

module.exports = {build_routes}