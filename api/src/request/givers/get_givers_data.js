
import axios from 'axios'

async function get_givers_data() {
    let response = await axios.get("https://ton.org/miningdt/")
    if (response&&!response.data.error){
        return response.data.giver_balances
    }
    return 'not available now'
}
    
export {get_givers_data}