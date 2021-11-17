
let status = {

}
function update_status(data) {
  if (status!={...data}){
    console.log('aaaaaaaaaaaaa');
  }
  status = {...data}
}
module.exports = {status}