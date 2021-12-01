const {admin_router} = require('./routes')

function build_routes(app) {
    app.use('/api/v1/admin',admin_router)
    
}

module.exports = {build_routes}