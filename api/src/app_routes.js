import {bridge_router,metric_router,service_router,chart_router} from './routes'
import MakeCallBack from './callback/admin_callback'
import MakeChartCallBack from './callback/chart_callback'

function build_routes(app) {
    app.use('/api/v1/bridge',bridge_router)
    app.use('/api/v1/status',metric_router)
    app.use('/api/v1/service',service_router)
    app.use('/api/v1/admin',MakeCallBack())
    app.use('/api/v1/chart',chart_router)
}

export {build_routes}
