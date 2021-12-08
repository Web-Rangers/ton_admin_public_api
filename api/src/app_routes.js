import {bridge_router,metric_router,service_router} from './routes'
import MakeCallBack from './callback/admin_callback'
import MakeChartCallBack from './callback/chart_callback'

function build_routes(app) {
    app.use('/api/v1/bridge',bridge_router)
    app.use('/api/v1/metric',metric_router)
    app.use('/api/v1/service',service_router)
    app.use('/api/v1/admin',MakeCallBack())
    app.use('/api/v1/chart',MakeChartCallBack())
}

export {build_routes}
