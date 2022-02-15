import {get_tonuniverse_rate,get_whales_rate} from './index'
async function pools_observer() {
    //await get_tonuniverse_rate()
    await get_whales_rate()
}
export default pools_observer