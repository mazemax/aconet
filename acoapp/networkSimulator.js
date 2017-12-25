var Promise = require('bluebird');
var address,
    ifaces = require('os').networkInterfaces();
var nmap = Promise.promisifyAll(require('libnmap'));
var net = require('net');
var neighbours = [];

// Iterate over interfaces to get current ip address ...
for (var dev in ifaces) {
    ifaces[dev].filter(function(details) {
        (details.family === 'IPv4' && details.internal === false) ? address = details.address: undefined;
    });
}
console.log("Current IP/port");
console.log(address);

function getNeighbors(address){
    try{
        // aquire information about neighbors
        var opts = {
            ports: '8080-8180',
            range: [
                '172.18.0.2-120'
            ]
        };

        return nmap.scanAsync(opts).then(function(report){
            // console.log(JSON.stringify(report));
            var hostArray = [];
            for (var item in report) {
                var hostObj = report[item].host;
                hostArray = hostObj.map(function(host) {
                    return host.address[0]['item']['addr'];
                });
            }

            neighbours = hostArray.filter(e => e !== address);
            return neighbours;
            // console.log(neighbours);
        });
    }
    catch(e){
        console.log(e);
    }
}

module.exports = function networkSimulator(server) {

    Promise.delay(5000).then(function(server) {
        console.log('Network Simulator Started...');

        Promise.resolve(getNeighbors(address)).then(function(nodes) {
            // console.log(nodes);

            // Send data
            nodes.forEach(function(ipAddress) {
                console.log(ipAddress);

                var client = net.createConnection(8080, ipAddress, function() {
                    console.log(address+' is Connected to '+ipAddress);
                    client.write('Hello, server! Love, Client.');
                });

                client.on('data', function(data) {
                    console.log('Received: ' + data.toString());
                    // client.destroy(); // kill client after server's response
                });

                client.on('end', function() {
                    console.log(address+' is disconnected from '+ipAddress);
                });
            });
        });

        console.log('Network Simulator Ended...');
    });

};