import {get_complaints_list} from './complains'
import {get_offers_list} from './offers_list'
import {get_status} from './status'

const json_rpc_monitor = {get_complaints_list,get_offers_list,get_status}

export {json_rpc_monitor}