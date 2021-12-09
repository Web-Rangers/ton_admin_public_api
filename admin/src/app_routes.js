import {admin_router} from './routes'

function build_routes(app) {
    app.use('/api/v1/admin',admin_router)
    
}

export {build_routes}