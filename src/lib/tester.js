var IP = require('./ipv4-tools.js').IPv4Tools;
var ip = new IP();


ip.getNetworkData('218.249.94.2', function(error, data){console.log(data);});
