
const {build_admin_controller} = require('./ton_admin')

let AdminController = build_admin_controller()

module.exports = {AdminController}