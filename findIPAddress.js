//determine ip address of this computer on network
var os = require( 'os' );
module.exports = os.networkInterfaces( ).en0[1].address.replace("Interfaces ","");
console.log(os.networkInterfaces( ).en0[1].address.replace("Interfaces ",""));

