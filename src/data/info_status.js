
let status = {
  services:[],
  liteservers:[],
  config_votings:[],
  slashing:[],
  validator_elections:{},
  blocks:[],
}
function update_status(data) {
  if (status!={...data}){
    console.log('aaaaaaaaaaaaa');
  }
  status = {...data}
}
module.exports = {status}