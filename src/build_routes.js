const {bridge_router} = require('./routes')

function build_routes(app) {
    app.use('/bridge',bridge_router)
}

module.exports = {build_routes}