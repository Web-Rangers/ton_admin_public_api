const {liteservers_observer} = require('../../../helpers/liteservers_observer/LiteserversObserver')

function get_liteservers() {
    return liteservers_observer.get_liteservers()
}

module.exports = {get_liteservers}