import {bridge_router,metric_router,service_router,chart_router} from './routes'

function build_routes(app) {
    app.use('/api/bridge',bridge_router)
    app.use('/api/metric',metric_router)
    app.use('/api/service',service_router)
    app.use('/api/chart',chart_router)
}

export {build_routes}
